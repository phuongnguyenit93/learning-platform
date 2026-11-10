import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  GEMINI_DEFAULT_MODEL, GEMINI_MODELS, GeminiApiError, streamGeminiMessage, type GeminiTurn,
} from '../../src/data/geminiDirect';

const frame = (event: string, data: object | string) =>
  `event: ${event}\r\ndata: ${typeof data === 'string' ? data : JSON.stringify({ ...data, event_type: event })}\r\n\r\n`;

function streamResponse(content: string, splitAt = 11): Response {
  const bytes = new TextEncoder().encode(content);
  return new Response(new ReadableStream<Uint8Array>({
    start(controller) {
      for (let index = 0; index < bytes.length; index += splitAt) {
        controller.enqueue(bytes.slice(index, index + splitAt));
      }
      controller.close();
    },
  }), { status: 200, headers: { 'content-type': 'text/event-stream' } });
}

function successfulResponse(answer: string, signature = 'signature-for-next-turn'): Response {
  return streamResponse([
    frame('interaction.created', { interaction: { status: 'in_progress' } }),
    frame('step.start', { index: 0, step: { type: 'thought' } }),
    frame('step.delta', { index: 0, delta: { type: 'thought_signature', signature } }),
    frame('step.stop', { index: 0 }),
    frame('step.start', { index: 1, step: { type: 'model_output' } }),
    frame('step.delta', { index: 1, delta: { type: 'text', text: answer.slice(0, 3) } }),
    frame('step.delta', { index: 1, delta: { type: 'text', text: answer.slice(3) } }),
    frame('step.stop', { index: 1 }),
    frame('interaction.completed', { interaction: { status: 'completed' } }),
    frame('done', '[DONE]'),
  ].join(''));
}

test('Gemini catalog provides ten distinct text-output models and the current default', () => {
  assert.equal(GEMINI_MODELS.length, 10);
  assert.equal(new Set(GEMINI_MODELS.map((model) => model.id)).size, 10);
  assert.ok(GEMINI_MODELS.some((model) => model.id === GEMINI_DEFAULT_MODEL));
  assert.ok(GEMINI_MODELS.every((model) => model.label && model.id.startsWith('gemini-')));
});

test('Gemini direct request streams split SSE chunks; second stateless turn replays thought signatures', async () => {
  const payloads: Record<string, unknown>[] = [];
  const progress: string[] = [];
  const fetcher = (async (url: RequestInfo | URL, init?: RequestInit) => {
    assert.equal(String(url), 'https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse');
    assert.equal(init?.method, 'POST');
    const headers = new Headers(init?.headers);
    assert.equal(headers.get('x-goog-api-key'), 'visitor-secret');
    assert.equal(headers.get('content-type'), 'application/json');
    assert.equal(init?.cache, 'no-store');
    assert.equal(init?.referrerPolicy, 'strict-origin-when-cross-origin');
    const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
    assert.equal(payload.model, GEMINI_DEFAULT_MODEL);
    assert.equal(payload.store, false);
    assert.equal(payload.stream, true);
    assert.ok(!String(url).includes('visitor-secret'));
    payloads.push(payload);
    return successfulResponse(payloads.length === 1 ? 'Xin chào' : 'Có 2 con');
  }) as typeof fetch;

  const first = await streamGeminiMessage({
    apiKey: ' visitor-secret ', model: GEMINI_DEFAULT_MODEL, prompt: 'Tôi có 2 con mèo',
    turns: [], signal: new AbortController().signal, onText: (value) => progress.push(value), fetcher,
  });
  assert.equal(first.text, 'Xin chào');
  assert.deepEqual(progress, ['Xin', 'Xin chào']);
  assert.deepEqual(first.turn.responseSteps, [
    { type: 'thought', signature: 'signature-for-next-turn' },
    { type: 'model_output', content: [{ type: 'text', text: 'Xin chào' }] },
  ]);

  const next = await streamGeminiMessage({
    apiKey: 'visitor-secret', model: GEMINI_DEFAULT_MODEL, prompt: 'Tôi có mấy con?',
    turns: [first.turn], signal: new AbortController().signal, onText: () => {}, fetcher,
  });
  assert.equal(next.text, 'Có 2 con');
  assert.deepEqual(payloads[1].input, [
    first.turn.userInput,
    ...first.turn.responseSteps,
    { type: 'user_input', content: [{ type: 'text', text: 'Tôi có mấy con?' }] },
  ]);
  assert.deepEqual(first.turn.responseSteps[0], { type: 'thought', signature: 'signature-for-next-turn' },
    'Continuing the conversation must not mutate prior signatures');
});

test('Gemini rejects invalid keys, quotas, unknown models and network failures without logging secrets', async () => {
  const cases = [
    [403, 'auth'],
    [429, 'quota'],
    [404, 'model'],
    [500, 'server'],
    [400, 'request'],
  ] as const;
  for (const [status, code] of cases) {
    await assert.rejects(streamGeminiMessage({
      apiKey: 'visitor-secret', model: GEMINI_DEFAULT_MODEL, prompt: 'Hi', turns: [] as GeminiTurn[],
      signal: new AbortController().signal, onText: () => {},
      fetcher: (async () => new Response(JSON.stringify({ error: { message: 'key visitor-secret' } }), { status })) as typeof fetch,
    }), (error: unknown) => error instanceof GeminiApiError && error.code === code &&
      !error.message.includes('visitor-secret'));
  }
  await assert.rejects(streamGeminiMessage({
    apiKey: 'visitor-secret', model: GEMINI_DEFAULT_MODEL, prompt: 'Hi', turns: [],
    signal: new AbortController().signal, onText: () => {},
    fetcher: (async () => { throw new TypeError('Blocked by CORS'); }) as typeof fetch,
  }), (error: unknown) => error instanceof GeminiApiError && error.code === 'network');
  await assert.rejects(streamGeminiMessage({
    apiKey: 'visitor-secret', model: GEMINI_DEFAULT_MODEL, prompt: 'Hi', turns: [],
    signal: new AbortController().signal, onText: () => {},
    fetcher: (async () => new Response(JSON.stringify({
      error: { status: 'INVALID_ARGUMENT', message: 'API key not valid. Please pass a valid API key.' },
    }), { status: 400 })) as typeof fetch,
  }), (error: unknown) => error instanceof GeminiApiError && error.code === 'auth');
});

test('Missing completion or thought step cannot be persisted as valid conversation history', async () => {
  const noCompletion = [
    frame('step.start', { index: 0, step: { type: 'model_output' } }),
    frame('step.delta', { index: 0, delta: { type: 'text', text: 'partial' } }),
    frame('step.stop', { index: 0 }),
  ].join('');
  await assert.rejects(streamGeminiMessage({
    apiKey: 'visitor-secret', model: GEMINI_DEFAULT_MODEL, prompt: 'Hello', turns: [],
    signal: new AbortController().signal, onText: () => {},
    fetcher: (async () => streamResponse(noCompletion)) as typeof fetch,
  }), (error: unknown) => error instanceof GeminiApiError && error.code === 'response');
  const unsupported = [
    frame('step.start', { index: 0, step: { type: 'function_call', name: 'unconfigured_tool' } }),
    frame('interaction.completed', { interaction: { status: 'completed' } }),
  ].join('');
  await assert.rejects(streamGeminiMessage({
    apiKey: 'visitor-secret', model: GEMINI_DEFAULT_MODEL, prompt: 'Hello', turns: [],
    signal: new AbortController().signal, onText: () => {},
    fetcher: (async () => streamResponse(unsupported)) as typeof fetch,
  }), (error: unknown) => error instanceof GeminiApiError && error.code === 'response');
});
