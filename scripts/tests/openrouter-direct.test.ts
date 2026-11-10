import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  OPENROUTER_DEFAULT_MODEL, OPENROUTER_FREE_MODELS_URL, OPENROUTER_MODELS,
  OPENROUTER_USAGE_URL, OpenRouterApiError, buildOpenRouterMessages, streamOpenRouterMessage,
} from '../../src/data/openRouterDirect';

function frame(data: object | string, event?: string): string {
  return (event ? `event: ${event}\r\n` : '')
    + `data: ${typeof data === 'string' ? data : JSON.stringify(data)}\r\n\r\n`;
}

function stream(body: string, chunkSize = 7): Response {
  const bytes = new TextEncoder().encode(body);
  return new Response(new ReadableStream<Uint8Array>({
    start(controller) {
      for (let i = 0; i < bytes.length; i += chunkSize) {
        controller.enqueue(bytes.slice(i, i + chunkSize));
      }
      controller.close();
    },
  }), { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
}

function successfulResponse(text: string): Response {
  return stream([
    frame({ id: 'gen-1', choices: [{ index: 0, delta: { role: 'assistant' }, finish_reason: null }] }),
    frame({ id: 'gen-1', choices: [{ index: 0, delta: { reasoning: 'internal', content: text.slice(0, 2) }, finish_reason: null }] }),
    frame({ id: 'gen-1', choices: [{ index: 0, delta: { content: text.slice(2) }, finish_reason: null }] }),
    frame({ id: 'gen-1', choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] }),
    frame('[DONE]'),
  ].join(''));
}

test('Seven approved OpenRouter free text models, links and default match the verified catalog', () => {
  assert.deepEqual(OPENROUTER_MODELS.map((model) => model.id), [
    'nvidia/nemotron-3-ultra-550b-a55b:free',
    'google/gemma-4-26b-a4b-it:free',
    'nvidia/nemotron-3.5-lightning:free',
    'cohere/north-mini-code:free',
    'recursive/flint-v1.0:free',
    'nvidia/nemotron-3.5-super-vl:free',
    'openrouter/free',
  ]);
  assert.equal(OPENROUTER_DEFAULT_MODEL, OPENROUTER_MODELS[0].id);
  assert.equal(OPENROUTER_USAGE_URL, 'https://openrouter.ai/activity');
  assert.equal(OPENROUTER_FREE_MODELS_URL, 'https://openrouter.ai/collections/free-models');
});

test('OpenRouter direct streaming sends the visitor key only in Authorization and replays successful conversation', async () => {
  const requests: Record<string, unknown>[] = [];
  const chunks: string[] = [];
  const fetcher = (async (url: RequestInfo | URL, options?: RequestInit) => {
    assert.equal(String(url), 'https://openrouter.ai/api/v1/chat/completions');
    assert.equal(options?.method, 'POST');
    assert.equal(new Headers(options?.headers).get('authorization'), 'Bearer visitor-secret');
    assert.equal(new Headers(options?.headers).get('content-type'), 'application/json');
    assert.equal(options?.referrerPolicy, 'no-referrer');
    assert.equal(options?.cache, 'no-store');
    assert.ok(!String(url).includes('visitor-secret'));
    const request = JSON.parse(String(options?.body)) as Record<string, unknown>;
    assert.equal(request.stream, true);
    assert.equal(request.max_tokens, 2048);
    requests.push(request);
    return successfulResponse(requests.length === 1 ? 'Xin chào' : 'Có hai con');
  }) as typeof fetch;
  const first = await streamOpenRouterMessage({
    apiKey: ' visitor-secret ', model: OPENROUTER_DEFAULT_MODEL,
    prompt: 'Tôi có hai con mèo', turns: [], signal: new AbortController().signal,
    onText: (text) => chunks.push(text), fetcher,
  });
  assert.deepEqual(chunks, ['Xi', 'Xin chào']);
  assert.deepEqual(first.turn, { user: 'Tôi có hai con mèo', assistant: 'Xin chào' });
  const second = await streamOpenRouterMessage({
    apiKey: 'visitor-secret', model: OPENROUTER_DEFAULT_MODEL,
    prompt: 'Mấy con?', turns: [first.turn], signal: new AbortController().signal,
    onText: () => {}, fetcher,
  });
  assert.equal(second.text, 'Có hai con');
  assert.deepEqual(requests[1].messages, [
    { role: 'user', content: 'Tôi có hai con mèo' },
    { role: 'assistant', content: 'Xin chào' },
    { role: 'user', content: 'Mấy con?' },
  ]);
});

test('OpenRouter keeps only bounded whole user/assistant turns in API context', () => {
  const history = Array.from({ length: 11 }, (_, i) => ({ user: `question ${i}`, assistant: `answer ${i}` }));
  const messages = buildOpenRouterMessages(history, 'current');
  assert.equal(messages.length, 17);
  assert.equal(messages[0].content, 'question 3');
  assert.deepEqual(messages.at(-1), { role: 'user', content: 'current' });
  assert.deepEqual(buildOpenRouterMessages([
    { user: 'x'.repeat(13_000), assistant: 'answer' },
  ], 'new'), [{ role: 'user', content: 'new' }]);
});

test('OpenRouter maps auth, rate limit, unavailable model, malformed request and network failures without leaking keys', async () => {
  for (const [status, code] of [
    [401, 'auth'], [403, 'auth'], [402, 'quota'], [429, 'quota'],
    [404, 'model'], [400, 'request'], [500, 'server'],
  ] as const) {
    await assert.rejects(streamOpenRouterMessage({
      apiKey: 'private-visitor-key', model: OPENROUTER_DEFAULT_MODEL, prompt: 'hello', turns: [],
      signal: new AbortController().signal, onText: () => {},
      fetcher: (async () => new Response(JSON.stringify({
        error: { message: 'Private key: private-visitor-key' },
      }), { status })) as typeof fetch,
    }), (error: unknown) => error instanceof OpenRouterApiError && error.code === code
      && !error.message.includes('private-visitor-key'));
  }
  await assert.rejects(streamOpenRouterMessage({
    apiKey: 'private-visitor-key', model: OPENROUTER_DEFAULT_MODEL, prompt: 'hi', turns: [],
    signal: new AbortController().signal, onText: () => {},
    fetcher: (async () => { throw new TypeError('CORS'); }) as typeof fetch,
  }), (error: unknown) => error instanceof OpenRouterApiError && error.code === 'network');
});

test('Malformed, truncated and errored SSE streams never count as successful history', async () => {
  for (const body of [
    frame({ choices: [{ index: 0, delta: { content: 'partial' }, finish_reason: null }] }),
    frame({ choices: [{ index: 0, delta: { content: 'partial' }, finish_reason: 'length' }] }) + frame('[DONE]'),
    frame({ choices: [{ index: 0, delta: { content: 'partial' }, finish_reason: 'stop' }] }),
    frame('{not-json') + frame('[DONE]'),
    frame({ error: { message: 'upstream' } }) + frame('[DONE]'),
  ]) {
    await assert.rejects(streamOpenRouterMessage({
      apiKey: 'key', model: 'openrouter/free', prompt: 'hello', turns: [],
      signal: new AbortController().signal, onText: () => {},
      fetcher: (async () => stream(body)) as typeof fetch,
    }), (error: unknown) => error instanceof OpenRouterApiError);
  }
});
