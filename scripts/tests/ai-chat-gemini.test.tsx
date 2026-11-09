import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Window } from 'happy-dom';
import { AiChatWidget } from '../../src/components/AiChatWidget';
import { LanguageProvider } from '../../src/state/LanguageContext';

function sseReply(answer: string): Response {
  const events = [
    ['step.start', { index: 0, step: { type: 'thought' } }],
    ['step.delta', { index: 0, delta: { type: 'thought_signature', signature: 'preserve-this-signature' } }],
    ['step.stop', { index: 0 }],
    ['step.start', { index: 1, step: { type: 'model_output' } }],
    ['step.delta', { index: 1, delta: { type: 'text', text: answer } }],
    ['step.stop', { index: 1 }],
    ['interaction.completed', { interaction: { status: 'completed' } }],
  ].map(([event, value]) => `event: ${event}\ndata: ${JSON.stringify(value)}\n\n`).join('');
  return new Response(sseReplyBody(events), { status: 200, headers: { 'content-type': 'text/event-stream' } });
}

function sseReplyBody(text: string): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });
}

async function withChat(
  fetchMock: typeof fetch,
  run: (host: HTMLElement, browser: Window) => Promise<void>,
) {
  const browser = new Window({ url: 'http://localhost:5000' });
  const globals = {
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, HTMLInputElement: browser.HTMLInputElement,
    HTMLTextAreaElement: browser.HTMLTextAreaElement, Node: browser.Node, Event: browser.Event,
    MouseEvent: browser.MouseEvent, KeyboardEvent: browser.KeyboardEvent,
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const original = new Map<string, PropertyDescriptor | undefined>();
  for (const [name, value] of Object.entries(globals)) {
    original.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  }
  const oldFetch = globalThis.fetch;
  globalThis.fetch = fetchMock;
  const host = browser.document.createElement('div');
  browser.document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(<LanguageProvider><AiChatWidget /></LanguageProvider>));
    await act(async () => host.querySelector<HTMLButtonElement>('.ai-chat__launcher')?.click());
    const gemini = [...host.querySelectorAll<HTMLButtonElement>('.ai-chat__provider')]
      .find((button) => button.textContent?.includes('Gemini'));
    assert.ok(gemini);
    await act(async () => gemini.click());
    const key = host.querySelector<HTMLInputElement>('#ai-chat-key');
    assert.ok(key);
    await act(async () => {
      key.focus();
      Object.getOwnPropertyDescriptor(browser.HTMLInputElement.prototype, 'value')?.set
        ?.call(key, 'test-visitor-key');
      key.dispatchEvent(new browser.Event('input', { bubbles: true }));
      key.dispatchEvent(new browser.Event('change', { bubbles: true }));
    });
    assert.equal(key.value, 'test-visitor-key');
    assert.equal(host.querySelector<HTMLButtonElement>('.ai-chat__continue')?.disabled, false);
    const form = host.querySelector<HTMLFormElement>('.ai-chat__key-form');
    assert.ok(form);
    await act(async () => form.dispatchEvent(new browser.Event('submit', { bubbles: true, cancelable: true })));
    assert.ok(host.querySelector('.ai-chat__transcript'), 'Gemini must enter the real chat stage');
    await run(host, browser);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    globalThis.fetch = oldFetch;
    for (const [key, descriptor] of original) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

async function send(host: HTMLElement, browser: Window, prompt: string) {
  const textarea = host.querySelector<HTMLTextAreaElement>('.ai-chat__composer textarea');
  const form = host.querySelector<HTMLFormElement>('.ai-chat__composer');
  assert.ok(textarea && form);
  await act(async () => {
    textarea.focus();
    Object.getOwnPropertyDescriptor(browser.HTMLTextAreaElement.prototype, 'value')?.set
      ?.call(textarea, prompt);
    textarea.dispatchEvent(new browser.Event('input', { bubbles: true }));
    textarea.dispatchEvent(new browser.Event('change', { bubbles: true }));
  });
  await act(async () => {
    form.dispatchEvent(new browser.Event('submit', { bubbles: true, cancelable: true }));
  });
}

test('Gemini UI sends chat directly and replays memory; reset clears the session', async () => {
  const requests: { url: string; body: Record<string, unknown> }[] = [];
  await withChat((async (input: RequestInfo | URL, init?: RequestInit) => {
    assert.equal(new Headers(init?.headers).get('x-goog-api-key'), 'test-visitor-key');
    assert.equal(init?.method, 'POST');
    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    requests.push({ url: String(input), body });
    return sseReply(requests.length === 1 ? 'Chào bạn' : 'Bạn có hai con');
  }) as typeof fetch, async (host, browser) => {
    await send(host, browser, 'Tôi có hai con mèo');
    assert.equal(requests.length, 1, 'First user message must send exactly once');
    assert.match(host.textContent ?? '', /Chào bạn/);
    await send(host, browser, 'Tôi có mấy con?');
    assert.equal(requests.length, 2);
    const input = requests[1].body.input as Record<string, unknown>[];
    assert.equal(input.length, 4);
    assert.equal(input[1].signature, 'preserve-this-signature');
    assert.equal(requests[1].body.store, false);
    assert.ok(requests.every((r) => r.url.startsWith('https://generativelanguage.googleapis.com/')));
    assert.equal(host.querySelectorAll('.ai-chat__message--user').length, 2);
    assert.match(host.textContent ?? '', /Bạn có hai con/);

    await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Bắt đầu lại"]')?.click());
    assert.ok(host.querySelector('.ai-chat__providers'));
    assert.equal(host.querySelector('.ai-chat__transcript'), null);
    assert.doesNotMatch(host.textContent ?? '', /Tôi có mấy con|Bạn có hai con/);
    assert.equal(host.querySelector('#ai-chat-key'), null);
  });
});

test('Gemini quota errors offer retry without duplicating user messages', async () => {
  let calls = 0;
  await withChat((async () => {
    calls += 1;
    return calls === 1 ? new Response('', { status: 429 }) : sseReply('Đã thử lại thành công');
  }) as typeof fetch, async (host, browser) => {
    await send(host, browser, 'Giải thích interface');
    assert.equal(calls, 1);
    assert.match(host.querySelector('[role="alert"]')?.textContent ?? '', /429/);
    await act(async () => host.querySelector<HTMLButtonElement>('.ai-chat__chat-error button')?.click());
    assert.equal(calls, 2);
    assert.equal(host.querySelectorAll('.ai-chat__message--user').length, 1);
    assert.match(host.textContent ?? '', /Đã thử lại thành công/);
    assert.equal(host.querySelector('[role="alert"]'), null);
  });
});

test('Reset aborts an in-flight Gemini request and discards its late result', async () => {
  let signal: AbortSignal | undefined;
  await withChat((async (_url: RequestInfo | URL, init?: RequestInit) => {
    signal = init?.signal ?? undefined;
    return new Promise<Response>((resolve, reject) => {
      signal?.addEventListener('abort', () => reject(new DOMException('Cancelled', 'AbortError')));
    });
  }) as typeof fetch, async (host, browser) => {
    await send(host, browser, 'Câu hỏi chưa hoàn thành');
    assert.ok(signal);
    assert.equal(signal.aborted, false);
    await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Bắt đầu lại"]')?.click());
    assert.equal(signal.aborted, true);
    assert.ok(host.querySelector('.ai-chat__providers'));
    assert.equal(host.querySelector('.ai-chat__transcript'), null);
    assert.doesNotMatch(host.textContent ?? '', /Câu hỏi chưa hoàn thành/);
  });
});
