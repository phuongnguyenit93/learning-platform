import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Window } from 'happy-dom';
import { AiChatWidget } from '../../src/components/AiChatWidget';
import { LanguageProvider } from '../../src/state/LanguageContext';
import { openAiSupportTopic, quizTopic } from '../../src/data/aiSupportTopic';

function streamedResponse(content: string): Response {
  const frames = [
    { choices: [{ index: 0, delta: { role: 'assistant' }, finish_reason: null }] },
    { choices: [{ index: 0, delta: { content }, finish_reason: null }] },
    { choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] },
  ].map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join('') + 'data: [DONE]\n\n';
  return new Response(new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(frames));
      controller.close();
    },
  }), { status: 200, headers: { 'content-type': 'text/event-stream' } });
}

async function withOpenRouter(
  fetchMock: typeof fetch,
  run: (host: HTMLElement, browser: Window) => Promise<void>,
) {
  const browser = new Window({ url: 'http://localhost:5000' });
  const globals = {
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, HTMLInputElement: browser.HTMLInputElement,
    HTMLTextAreaElement: browser.HTMLTextAreaElement, Event: browser.Event,
    Node: browser.Node, KeyboardEvent: browser.KeyboardEvent,
    CustomEvent: browser.CustomEvent, IS_REACT_ACT_ENVIRONMENT: true,
  };
  const original = new Map<string, PropertyDescriptor | undefined>();
  for (const [name, value] of Object.entries(globals)) {
    original.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
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
    const choice = [...host.querySelectorAll<HTMLButtonElement>('.ai-chat__provider')]
      .find((button) => button.textContent?.includes('OpenRouter'));
    assert.ok(choice);
    await act(async () => choice.click());
    const key = host.querySelector<HTMLInputElement>('#ai-chat-key');
    assert.ok(key);
    await act(async () => {
      key.focus();
      Object.getOwnPropertyDescriptor(browser.HTMLInputElement.prototype, 'value')?.set
        ?.call(key, 'test-openrouter-key');
      key.dispatchEvent(new browser.Event('input', { bubbles: true }));
    });
    await act(async () => host.querySelector<HTMLFormElement>('.ai-chat__key-form')
      ?.dispatchEvent(new browser.Event('submit', { bubbles: true, cancelable: true })));
    assert.ok(host.querySelector('.ai-chat__transcript'));
    await run(host, browser);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    globalThis.fetch = previousFetch;
    for (const [name, descriptor] of original) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
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
  });
  await act(async () => form.dispatchEvent(new browser.Event('submit', { bubbles: true, cancelable: true })));
}

test('OpenRouter UI offers seven models, separate Usage and Free Models links, streaming and multi-turn memory', async () => {
  const requests: Array<{ url: string; key: string | null; model: string; messages: unknown[] }> = [];
  await withOpenRouter((async (url: RequestInfo | URL, options?: RequestInit) => {
    const body = JSON.parse(String(options?.body)) as { model: string; messages: unknown[] };
    requests.push({
      url: String(url), key: new Headers(options?.headers).get('authorization'),
      model: body.model, messages: body.messages,
    });
    return streamedResponse(requests.length === 1 ? 'Chào bạn' : '**Hai** con mèo');
  }) as typeof fetch, async (host, browser) => {
    const select = host.querySelector<HTMLSelectElement>('#ai-chat-openrouter-model');
    assert.ok(select);
    assert.equal(select.options.length, 7);
    assert.equal(select.value, 'nvidia/nemotron-3-ultra-550b-a55b:free');
    assert.equal(select.options[6].value, 'openrouter/free');
    assert.equal(host.querySelector('#ai-chat-groq-model'), null);
    const usage = host.querySelector<HTMLAnchorElement>('.ai-chat__usage-link:not(.ai-chat__more-models-link)');
    const models = host.querySelector<HTMLAnchorElement>('.ai-chat__more-models-link');
    assert.ok(usage && models);
    assert.equal(usage.href, 'https://openrouter.ai/activity');
    assert.equal(models.href, 'https://openrouter.ai/collections/free-models');
    assert.equal(models.target, '_blank');
    assert.match(models.rel, /noopener/);

    await send(host, browser, 'Tôi có hai con mèo');
    await send(host, browser, 'Có mấy con?');
    assert.equal(requests.length, 2);
    assert.ok(requests.every((request) =>
      request.url === 'https://openrouter.ai/api/v1/chat/completions'
      && request.key === 'Bearer test-openrouter-key'));
    assert.deepEqual(requests[1].messages, [
      { role: 'user', content: 'Tôi có hai con mèo' },
      { role: 'assistant', content: 'Chào bạn' },
      { role: 'user', content: 'Có mấy con?' },
    ]);
    assert.match(host.querySelector('.ai-chat__markdown strong')?.textContent ?? '', /Hai/);

    await act(async () => {
      select.value = 'openrouter/free';
      select.dispatchEvent(new browser.Event('change', { bubbles: true }));
    });
    assert.equal(host.querySelectorAll('.ai-chat__message').length, 0);
    await send(host, browser, 'Hỏi model tự động');
    assert.equal(requests[2].model, 'openrouter/free');
    assert.deepEqual(requests[2].messages, [{ role: 'user', content: 'Hỏi model tự động' }]);
    assert.equal(requests[2].key, 'Bearer test-openrouter-key');
  });
});

test('OpenRouter sends Quiz topic without reference explanations; removing the topic restores ordinary chat', async () => {
  const prompts: string[] = [];
  await withOpenRouter((async (_url: RequestInfo | URL, options?: RequestInit) => {
    const request = JSON.parse(String(options?.body)) as { messages: Array<{ content: string }> };
    prompts.push(request.messages.at(-1)?.content ?? '');
    return streamedResponse('OK');
  }) as typeof fetch, async (host, browser) => {
    await act(async () => openAiSupportTopic(quizTopic('OOP', 'Nhóm Quiz', 'Câu hỏi OOP', [
      { id: 'D', answer: 'Lựa chọn D', explanation: 'Do not include this' },
      { id: 'B', answer: 'Lựa chọn B', explanation: 'Do not include this' },
      { id: 'A', answer: 'Lựa chọn A', explanation: 'Do not include this' },
      { id: 'C', answer: 'Lựa chọn C', explanation: 'Do not include this' },
    ], 'A')));
    assert.equal(prompts.length, 0, 'Opening a topic must not automatically send a request');
    assert.match(host.querySelector('.ai-chat__topic')?.textContent ?? '', /Nhóm Quiz/);
    await send(host, browser, 'Tại sao là đáp án đúng?');
    assert.match(prompts[0], /Câu hỏi Quiz: Câu hỏi OOP/);
    assert.match(prompts[0], /Đáp án đúng: C\. Lựa chọn A/);
    assert.doesNotMatch(prompts[0], /Do not include this/);
    await act(async () => host.querySelector<HTMLButtonElement>('.ai-chat__topic-remove')?.click());
    assert.equal(host.querySelector('.ai-chat__topic'), null);
    assert.equal(host.querySelectorAll('.ai-chat__message').length, 0);
    await send(host, browser, 'Câu hỏi thông thường');
    assert.equal(prompts[1], 'Câu hỏi thông thường');
    assert.equal(host.querySelector<HTMLSelectElement>('#ai-chat-openrouter-model')?.value,
      'nvidia/nemotron-3-ultra-550b-a55b:free');
  });
});

test('OpenRouter 429 error supports retry without duplicating the original user message', async () => {
  let requests = 0;
  await withOpenRouter((async () => {
    requests++;
    return requests === 1 ? new Response('', { status: 429 }) : streamedResponse('Đã xử lý');
  }) as typeof fetch, async (host, browser) => {
    await send(host, browser, 'Giải thích Java');
    assert.match(host.querySelector('[role="alert"]')?.textContent ?? '', /429/);
    await act(async () => host.querySelector<HTMLButtonElement>('.ai-chat__chat-error button')?.click());
    assert.equal(requests, 2);
    assert.equal(host.querySelectorAll('.ai-chat__message--user').length, 1);
    assert.match(host.textContent ?? '', /Đã xử lý/);
  });
});

test('OpenRouter start-over aborts a request and clears its API key', async () => {
  let signal: AbortSignal | null = null;
  await withOpenRouter((async (_url: RequestInfo | URL, options?: RequestInit) => {
    signal = options?.signal ?? null;
    return new Promise<Response>((_resolve, reject) => {
      signal?.addEventListener('abort', () => reject(new DOMException('Cancelled', 'AbortError')));
    });
  }) as typeof fetch, async (host, browser) => {
    await send(host, browser, 'Câu hỏi chưa xong');
    assert.ok(signal);
    assert.equal(signal.aborted, false);
    assert.equal(host.querySelector<HTMLSelectElement>('#ai-chat-openrouter-model')?.disabled, true);
    await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Bắt đầu lại"]')?.click());
    assert.equal(signal.aborted, true);
    assert.ok(host.querySelector('.ai-chat__providers'));
    assert.equal(host.querySelector('.ai-chat__transcript'), null);
    await act(async () => [...host.querySelectorAll<HTMLButtonElement>('.ai-chat__provider')]
      .find((button) => button.textContent?.includes('OpenRouter'))?.click());
    assert.equal(host.querySelector<HTMLInputElement>('#ai-chat-key')?.value, '');
  });
});
