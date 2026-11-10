/**
 * Browser-only Gemini adapter. The visitor supplies their own API key.
 * Neither the key nor the conversation is persisted or sent through our Worker.
 *
 * Interactions API: https://ai.google.dev/gemini-api/docs/get-started
 * Stateless multi-turn: always replay the FULL model steps (including thought
 * signatures), never just the visible assistant text.
 */
/** Text-output models supported by the Gemini Interactions API. Availability
 * and free-tier allowances still depend on the visitor's Google AI project. */
export const GEMINI_MODELS = [
  { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash' },
  { id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash' },
  { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash' },
  { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash' },
  { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite' },
  { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite' },
  { id: 'gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite' },
] as const;
export type GeminiModelId = (typeof GEMINI_MODELS)[number]['id'];
export const GEMINI_DEFAULT_MODEL: GeminiModelId = 'gemini-3.5-flash-lite';
const INTERACTIONS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse';

type GeminiUserInput = { type: 'user_input'; content: Array<{ type: 'text'; text: string }> };
export type GeminiResponseStep = { type: string; [key: string]: unknown };

export interface GeminiTurn {
  userInput: GeminiUserInput;
  responseSteps: GeminiResponseStep[];
}

export type GeminiErrorCode = 'auth' | 'quota' | 'model' | 'request' | 'network' | 'server' | 'response';

export class GeminiApiError extends Error {
  constructor(public readonly code: GeminiErrorCode) {
    super(code);
    this.name = 'GeminiApiError';
  }
}

interface StreamGeminiOptions {
  apiKey: string;
  model: GeminiModelId;
  prompt: string;
  turns: readonly GeminiTurn[];
  signal: AbortSignal;
  onText: (text: string) => void;
  fetcher?: typeof fetch;
}

function userInput(text: string): GeminiUserInput {
  return { type: 'user_input', content: [{ type: 'text', text }] };
}

function errorForStatus(status: number, apiError?: unknown): GeminiApiError {
  const details = record(apiError);
  const serverError = record(details?.error);
  const publicCode = String(serverError?.status ?? '');
  const publicMessage = String(serverError?.message ?? '');
  // Google may report an invalid API key as HTTP 400 rather than 401.
  if (status === 400 && (publicCode === 'API_KEY_INVALID' ||
    /api key.{0,35}(not valid|invalid)/i.test(publicMessage))) return new GeminiApiError('auth');
  if (status === 401 || status === 403) return new GeminiApiError('auth');
  if (status === 429) return new GeminiApiError('quota');
  if (status === 404) return new GeminiApiError('model');
  if (status >= 500) return new GeminiApiError('server');
  return new GeminiApiError('request');
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

/**
 * SSE frames can be split arbitrarily across response chunks. Keep each full
 * model step to preserve thought signatures for future stateless turns.
 */
export async function streamGeminiMessage({
  apiKey, model, prompt, turns, signal, onText, fetcher = fetch,
}: StreamGeminiOptions): Promise<{ text: string; turn: GeminiTurn }> {
  const currentInput = userInput(prompt);
  const input = turns.flatMap((turn) => [turn.userInput, ...turn.responseSteps]);
  input.push(currentInput);

  let response: Response;
  try {
    response = await fetcher(INTERACTIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey.trim(),
      },
      body: JSON.stringify({ model, input, store: false, stream: true }),
      signal,
      cache: 'no-store',
      // Browser keys can be restricted to the caller's website origin.
      // Never leak the full page URL, but retain the origin for referrer checks.
      referrerPolicy: 'strict-origin-when-cross-origin',
    });
  } catch (error) {
    if (signal.aborted) throw error;
    // Browser CORS failures also surface as TypeError and cannot be distinguished here.
    throw new GeminiApiError('network');
  }

  if (!response.ok) {
    let apiError: unknown;
    try {
      apiError = await response.json();
    } catch {
      // Non-JSON error body: use the HTTP status only.
    }
    throw errorForStatus(response.status, apiError);
  }
  if (!response.body) throw new GeminiApiError('response');

  const stepMap = new Map<number, GeminiResponseStep>();
  const stopped = new Set<number>();
  let text = '';
  let completed = false;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  function processFrame(frame: string) {
    let eventName = '';
    const dataLines: string[] = [];
    for (const line of frame.split(/\r?\n/)) {
      if (line.startsWith('event:')) eventName = line.slice(6).trim();
      else if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart());
    }
    if (!dataLines.length || dataLines.join('\n') === '[DONE]') return;
    let payload: Record<string, unknown> | null;
    try {
      payload = record(JSON.parse(dataLines.join('\n')));
    } catch {
      throw new GeminiApiError('response');
    }
    if (!payload) throw new GeminiApiError('response');
    const kind = eventName || payload.event_type;

    if (kind === 'error' || kind === 'interaction.failed') throw new GeminiApiError('server');
    if (kind === 'interaction.completed') {
      if (record(payload.interaction)?.status !== 'completed') throw new GeminiApiError('response');
      completed = true;
      return;
    }
    if (!['step.start', 'step.delta', 'step.stop'].includes(String(kind))) return;

    const index = payload.index;
    if (!Number.isInteger(index) || Number(index) < 0) throw new GeminiApiError('response');
    const id = Number(index);

    if (kind === 'step.start') {
      const step = record(payload.step);
      if (!step || typeof step.type !== 'string' || stepMap.has(id)) {
        throw new GeminiApiError('response');
      }
      // This chat intentionally has no tools. Do not replay unhandled tool calls.
      if (!['model_output', 'thought'].includes(step.type)) throw new GeminiApiError('response');
      stepMap.set(id, { ...step, type: step.type });
    } else if (kind === 'step.delta') {
      const step = stepMap.get(id);
      const delta = record(payload.delta);
      if (!step || !delta || stopped.has(id)) throw new GeminiApiError('response');
      if (delta.type === 'text' && step.type === 'model_output' && typeof delta.text === 'string') {
        const content = (step.content as Array<{ type: 'text'; text: string }> | undefined) ?? [];
        const previous = content[0]?.text ?? '';
        step.content = [{ type: 'text', text: previous + delta.text }];
        text += delta.text;
        onText(text);
      } else if (delta.type === 'thought_signature' && step.type === 'thought' && typeof delta.signature === 'string') {
        step.signature = delta.signature;
      } else if (delta.type === 'thought_summary' && step.type === 'thought') {
        // The summary is metadata for the current thought, not user-visible output.
        step.summary = delta.content;
      } else {
        // Fail safely rather than replay a malformed/incomplete stateless history.
        throw new GeminiApiError('response');
      }
    } else {
      if (!stepMap.has(id)) throw new GeminiApiError('response');
      stopped.add(id);
    }
  }

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      if (buffer.length > 1_000_000) throw new GeminiApiError('response');
      let match: RegExpExecArray | null;
      while ((match = /\r?\n\r?\n/.exec(buffer)) !== null) {
        const frame = buffer.slice(0, match.index);
        buffer = buffer.slice(match.index + match[0].length);
        processFrame(frame);
      }
    }
    buffer += decoder.decode();
    if (buffer.trim()) processFrame(buffer);
  } catch (error) {
    if (signal.aborted) throw error;
    if (error instanceof GeminiApiError) throw error;
    throw new GeminiApiError('network');
  } finally {
    reader.releaseLock();
  }

  if (!completed || stepMap.size !== stopped.size || !text.trim()) {
    throw new GeminiApiError('response');
  }
  const responseSteps = [...stepMap.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, step]) => step);
  return { text, turn: { userInput: currentInput, responseSteps } };
}
