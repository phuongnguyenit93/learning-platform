import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  GROQ_DEFAULT_MODEL, GROQ_LIMITS_URL, GROQ_MODELS,
  buildGroqMessages, GroqApiError, streamGroqMessage,
} from '../../src/data/groqDirect';

const event = (value: object | string) =>
  `data: ${typeof value === 'string' ? value : JSON.stringify(value)}\r\n\r\n`;

function responseStream(events: string, chunkSize = 9): Response {
  const bytes = new TextEncoder().encode(events);
  return new Response(new ReadableStream<Uint8Array>({
    start(controller) {
      for (let i = 0; i < bytes.length; i += chunkSize) {
        controller.enqueue(bytes.slice(i, i + chunkSize));
      }
      controller.close();
    },
  }), { status: 200, headers: { 'content-type': 'text/event-stream' } });
}

function successfulStream(answer: string, finish = 'stop'): Response {
  return responseStream([
    event({ id: 'test', choices: [{ index: 0, delta: { role: 'assistant' }, finish_reason: null }] }),
    event({ id: 'test', choices: [{ index: 0, delta: { reasoning: 'hidden!' }, finish_reason: null }] }),
    event({ id: 'test', choices: [{ index: 0, delta: { content: answer.slice(0, 2) }, finish_reason: null }] }),
    event({ id: 'test', choices: [{ index: 0, delta: { content: answer.slice(2) }, finish_reason: null }] }),
    event({ id: 'test', choices: [{ index: 0, delta: {}, finish_reason: finish }] }),
    event('[DONE]'),
  ].join(''));
}

test('Groq model catalog is the three approved text models', () => {
  assert.deepEqual(GROQ_MODELS.map((model) => model.id), [
    'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b',
  ]);
  assert.equal(GROQ_DEFAULT_MODEL, GROQ_MODELS[0].id);
  assert.equal(GROQ_LIMITS_URL, 'https://console.groq.com/settings/limits');
});

test('Groq direct stream handles chunk-split SSE and includes prior successful turns', async () => {
  const payloads: Record<string, unknown>[] = [];
  const progress: string[] = [];
  const fetcher = (async (url: RequestInfo | URL, init?: RequestInit) => {
    assert.equal(String(url), 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal(init?.method, 'POST');
    assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer visitor-secret');
    assert.equal(new Headers(init?.headers).get('content-type'), 'application/json');
    assert.equal(init?.cache, 'no-store');
    assert.equal(init?.referrerPolicy, 'no-referrer');
    assert.ok(!String(url).includes('visitor-secret'));
    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    assert.equal(body.stream, true);
    assert.equal(body.max_completion_tokens, 2048);
    assert.equal(body.include_reasoning, false);
    assert.equal(body.reasoning_format, undefined);
    payloads.push(body);
    return successfulStream(payloads.length === 1 ? 'Xin chào' : 'Có hai con mèo');
  }) as typeof fetch;
  const first = await streamGroqMessage({
    apiKey: ' visitor-secret ', model: GROQ_DEFAULT_MODEL, prompt: 'Tôi có 2 con mèo',
    turns: [], signal: new AbortController().signal, onText: (value) => progress.push(value), fetcher,
  });
  assert.equal(first.text, 'Xin chào');
  assert.deepEqual(progress, ['Xi', 'Xin chào']);
  assert.deepEqual(first.turn, { user: 'Tôi có 2 con mèo', assistant: 'Xin chào' });
  const second = await streamGroqMessage({
    apiKey: 'visitor-secret', model: GROQ_DEFAULT_MODEL, prompt: 'Tôi có mấy con?',
    turns: [first.turn], signal: new AbortController().signal, onText: () => {}, fetcher,
  });
  assert.equal(second.text, 'Có hai con mèo');
  assert.deepEqual(payloads[1].messages, [
    { role: 'user', content: 'Tôi có 2 con mèo' },
    { role: 'assistant', content: 'Xin chào' },
    { role: 'user', content: 'Tôi có mấy con?' },
  ]);
});

test('Qwen uses hidden reasoning mode, GPT-OSS uses include_reasoning false', async () => {
  let body: Record<string, unknown> = {};
  const result = await streamGroqMessage({
    apiKey: 'secret', model: 'qwen/qwen3.8-27b', prompt: 'Explain Java',
    turns: [], signal: new AbortController().signal, onText: () => {},
    fetcher: (async (_url: RequestInfo | URL, init?: RequestInit) => {
      body = JSON.parse(String(init?.body)) as Record<string, unknown>;
      return successfulStream('Java explanation');
    }) as typeof fetch,
  });
  assert.equal(result.text, 'Java explanation');
  assert.equal(body.reasoning_format, 'hidden');
  assert.equal(body.include_reasoning, undefined);
});

test('Groq history keeps complete turns, bounded by eight turns and character budget', () => {
  const turns = Array.from({ length: 12 }, (_, i) => ({
    user: `question ${i}`, assistant: `answer ${i}`,
  }));
  const messages = buildGroqMessages(turns, 'now');
  assert.equal(messages.length, 17);
  assert.deepEqual(messages[0], { role: 'user', content: 'question 4' });
  assert.deepEqual(messages.at(-1), { role: 'user', content: 'now' });
  const big = buildGroqMessages([
    { user: 'a'.repeat(13_000), assistant: 'x' },
  ], 'new question');
  assert.deepEqual(big, [{ role: 'user', content: 'new question' }]);
});

test('Groq error mapping never exposes error payload or API key', async () => {
  const errors = [
    [401, 'auth'], [403, 'auth'], [429, 'quota'], [404, 'model'], [500, 'server'], [400, 'request'],
  ] as const;
  for (const [status, expected] of errors) {
    await assert.rejects(streamGroqMessage({
      apiKey: 'visitor-secret', model: GROQ_DEFAULT_MODEL, prompt: 'hi',
      turns: [], signal: new AbortController().signal, onText: () => {},
      fetcher: (async () => new Response(JSON.stringify({
        error: { message: 'visitor-secret should never appear in UI' },
      }), { status })) as typeof fetch,
    }), (error: unknown) => error instanceof GroqApiError && error.code === expected &&
      !error.message.includes('visitor-secret'));
  }
  await assert.rejects(streamGroqMessage({
    apiKey: 'visitor-secret', model: GROQ_DEFAULT_MODEL, prompt: 'hi',
    turns: [], signal: new AbortController().signal, onText: () => {},
    fetcher: (async () => { throw new TypeError('CORS blocked'); }) as typeof fetch,
  }), (error: unknown) => error instanceof GroqApiError && error.code === 'network');
});

test('Truncated or unfinished streams do not become successful conversation turns', async () => {
  for (const badStream of [
    event({ choices: [{ index: 0, delta: { content: 'partial' }, finish_reason: null }] }),
    event({ choices: [{ index: 0, delta: { content: 'partial' }, finish_reason: 'length' }] }) + event('[DONE]'),
    event({ choices: [{ index: 0, delta: { content: 'partial' }, finish_reason: 'stop' }] }),
    event('{broken-json') + event('[DONE]'),
  ]) {
    await assert.rejects(streamGroqMessage({
      apiKey: 'secret', model: GROQ_DEFAULT_MODEL, prompt: 'hi',
      turns: [], signal: new AbortController().signal, onText: () => {},
      fetcher: (async () => responseStream(badStream)) as typeof fetch,
    }), (error: unknown) => error instanceof GroqApiError && error.code === 'response');
  }
});
