import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CLOUDFLARE_AI_CHAT_PATH, CLOUDFLARE_AI_DEFAULT_MODEL, CLOUDFLARE_AI_MODELS,
} from '../../src/data/cloudflareModels';
import {
  buildCloudflareAiMessages, CloudflareAiApiError, streamCloudflareAiMessage,
} from '../../src/data/cloudflareDirect';

const ACCOUNT = '123456789abcdef0123456789abcdef0';
const TOKEN = 'cloudflare-worker-visitor-test-key-123';

function chunkedSse(contents: string, size = 8): Response {
  const bytes = new TextEncoder().encode(contents);
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (let index = 0; index < bytes.length; index += size) {
        controller.enqueue(bytes.slice(index, index + size));
      }
      controller.close();
    },
  });
  return new Response(body, { status: 200, headers: { 'content-type': 'text/event-stream' } });
}

function chunk(data: unknown) {
  return `data: ${JSON.stringify(data)}\r\n\r\n`;
}

function good(text: string) {
  return chunkedSse([
    chunk({ choices: [{ index: 0, delta: { role: 'assistant' }, finish_reason: null }] }),
    chunk({ choices: [{ index: 0, delta: { content: text.slice(0, 2) }, finish_reason: null }] }),
    chunk({ choices: [{ index: 0, delta: { content: text.slice(2) }, finish_reason: null }] }),
    chunk({ choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] }),
    'data: [DONE]\r\n\r\n',
  ].join(''));
}

test('Workers AI offers four active text models and Gemma default', () => {
  assert.deepEqual(CLOUDFLARE_AI_MODELS.map((model) => model.id), [
    '@cf/google/gemma-4-26b-a4b-it',
    '@cf/openai/gpt-oss-20b',
    '@cf/openai/gpt-oss-120b',
    '@cf/qwen/qwen3.8-27b',
  ]);
  assert.equal(CLOUDFLARE_AI_DEFAULT_MODEL, CLOUDFLARE_AI_MODELS[0].id);
});

test('Workers AI frontend sends token only as Authorization to same-origin route and replays context', async () => {
  const seen: Array<Record<string, unknown>> = [];
  const progress: string[] = [];
  const fetcher = (async (path: RequestInfo | URL, init?: RequestInit) => {
    assert.equal(String(path), CLOUDFLARE_AI_CHAT_PATH);
    assert.equal(init?.method, 'POST');
    assert.equal(new Headers(init?.headers).get('Authorization'), `Bearer ${TOKEN}`);
    assert.equal(init?.cache, 'no-store');
    const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
    assert.equal(payload.accountId, ACCOUNT);
    assert.equal(payload.model, CLOUDFLARE_AI_DEFAULT_MODEL);
    assert.ok(!JSON.stringify(payload).includes(TOKEN), 'API Token must not be in JSON body');
    seen.push(payload);
    return good(seen.length === 1 ? 'Chào bạn' : '**Hai** con');
  }) as typeof fetch;
  const first = await streamCloudflareAiMessage({
    accountId: ACCOUNT, apiToken: TOKEN, model: CLOUDFLARE_AI_DEFAULT_MODEL,
    prompt: 'Có hai object', turns: [], signal: new AbortController().signal,
    onText: (value) => progress.push(value), fetcher,
  });
  assert.equal(first.text, 'Chào bạn');
  assert.deepEqual(progress, ['Ch', 'Chào bạn']);
  const next = await streamCloudflareAiMessage({
    accountId: ACCOUNT, apiToken: TOKEN, model: CLOUDFLARE_AI_DEFAULT_MODEL,
    prompt: 'Có bao nhiêu?', turns: [first.turn], signal: new AbortController().signal,
    onText: () => {}, fetcher,
  });
  assert.equal(next.text, '**Hai** con');
  assert.deepEqual(seen[1].messages, [
    { role: 'user', content: 'Có hai object' },
    { role: 'assistant', content: 'Chào bạn' },
    { role: 'user', content: 'Có bao nhiêu?' },
  ]);
});

test('Workers AI history is limited to eight complete turns with total character budget', () => {
  const messages = buildCloudflareAiMessages(
    Array.from({ length: 14 }, (_, i) => ({ user: `question-${i}`, assistant: `answer-${i}` })),
    'latest',
  );
  assert.equal(messages.length, 17);
  assert.equal(messages[0].content, 'question-6');
  assert.deepEqual(messages.at(-1), { role: 'user', content: 'latest' });
  assert.deepEqual(buildCloudflareAiMessages([
    { user: 'A'.repeat(24_001), assistant: 'B' },
  ], 'new'), [{ role: 'user', content: 'new' }]);
});

test('Workers AI trims older UTF-8 history to stay within the Worker body limit', async () => {
  const calls: Array<{ messages: Array<{ role: string; content: string }> }> = [];
  await streamCloudflareAiMessage({
    accountId: ACCOUNT, apiToken: TOKEN, model: CLOUDFLARE_AI_DEFAULT_MODEL,
    prompt: 'Bạn giải thích rõ hơn', turns: Array.from({ length: 8 }, (_, i) => ({
      user: `Ngữ cảnh ${i}: ${'đ'.repeat(2000)}`,
      assistant: `Trả lời ${i}: ${'ắ'.repeat(2000)}`,
    })), signal: new AbortController().signal, onText: () => {},
    fetcher: (async (_url: RequestInfo | URL, init?: RequestInit) => {
      assert.ok(new TextEncoder().encode(String(init?.body)).length <= 44_000);
      calls.push(JSON.parse(String(init?.body)));
      return good('Đã giải thích');
    }) as typeof fetch,
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].messages.at(-1)?.content, 'Bạn giải thích rõ hơn');
  assert.equal(calls[0].messages.length % 2, 1);
  assert.ok(calls[0].messages.length < 17, 'Oldest complete turns should be dropped');
});

test('Workers AI response errors are classified without leaking token or server internals', async () => {
  const cases = [
    [401, 'auth'], [429, 'quota'], [404, 'model'],
    [400, 'request'], [502, 'server'],
  ] as const;
  for (const [status, code] of cases) {
    await assert.rejects(streamCloudflareAiMessage({
      accountId: ACCOUNT, apiToken: TOKEN, model: CLOUDFLARE_AI_DEFAULT_MODEL,
      prompt: 'help', turns: [], signal: new AbortController().signal, onText: () => {},
      fetcher: (async () => new Response(JSON.stringify({
        code, token: TOKEN, details: 'internal server context',
      }), { status })) as typeof fetch,
    }), (error: unknown) => error instanceof CloudflareAiApiError && error.code === code
      && !error.message.includes(TOKEN));
  }
  await assert.rejects(streamCloudflareAiMessage({
    accountId: ACCOUNT, apiToken: TOKEN, model: CLOUDFLARE_AI_DEFAULT_MODEL,
    prompt: 'help', turns: [], signal: new AbortController().signal, onText: () => {},
    fetcher: (async () => { throw new Error('network unavailable'); }) as typeof fetch,
  }), (error: unknown) => error instanceof CloudflareAiApiError && error.code === 'network');
});

test('Workers AI partial, invalid and failed SSE cannot become successful history', async () => {
  const failures = [
    chunk({ choices: [{ index: 0, delta: { content: 'part' }, finish_reason: null }] }),
    chunk({ choices: [{ index: 0, delta: { content: 'part' }, finish_reason: 'length' }] })
      + 'data: [DONE]\r\n\r\n',
    chunk({ choices: [{ index: 0, delta: { content: 'part' }, finish_reason: 'stop' }] }),
    'data: {invalid\r\n\r\n',
    chunk({ error: { message: 'upstream failure' } }),
  ];
  for (const content of failures) {
    await assert.rejects(streamCloudflareAiMessage({
      accountId: ACCOUNT, apiToken: TOKEN, model: CLOUDFLARE_AI_DEFAULT_MODEL,
      prompt: 'help', turns: [], signal: new AbortController().signal, onText: () => {},
      fetcher: (async () => chunkedSse(content)) as typeof fetch,
    }), (error: unknown) => error instanceof CloudflareAiApiError);
  }
});
