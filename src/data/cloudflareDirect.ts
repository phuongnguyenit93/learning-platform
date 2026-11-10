/**
 * Cloudflare Workers AI BYOK adapter. The visitor's token is forwarded through
 * our fixed, same-origin Worker endpoint; inference is charged to THEIR account.
 * Neither API token nor chat history is persisted in browser storage.
 */
import {
  CLOUDFLARE_AI_CHAT_PATH,
  type CloudflareAiModelId,
} from './cloudflareModels';

export type CloudflareAiErrorCode =
  'auth' | 'quota' | 'model' | 'request' | 'network' | 'server' | 'response';
export type CloudflareAiTurn = { user: string; assistant: string };
type ChatMessage = { role: 'user' | 'assistant'; content: string };

export class CloudflareAiApiError extends Error {
  constructor(public readonly code: CloudflareAiErrorCode) {
    super(code); // Never show a raw response that might reflect credentials.
    this.name = 'CloudflareAiApiError';
  }
}

interface SendOptions {
  accountId: string;
  apiToken: string;
  model: CloudflareAiModelId;
  prompt: string;
  turns: readonly CloudflareAiTurn[];
  signal: AbortSignal;
  onText: (text: string) => void;
  fetcher?: typeof fetch;
}

export function buildCloudflareAiMessages(turns: readonly CloudflareAiTurn[], prompt: string): ChatMessage[] {
  const retained: CloudflareAiTurn[] = [];
  let characters = prompt.length;
  for (let index = turns.length - 1; index >= 0 && retained.length < 8; index--) {
    const turn = turns[index];
    const size = turn.user.length + turn.assistant.length;
    if (characters + size > 24_000) break;
    characters += size;
    retained.unshift(turn);
  }
  return [
    ...retained.flatMap((turn): ChatMessage[] => [
      { role: 'user', content: turn.user },
      { role: 'assistant', content: turn.assistant },
    ]),
    { role: 'user', content: prompt },
  ];
}

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
}

function fromStatus(status: number, payload: unknown): CloudflareAiApiError {
  const code = object(payload)?.code;
  if (code === 'auth' || code === 'quota' || code === 'model'
    || code === 'request' || code === 'network' || code === 'server' || code === 'response') {
    return new CloudflareAiApiError(code);
  }
  if (status === 401 || status === 403) return new CloudflareAiApiError('auth');
  if (status === 429) return new CloudflareAiApiError('quota');
  if (status === 404) return new CloudflareAiApiError('model');
  if (status >= 500) return new CloudflareAiApiError('server');
  return new CloudflareAiApiError('request');
}

export async function streamCloudflareAiMessage({
  accountId, apiToken, model, prompt, turns, signal, onText, fetcher = fetch,
}: SendOptions): Promise<{ text: string; turn: CloudflareAiTurn }> {
  // Keep well below the Worker's 48 KiB body cap, including Vietnamese UTF-8
  // and JSON escaping. Drop the oldest complete turns rather than failing a
  // valid new message just because the current session has grown long.
  const messages = buildCloudflareAiMessages(turns, prompt);
  const encode = () => JSON.stringify({
    accountId: accountId.trim(), model, messages,
  });
  let body = encode();
  const measure = (value: string) => new TextEncoder().encode(value).byteLength;
  while (messages.length > 1 && measure(body) > 44_000) {
    messages.splice(0, 2);
    body = encode();
  }
  if (measure(body) > 44_000) throw new CloudflareAiApiError('request');

  let response: Response;
  try {
    response = await fetcher(CLOUDFLARE_AI_CHAT_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken.trim()}`,
      },
      body,
      signal,
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new CloudflareAiApiError('network');
  }

  if (!response.ok) {
    let payload: unknown;
    try { payload = await response.json(); } catch { /* Some errors have no body. */ }
    throw fromStatus(response.status, payload);
  }
  if (!response.body) throw new CloudflareAiApiError('response');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';
  let completed = false;
  let finishReason: string | null = null;
  function parse(frame: string) {
    const rows = frame.split(/\r?\n/);
    const data = rows.filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart()).join('\n');
    if (!data) return;
    if (data.trim() === '[DONE]') {
      completed = true;
      return;
    }
    let json: unknown;
    try { json = JSON.parse(data); } catch { throw new CloudflareAiApiError('response'); }
    const payload = object(json);
    if (!payload) throw new CloudflareAiApiError('response');
    if (payload.error) throw new CloudflareAiApiError('server');
    if (!Array.isArray(payload.choices) || payload.choices.length === 0) return;
    const choice = object(payload.choices[0]);
    if (!choice || choice.index !== 0) throw new CloudflareAiApiError('response');
    const delta = object(choice.delta);
    if (delta?.content !== null && delta?.content !== undefined) {
      if (typeof delta.content !== 'string') throw new CloudflareAiApiError('response');
      text += delta.content;
      onText(text);
    }
    if (choice.finish_reason !== null && choice.finish_reason !== undefined) {
      if (typeof choice.finish_reason !== 'string') throw new CloudflareAiApiError('response');
      finishReason = choice.finish_reason;
    }
  }

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      if (buffer.length > 1_000_000) throw new CloudflareAiApiError('response');
      let separator: RegExpExecArray | null;
      while ((separator = /\r?\n\r?\n/.exec(buffer)) !== null) {
        parse(buffer.slice(0, separator.index));
        buffer = buffer.slice(separator.index + separator[0].length);
      }
    }
    buffer += decoder.decode();
    if (buffer.trim()) parse(buffer);
  } catch (error) {
    if (signal.aborted) throw error;
    if (error instanceof CloudflareAiApiError) throw error;
    throw new CloudflareAiApiError('network');
  } finally {
    reader.releaseLock();
  }
  if (!completed || finishReason !== 'stop' || !text.trim()) throw new CloudflareAiApiError('response');
  return { text, turn: { user: prompt, assistant: text } };
}
