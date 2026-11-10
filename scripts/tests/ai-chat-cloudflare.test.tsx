import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Window } from 'happy-dom';
import { AiChatWidget } from '../../src/components/AiChatWidget';
import { LanguageProvider } from '../../src/state/LanguageContext';
import { openAiSupportTopic, quizTopic } from '../../src/data/aiSupportTopic';

const ACCOUNT = '123456789abcdef0123456789abcdef0';
const TOKEN = 'visitor-cloudflare-token-for-test';

function successfulResponse(content: string): Response {
  const events = [
    { choices: [{ index: 0, delta: { role: 'assistant' }, finish_reason: null }] },
    { choices: [{ index: 0, delta: { content }, finish_reason: null }] },
    { choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] },
  ].map((value) => `data: ${JSON.stringify(value)}\n\n`).join('') + 'data: [DONE]\n\n';
  return new Response(new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(events));
      controller.close();
    },
  }), { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
}

async function withCloudflare(
  fetchMock: typeof fetch,
  testUI: (host: HTMLElement, browser: Window) => Promise<void>,
): Promise<void> {
  const browser = new Window({ url: 'http://localhost:5000' });
  const globals = {
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, HTMLInputElement: browser.HTMLInputElement,
    HTMLTextAreaElement: browser.HTMLTextAreaElement, Event: browser.Event,
    Node: browser.Node, KeyboardEvent: browser.KeyboardEvent,
    CustomEvent: browser.CustomEvent, IS_REACT_ACT_ENVIRONMENT: true,
  };
  const originals = new Map<string, PropertyDescriptor | undefined>();
  for (const [name, value] of Object.entries(globals)) {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  }
  const previousFetch = globalThis.fetch;
  globalThis.fetch = fetchMock;
  const host = browser.document.createElement('div');
  browser.document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(<LanguageProvider><AiChatWidget /></LanguageProvider>));
    await act(async () => host.querySelector<HTMLButtonElement>('.ai-chat__launcher')?.click());
    const provider = [...host.querySelectorAll<HTMLButtonElement>('.ai-chat__provider')]
      .find((button) => button.textContent?.includes('Workers AI'));
    assert.ok(provider);
    await act(async () => provider.click());
    assert.ok(host.querySelector('#ai-chat-account-id'));
    const token = host.querySelector<HTMLInputElement>('#ai-chat-key');
    assert.ok(token);
    assert.equal(token.type, 'password');
    await testUI(host, browser);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    globalThis.fetch = previousFetch;
    for (const [name, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
  }
}

async function enterValue(browser: Window, input: HTMLInputElement | HTMLTextAreaElement, text: string) {
  await act(async () => {
    input.focus();
    const prototype = input instanceof browser.HTMLTextAreaElement
      ? browser.HTMLTextAreaElement.prototype : browser.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(input, text);
    input.dispatchEvent(new browser.Event('input', { bubbles: true }));
  });
}

async function connect(host: HTMLElement, browser: Window) {
  const account = host.querySelector<HTMLInputElement>('#ai-chat-account-id');
  const token = host.querySelector<HTMLInputElement>('#ai-chat-key');
  const continueButton = host.querySelector<HTMLButtonElement>('.ai-chat__continue');
  assert.ok(account && token && continueButton);
  assert.equal(continueButton.disabled, true, 'Both fields are required');
  await enterValue(browser, account, 'not-an-account-id');
  await enterValue(browser, token, TOKEN);
  assert.equal(continueButton.disabled, true, 'Account ID must be a 32-character hex string');
  await enterValue(browser, account, ACCOUNT);
  assert.equal(continueButton.disabled, false);
  await act(async () => host.querySelector<HTMLFormElement>('.ai-chat__key-form')
    ?.dispatchEvent(new browser.Event('submit', { bubbles: true, cancelable: true })));
  assert.ok(host.querySelector('.ai-chat__transcript'));
}

async function send(host: HTMLElement, browser: Window, prompt: string) {
  const input = host.querySelector<HTMLTextAreaElement>('.ai-chat__composer textarea');
  const form = host.querySelector<HTMLFormElement>('.ai-chat__composer');
  assert.ok(input && form);
  await enterValue(browser, input, prompt);
  await act(async () => form.dispatchEvent(new browser.Event('submit', { bubbles: true, cancelable: true })));
}

test('Workers AI requires account ID and API token, streams responses, keeps memory and offers model switching', async () => {
  const calls: Array<{ url: string; token: string | null; payload: {
    accountId: string; model: string; messages: unknown[];
  } }> = [];
  await withCloudflare((async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({
      url: String(url),
      token: new Headers(init?.headers).get('Authorization'),
      payload: JSON.parse(String(init?.body)),
    });
    return successfulResponse(calls.length === 1 ? 'Chào bạn' : '**Hai** object');
  }) as typeof fetch, async (host, browser) => {
    assert.match(host.textContent ?? '', /Workers AI API Token/);
    assert.match(host.textContent ?? '', /không lưu token/);
    await connect(host, browser);
    const dropdown = host.querySelector<HTMLSelectElement>('#ai-chat-cloudflare-model');
    assert.ok(dropdown);
    assert.equal(dropdown.value, '@cf/google/gemma-4-26b-a4b-it');
    assert.equal(dropdown.options.length, 4);
    assert.equal(host.querySelector<HTMLAnchorElement>('.ai-chat__usage-link')?.href,
      'https://dash.cloudflare.com/');

    await send(host, browser, 'Tôi có 2 object');
    await send(host, browser, 'Có bao nhiêu object?');
    assert.equal(calls.length, 2);
    assert.ok(calls.every((call) => call.url === '/api/ai/cloudflare'
      && call.token === `Bearer ${TOKEN}` && call.payload.accountId === ACCOUNT));
    assert.deepEqual(calls[1].payload.messages, [
      { role: 'user', content: 'Tôi có 2 object' },
      { role: 'assistant', content: 'Chào bạn' },
      { role: 'user', content: 'Có bao nhiêu object?' },
    ]);
    assert.match(host.querySelector('.ai-chat__markdown strong')?.textContent ?? '', /Hai/);

    await act(async () => {
      dropdown.value = '@cf/openai/gpt-oss-20b';
      dropdown.dispatchEvent(new browser.Event('change', { bubbles: true }));
    });
    assert.equal(host.querySelectorAll('.ai-chat__message').length, 0);
    await send(host, browser, 'Đổi model');
    assert.equal(calls[2].payload.model, '@cf/openai/gpt-oss-20b');
    assert.deepEqual(calls[2].payload.messages, [{ role: 'user', content: 'Đổi model' }]);
    assert.equal(calls[2].token, `Bearer ${TOKEN}`);
  });
});

test('Workers AI receives Quiz topic; removing the topic resets context, not Account ID/API Token', async () => {
  const seen: Array<{ token: string | null; messages: Array<{ content: string }> }> = [];
  await withCloudflare((async (_url: RequestInfo | URL, init?: RequestInit) => {
    const payload = JSON.parse(String(init?.body));
    seen.push({ token: new Headers(init?.headers).get('Authorization'), messages: payload.messages });
    return successfulResponse('Đã giải thích');
  }) as typeof fetch, async (host, browser) => {
    await connect(host, browser);
    await act(async () => openAiSupportTopic(quizTopic('OOP', 'Nhóm Quiz', 'Câu hỏi về OOP', [
      { id: 'D', answer: 'Sai D', explanation: 'do not forward explanations' },
      { id: 'C', answer: 'Sai C', explanation: 'do not forward explanations' },
      { id: 'A', answer: 'Đúng A', explanation: 'do not forward explanations' },
      { id: 'B', answer: 'Sai B', explanation: 'do not forward explanations' },
    ], 'A')));
    assert.equal(seen.length, 0);
    assert.match(host.querySelector('.ai-chat__topic')?.textContent ?? '', /Nhóm Quiz/);
    await send(host, browser, 'Giải thích rõ hơn?');
    assert.match(seen[0].messages.at(-1)?.content ?? '', /Đáp án đúng: C\. Đúng A/);
    assert.doesNotMatch(seen[0].messages.at(-1)?.content ?? '', /do not forward explanations/);
    await act(async () => host.querySelector<HTMLButtonElement>('.ai-chat__topic-remove')?.click());
    assert.equal(host.querySelector('.ai-chat__topic'), null);
    assert.equal(host.querySelectorAll('.ai-chat__message').length, 0);
    await send(host, browser, 'Hỏi bình thường');
    assert.deepEqual(seen[1].messages, [{ role: 'user', content: 'Hỏi bình thường' }]);
    assert.equal(seen[1].token, `Bearer ${TOKEN}`);
  });
});

test('Workers AI errors support retry and restart aborts an active request', async () => {
  let requests = 0;
  await withCloudflare((async (_url: RequestInfo | URL, init?: RequestInit) => {
    requests++;
    if (requests === 1) return new Response(JSON.stringify({ code: 'quota' }), { status: 429 });
    if (requests === 2) return successfulResponse('Đã thử lại');
    return new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    });
  }) as typeof fetch, async (host, browser) => {
    await connect(host, browser);
    await send(host, browser, 'Câu hỏi 1');
    assert.match(host.querySelector('[role="alert"]')?.textContent ?? '', /429/);
    await act(async () => host.querySelector<HTMLButtonElement>('.ai-chat__chat-error button')?.click());
    assert.equal(requests, 2);
    assert.equal(host.querySelectorAll('.ai-chat__message--user').length, 1);
    assert.match(host.textContent ?? '', /Đã thử lại/);
    await send(host, browser, 'Câu hỏi đang chạy');
    assert.equal(host.querySelector<HTMLSelectElement>('#ai-chat-cloudflare-model')?.disabled, true);
    await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Bắt đầu lại"]')?.click());
    assert.ok(host.querySelector('.ai-chat__providers'));
    assert.equal(host.querySelector('.ai-chat__transcript'), null);
    await act(async () => [...host.querySelectorAll<HTMLButtonElement>('.ai-chat__provider')]
      .find((button) => button.textContent?.includes('Workers AI'))?.click());
    assert.equal(host.querySelector<HTMLInputElement>('#ai-chat-account-id')?.value, '');
    assert.equal(host.querySelector<HTMLInputElement>('#ai-chat-key')?.value, '');
  });
});
