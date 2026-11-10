/**
 * Browser-only, bring-your-own-key Groq Chat Completions adapter.
 * Never persists visitor credentials or conversation state, or uses our Worker.
 * https://console.groq.com/docs/openai
 */
export const GROQ_MODELS = [
  { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B · Chuyên sâu' },
  { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B · Nhanh' },
  { id: 'qwen/qwen3.8-27b', label: 'Qwen 3.8 27B · Coding (Preview)' },
] as const;

export type GroqModelId = (typeof GROQ_MODELS)[number]['id'];
export const GROQ_DEFAULT_MODEL: GroqModelId = 'openai/gpt-oss-120b';
export const GROQ_LIMITS_URL = 'https://console.groq.com/settings/limits';
const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';

export type GroqErrorCode = 'auth' | 'quota' | 'model' | 'request' | 'network' | 'server' | 'response';
export type GroqMessage = { role: 'user' | 'assistant'; content: string };
export type GroqTurn = { user: string; assistant: string };

export class GroqApiError extends Error {
  constructor(public readonly code: GroqErrorCode) {
    super(code); // Never expose the provider's raw error message (may contain secrets).
    this.name = 'GroqApiError';
  }
}

interface StreamGroqOptions {
  apiKey: string;
  model: GroqModelId;
  prompt: string;
  turns: readonly GroqTurn[];
  signal: AbortSignal;
  onText: (text: string) => void;
  fetcher?: typeof fetch;
}

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
}

function errorForStatus(status: number, payload?: unknown): GroqApiError {
  const error = asObject(asObject(payload)?.error);
  const code = String(error?.code ?? '');
  const message = String(error?.message ?? '');
  if (status === 401 || status === 403 || (status === 400 && /invalid.api.key|invalid_api_key/i.test(code + ' ' + message))) {
    return new GroqApiError('auth');
  }
  if (status === 429) return new GroqApiError('quota');
  if (status === 404 || (/model/i.test(code + ' ' + message) && /not found|not available|decommissioned|not exist/i.test(message))) {
    return new GroqApiError('model');
  }
  if (status >= 500) return new GroqApiError('server');
  return new GroqApiError('request');
}

/** Keep a modest amount of successful context to avoid exhausting Free Tier TPM.
 * Always preserve paired user/assistant messages, newest first within the cap. */
export function buildGroqMessages(turns: readonly GroqTurn[], prompt: string): GroqMessage[] {
  const retained: GroqTurn[] = [];
  let chars = 0;
  for (let i = turns.length - 1; i >= 0 && retained.length < 8; i--) {
    const turn = turns[i];
    const size = turn.user.length + turn.assistant.length;
    if (chars + size > 12_000) break;
    retained.unshift(turn);
    chars += size;
  }
  return [
    ...retained.flatMap((turn): GroqMessage[] => [
      { role: 'user', content: turn.user },
      { role: 'assistant', content: turn.assistant },
    ]),
    { role: 'user', content: prompt },
  ];
}

/** OpenAI-compatible SSE streaming; event frames may span arbitrary chunks. */
export async function streamGroqMessage({
  apiKey, model, prompt, turns, signal, onText, fetcher = fetch,
}: StreamGroqOptions): Promise<{ text: string; turn: GroqTurn }> {
  let response: Response;
  try {
    response = await fetcher(GROQ_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages: buildGroqMessages(turns, prompt),
        stream: true,
        max_completion_tokens: 2048,
        ...(model.startsWith('openai/') ? { include_reasoning: false } : { reasoning_format: 'hidden' }),
      }),
      signal,
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new GroqApiError('network'); // Includes browser CORS / offline failures.
  }

  if (!response.ok) {
    let payload: unknown;
    try { payload = await response.json(); } catch { /* Response may not be JSON. */ }
    throw errorForStatus(response.status, payload);
  }
  if (!response.body) throw new GroqApiError('response');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';
  let doneMarker = false;
  let finishReason: string | null = null;

  function parseFrame(frame: string): void {
    const data = frame.split(/\r?\n/)
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart())
      .join('\n');
    if (!data) return;
    if (data.trim() === '[DONE]') {
      doneMarker = true;
      return;
    }
    let value: unknown;
    try { value = JSON.parse(data); } catch { throw new GroqApiError('response'); }
    const parsed = asObject(value);
    if (!parsed) throw new GroqApiError('response');
    if (parsed.error) throw new GroqApiError('server');
    const choices = parsed.choices;
    if (!Array.isArray(choices) || !choices.length) return; // Possible usage-only chunk.
    const choice = asObject(choices[0]);
    if (!choice || choice.index !== 0) throw new GroqApiError('response');
    const delta = asObject(choice.delta);
    if (delta && delta.content !== undefined && delta.content !== null) {
      if (typeof delta.content !== 'string') throw new GroqApiError('response');
      text += delta.content;
      onText(text);
    }
    if (choice.finish_reason !== null && choice.finish_reason !== undefined) {
      if (typeof choice.finish_reason !== 'string') throw new GroqApiError('response');
      finishReason = choice.finish_reason;
    }
  }

  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      buffer += decoder.decode(next.value, { stream: true });
      if (buffer.length > 1_000_000) throw new GroqApiError('response');
      let separator: RegExpExecArray | null;
      while ((separator = /\r?\n\r?\n/.exec(buffer)) !== null) {
        parseFrame(buffer.slice(0, separator.index));
        buffer = buffer.slice(separator.index + separator[0].length);
      }
    }
    buffer += decoder.decode();
    if (buffer.trim()) parseFrame(buffer);
  } catch (error) {
    if (signal.aborted) throw error;
    if (error instanceof GroqApiError) throw error;
    throw new GroqApiError('network');
  } finally {
    reader.releaseLock();
  }
  if (!doneMarker || finishReason !== 'stop' || !text.trim()) throw new GroqApiError('response');
  return { text, turn: { user: prompt, assistant: text } };
}
