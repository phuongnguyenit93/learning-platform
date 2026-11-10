import { CLOUDFLARE_AI_MODELS } from '../../src/data/cloudflareModels';
import type { WorkerEnv } from '../types';

const MAX_BYTES = 48 * 1024;
const MAX_HISTORY_MESSAGES = 17;
const MAX_TOTAL_CHARACTERS = 32_000;
const MAX_MESSAGE_CHARACTERS = 16_000;

export const CLOUDFLARE_AI_ALLOWED_MODELS: ReadonlySet<string> =
  new Set(CLOUDFLARE_AI_MODELS.map((model) => model.id));

type AIMessage = { role: 'user' | 'assistant'; content: string };
type AIRequest = { accountId: string; model: string; messages: AIMessage[] };

function reply(code: string, status: number, extra?: HeadersInit): Response {
  return new Response(JSON.stringify({ code }), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extra,
    },
  });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function boundedJSON(request: Request): Promise<unknown> {
  if (!request.body) throw new Error('missing');
  const reader = request.body.getReader();
  let bytes = 0;
  const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: false });
  let content = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BYTES) throw new Error('oversize');
      content += decoder.decode(value, { stream: true });
    }
    content += decoder.decode();
    return JSON.parse(content) as unknown;
  } catch (error) {
    if (error instanceof Error && error.message === 'oversize') throw error;
    throw new Error('invalid');
  } finally {
    reader.releaseLock();
  }
}

function validatePayload(value: unknown): AIRequest | null {
  if (!isObject(value)) return null;
  const { accountId, model, messages } = value;
  if (typeof accountId !== 'string' || !/^[a-fA-F0-9]{32}$/.test(accountId)
    || typeof model !== 'string' || !CLOUDFLARE_AI_ALLOWED_MODELS.has(model)
    || !Array.isArray(messages) || messages.length < 1
    || messages.length > MAX_HISTORY_MESSAGES || messages.length % 2 !== 1) return null;

  let characters = 0;
  const sanitizedMessages: AIMessage[] = [];
  for (let i = 0; i < messages.length; i++) {
    const item: unknown = messages[i];
    if (!isObject(item)) return null;
    const role = i % 2 === 0 ? 'user' : 'assistant';
    if (item.role !== role || typeof item.content !== 'string'
      || !item.content.trim() || item.content.length > MAX_MESSAGE_CHARACTERS) return null;
    characters += item.content.length;
    if (characters > MAX_TOTAL_CHARACTERS) return null;
    sanitizedMessages.push({ role, content: item.content });
  }
  return { accountId: accountId.toLowerCase(), model, messages: sanitizedMessages };
}

/**
 * Only this fixed route is supported. Does not pass user-provided URLs,
 * headers, account permissions, generation parameters or model names unchecked.
 */
export async function handleCloudflareAiChat(
  request: Request,
  env: Pick<WorkerEnv, 'AI_CHAT_RATE_LIMITER'>,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== 'POST') return reply('method', 405, { Allow: 'POST' });
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return reply('origin', 403);
  if (!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get('content-type') ?? '')) {
    return reply('content_type', 415);
  }
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BYTES) return reply('too_large', 413);
  const authorization = request.headers.get('authorization') ?? '';
  const key = /^Bearer ([A-Za-z0-9._-]{16,512})$/.exec(authorization);
  if (!key) return reply('auth', 401);

  let raw: unknown;
  try {
    raw = await boundedJSON(request);
  } catch (error) {
    return error instanceof Error && error.message === 'oversize'
      ? reply('too_large', 413) : reply('request', 400);
  }
  const validated = validatePayload(raw);
  if (!validated) return reply('request', 400);

  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  try {
    const limit = await env.AI_CHAT_RATE_LIMITER.limit({ key: `workers-ai:${ip}` });
    if (!limit.success) return reply('quota', 429, { 'Retry-After': '60' });
  } catch {
    // Fail closed when the limiter fails; never expose the visitor's token.
    return reply('server', 503);
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${validated.accountId}/ai/v1/chat/completions`;
  let upstream: Response;
  try {
    upstream = await fetcher(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key[1]}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: validated.model,
        messages: validated.messages,
        stream: true,
        max_tokens: 2048,
      }),
      signal: request.signal,
    });
  } catch {
    return reply('network', 502);
  }

  if (!upstream.ok) {
    // Never forward provider errors or headers containing sensitive information.
    if (upstream.status === 401 || upstream.status === 403) return reply('auth', 401);
    if (upstream.status === 402 || upstream.status === 429) return reply('quota', 429);
    if (upstream.status === 404 || upstream.status === 410) return reply('model', 404);
    if (upstream.status >= 500) return reply('server', 502);
    return reply('request', 400);
  }
  if (!upstream.body || !upstream.headers.get('content-type')?.includes('text/event-stream')) {
    return reply('response', 502);
  }

  // Stream the response as-is, but never copy upstream cache/cookie/debug headers.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
