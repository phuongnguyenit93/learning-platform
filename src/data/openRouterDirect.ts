/**
 * Browser-only OpenRouter Chat Completions adapter (BYOK).
 * Requests go directly to OpenRouter; keys and history stay in page memory.
 * https://openrouter.ai/docs/api/reference/overview
 */
export const OPENROUTER_MODELS = [
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', label: 'Nemotron 3 Ultra · Chuyên sâu' },
  { id: 'google/gemma-4-26b-a4b-it:free', label: 'Gemma 4 26B · Cân bằng' },
  { id: 'nvidia/nemotron-3.5-lightning:free', label: 'Nemotron 3.5 Lightning · Nhanh' },
  { id: 'cohere/north-mini-code:free', label: 'North Mini Code · Coding' },
  { id: 'recursive/flint-v1.0:free', label: 'Flint · Coding' },
  { id: 'nvidia/nemotron-3.5-super-vl:free', label: 'Nemotron 3.5 Super VL' },
  { id: 'openrouter/free', label: 'Free Auto Router · Tự động' },
] as const;

export type OpenRouterModelId = (typeof OPENROUTER_MODELS)[number]['id'];
export const OPENROUTER_DEFAULT_MODEL: OpenRouterModelId = 'nvidia/nemotron-3-ultra-550b-a55b:free';
export const OPENROUTER_USAGE_URL = 'https://openrouter.ai/activity';
export const OPENROUTER_FREE_MODELS_URL = 'https://openrouter.ai/collections/free-models';

const CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';

export type OpenRouterErrorCode = 'auth' | 'quota' | 'model' | 'request' | 'network' | 'server' | 'response';
export type OpenRouterTurn = { user: string; assistant: string };
export type OpenRouterMessage = { role: 'user' | 'assistant'; content: string };

export class OpenRouterApiError extends Error {
  constructor(public readonly code: OpenRouterErrorCode) {
    super(code); // Never surface raw provider messages, which might include secrets.
    this.name = 'OpenRouterApiError';
  }
}

interface StreamOpenRouterOptions {
  apiKey: string;
  model: OpenRouterModelId;
  prompt: string;
  turns: readonly OpenRouterTurn[];
  signal: AbortSignal;
  onText: (text: string) => void;
  fetcher?: typeof fetch;
}

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
}

function mapError(status: number, payload: unknown): OpenRouterApiError {
  const error = asObject(asObject(payload)?.error);
  const message = String(error?.message ?? '');
  const code = String(error?.code ?? '');
  if (status === 401 || status === 403) return new OpenRouterApiError('auth');
  if (status === 402 || status === 429) return new OpenRouterApiError('quota');
  if (status === 404 || (status === 400 && /model|provider/i.test(code + ' ' + message)
    && /not available|not found|no endpoints|invalid|unavailable/i.test(message))) {
    return new OpenRouterApiError('model');
  }
  if (status >= 500) return new OpenRouterApiError('server');
  return new OpenRouterApiError('request');
}

/**
 * Reuse only complete, successful prior turns. Protect the shared free-model
 * request quota from unbounded replay of the whole page session.
 */
export function buildOpenRouterMessages(turns: readonly OpenRouterTurn[], prompt: string): OpenRouterMessage[] {
  const retained: OpenRouterTurn[] = [];
  let chars = 0;
  for (let index = turns.length - 1; index >= 0 && retained.length < 8; index--) {
    const turn = turns[index];
    const size = turn.user.length + turn.assistant.length;
    if (chars + size > 12_000) break;
    retained.unshift(turn);
    chars += size;
  }
  return [
    ...retained.flatMap((turn): OpenRouterMessage[] => [
      { role: 'user', content: turn.user },
      { role: 'assistant', content: turn.assistant },
    ]),
    { role: 'user', content: prompt },
  ];
}

/** SSE frames can split across byte chunks; only commit a completed reply. */
export async function streamOpenRouterMessage({
  apiKey, model, prompt, turns, signal, onText, fetcher = fetch,
}: StreamOpenRouterOptions): Promise<{ text: string; turn: OpenRouterTurn }> {
  let response: Response;
  try {
    response = await fetcher(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages: buildOpenRouterMessages(turns, prompt),
        stream: true,
        max_tokens: 2048,
      }),
      signal,
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new OpenRouterApiError('network');
  }

  if (!response.ok) {
    let payload: unknown;
    try { payload = await response.json(); } catch { /* May not be JSON. */ }
    throw mapError(response.status, payload);
  }
  if (!response.body) throw new OpenRouterApiError('response');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = '';
  let text = '';
  let completed = false;
  let finishReason: string | null = null;

  function processFrame(frame: string) {
    const event = frame.split(/\r?\n/).find((line) => line.startsWith('event:'))?.slice(6).trim();
    const data = frame.split(/\r?\n/)
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart()).join('\n');
    if (!data) return; // Keepalives.
    if (data.trim() === '[DONE]') {
      completed = true;
      return;
    }
    if (event === 'error') throw new OpenRouterApiError('server');
    let value: unknown;
    try { value = JSON.parse(data); } catch { throw new OpenRouterApiError('response'); }
    const chunk = asObject(value);
    if (!chunk) throw new OpenRouterApiError('response');
    if (chunk.error) throw new OpenRouterApiError('server');
    if (!Array.isArray(chunk.choices) || chunk.choices.length === 0) return; // Usage-only chunk.
    const choice = asObject(chunk.choices[0]);
    if (!choice || choice.index !== 0) throw new OpenRouterApiError('response');
    const delta = asObject(choice.delta);
    if (delta && delta.content !== undefined && delta.content !== null) {
      if (typeof delta.content !== 'string') throw new OpenRouterApiError('response');
      text += delta.content;
      onText(text);
    }
    if (choice.finish_reason !== null && choice.finish_reason !== undefined) {
      if (typeof choice.finish_reason !== 'string') throw new OpenRouterApiError('response');
      finishReason = choice.finish_reason;
    }
  }

  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      pending += decoder.decode(next.value, { stream: true });
      if (pending.length > 1_000_000) throw new OpenRouterApiError('response');
      let separator: RegExpExecArray | null;
      while ((separator = /\r?\n\r?\n/.exec(pending)) !== null) {
        processFrame(pending.slice(0, separator.index));
        pending = pending.slice(separator.index + separator[0].length);
      }
    }
    pending += decoder.decode();
    if (pending.trim()) processFrame(pending);
  } catch (error) {
    if (signal.aborted) throw error;
    if (error instanceof OpenRouterApiError) throw error;
    throw new OpenRouterApiError('network');
  } finally {
    reader.releaseLock();
  }
  if (!completed || finishReason !== 'stop' || !text.trim()) throw new OpenRouterApiError('response');
  return { text, turn: { user: prompt, assistant: text } };
}
