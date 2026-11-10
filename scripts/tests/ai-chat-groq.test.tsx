import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Window } from 'happy-dom';
import { AiChatWidget } from '../../src/components/AiChatWidget';
import { LanguageProvider } from '../../src/state/LanguageContext';
import { openAiSupportTopic, quizTopic } from '../../src/data/aiSupportTopic';

function groqResponse(content: string): Response {
  const frames = [
    { choices: [{ index: 0, delta: { role: 'assistant' }, finish_reason: null }] },
    { choices: [{ index: 0, delta: { content }, finish_reason: null }] },
    { choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] },
  ].map((value) => `data: ${JSON.stringify(value)}\n\n`).join('') + 'data: [DONE]\n\n';
  return new Response(new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(frames));
      controller.close();
    },
  }), { status: 200, headers: { 'content-type': 'text/event-stream' } });
}

async function withGroq(
  fetchMock: typeof fetch,
  verify: (host: HTMLElement, browser: Window) => Promise<void>,
): Promise<void> {
  const browser = new Window({ url: 'http://localhost:5000' });
  const globals = {
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, HTMLInputElement: browser.HTMLInputElement,
    HTMLTextAreaElement: browser.HTMLTextAreaElement,
    Event: browser.Event, Node: browser.Node, KeyboardEvent: browser.KeyboardEvent,
    CustomEvent: browser.CustomEvent, IS_REACT_ACT_ENVIRONMENT: true,
  };
  const saved = new Map<string, PropertyDescriptor | undefined>();
  for (const [name, value] of Object.entries(globals)) {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
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
    const option = [...host.querySelectorAll<HTMLButtonElement>('.ai-chat__provider')]
      .find((button) => button.textContent?.includes('Groq'));
    assert.ok(option);
    await act(async () => option.click());
    const key = host.querySelector<HTMLInputElement>('#ai-chat-key');
    assert.ok(key);
    await act(async () => {
      key.focus();
      Object.getOwnPropertyDescriptor(browser.HTMLInputElement.prototype, 'value')?.set
        ?.call(key, 'test-groq-key');
      key.dispatchEvent(new browser.Event('input', { bubbles: true }));
    });
    await act(async () => host.querySelector<HTMLFormElement>('.ai-chat__key-form')
      ?.dispatchEvent(new browser.Event('submit', { bubbles: true, cancelable: true })));
    assert.ok(host.querySelector('.ai-chat__transcript'), 'Groq must enter the working chat stage');
    await verify(host, browser);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    globalThis.fetch = oldFetch;
    for (const [name, descriptor] of saved) {
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
  await act(async () =>
    form.dispatchEvent(new browser.Event('submit', { bubbles: true, cancelable: true })));
}

test('Groq UI offers three approved models, usage limits link, and multi-turn streaming', async () => {
  const requests: Array<{ url: string; key: string | null; body: Record<string, unknown> }> = [];
  await withGroq((async (url: RequestInfo | URL, init?: RequestInit) => {
    requests.push({
      url: String(url), key: new Headers(init?.headers).get('authorization'),
      body: JSON.parse(String(init?.body)) as Record<string, unknown>,
    });
    return groqResponse(requests.length === 1 ? 'Chào bạn' : '**Hai** con mèo');
  }) as typeof fetch, async (host, browser) => {
    const selector = host.querySelector<HTMLSelectElement>('#ai-chat-groq-model');
    assert.ok(selector);
    assert.equal(selector.options.length, 3);
    assert.deepEqual([...selector.options].map((option) => option.value), [
      'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b',
    ]);
    assert.equal(selector.value, 'openai/gpt-oss-120b');
    const link = host.querySelector<HTMLAnchorElement>('.ai-chat__usage-link');
    assert.ok(link);
    assert.equal(link.href, 'https://console.groq.com/settings/limits');
    assert.equal(link.target, '_blank');
    assert.match(link.rel, /noopener/);
    assert.equal(host.querySelector('#ai-chat-gemini-model'), null);
    await send(host, browser, 'Tôi có hai con mèo');
    await send(host, browser, 'Tôi có mấy con?');
    assert.equal(requests.length, 2);
    assert.ok(requests.every((request) => request.url === 'https://api.groq.com/openai/v1/chat/completions'));
    assert.ok(requests.every((request) => request.key === 'Bearer test-groq-key'));
    assert.deepEqual(requests[1].body.messages, [
      { role: 'user', content: 'Tôi có hai con mèo' },
      { role: 'assistant', content: 'Chào bạn' },
      { role: 'user', content: 'Tôi có mấy con?' },
    ]);
    assert.match(host.querySelector('.ai-chat__markdown strong')?.textContent ?? '', /Hai/);
    assert.equal(host.querySelectorAll('.ai-chat__message--user').length, 2);

    await act(async () => {
      selector.value = 'qwen/qwen3.8-27b';
      selector.dispatchEvent(new browser.Event('change', { bubbles: true }));
    });
    assert.equal(host.querySelectorAll('.ai-chat__message').length, 0);
    await send(host, browser, 'Một câu hỏi mới');
    assert.equal(requests[2].body.model, 'qwen/qwen3.8-27b');
    assert.deepEqual(requests[2].body.messages, [{ role: 'user', content: 'Một câu hỏi mới' }]);
    assert.equal(requests[2].body.reasoning_format, 'hidden');
    assert.equal(requests[2].key, 'Bearer test-groq-key');
  });
});

test('Groq receives Quiz context, discards it when the topic is removed, retaining key and model', async () => {
  const prompts: string[] = [];
  await withGroq((async (_url: RequestInfo | URL, init?: RequestInit) => {
    const request = JSON.parse(String(init?.body)) as { messages: Array<{ content: string }> };
    prompts.push(request.messages.at(-1)?.content ?? '');
    return groqResponse('Đã trả lời');
  }) as typeof fetch, async (host, browser) => {
    await act(async () => openAiSupportTopic(quizTopic('OOP', 'Nhóm Quiz', 'Câu hỏi OOP', [
      { id: 'D', answer: 'D ban đầu', explanation: 'hidden explanation' },
      { id: 'B', answer: 'B ban đầu', explanation: 'hidden explanation' },
      { id: 'A', answer: 'A ban đầu', explanation: 'hidden explanation' },
      { id: 'C', answer: 'C ban đầu', explanation: 'hidden explanation' },
    ], 'A')));
    assert.equal(prompts.length, 0, 'Opening the topic must not auto-call Groq');
    assert.match(host.querySelector('.ai-chat__topic')?.textContent ?? '', /Nhóm Quiz/);
    await send(host, browser, 'Vì sao chọn đáp án này?');
    assert.match(prompts[0], /Câu hỏi Quiz: Câu hỏi OOP/);
    assert.match(prompts[0], /Đáp án đúng: C\. A ban đầu/);
    assert.doesNotMatch(prompts[0], /hidden explanation/);

    await act(async () => host.querySelector<HTMLButtonElement>('.ai-chat__topic-remove')?.click());
    assert.equal(host.querySelector('.ai-chat__topic'), null);
    assert.equal(host.querySelectorAll('.ai-chat__message').length, 0);
    await send(host, browser, 'Câu hỏi độc lập');
    assert.equal(prompts[1], 'Câu hỏi độc lập');
    assert.equal(host.querySelector<HTMLSelectElement>('#ai-chat-groq-model')?.value, 'openai/gpt-oss-120b');
  });
});

test('Groq quota error supports retry without duplicating messages', async () => {
  let count = 0;
  await withGroq((async () => {
    count++;
    return count === 1 ? new Response('', { status: 429 }) : groqResponse('Hoàn thành');
  }) as typeof fetch, async (host, browser) => {
    await send(host, browser, 'Làm rõ OOP');
    assert.match(host.querySelector('[role="alert"]')?.textContent ?? '', /429/);
    await act(async () => host.querySelector<HTMLButtonElement>('.ai-chat__chat-error button')?.click());
    assert.equal(count, 2);
    assert.equal(host.querySelectorAll('.ai-chat__message--user').length, 1);
    assert.match(host.textContent ?? '', /Hoàn thành/);
  });
});

test('Groq start-over aborts active request, resets key and provider', async () => {
  let signal: AbortSignal | null = null;
  await withGroq((async (_url: RequestInfo | URL, init?: RequestInit) => {
    signal = init?.signal ?? null;
    return new Promise<Response>((_resolve, reject) => {
      signal?.addEventListener('abort', () => reject(new DOMException('Cancelled', 'AbortError')));
    });
  }) as typeof fetch, async (host, browser) => {
    await send(host, browser, 'Chưa xong');
    assert.ok(signal);
    assert.equal(signal.aborted, false);
    assert.equal(host.querySelector<HTMLSelectElement>('#ai-chat-groq-model')?.disabled, true);
    await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Bắt đầu lại"]')?.click());
    assert.equal(signal.aborted, true);
    assert.ok(host.querySelector('.ai-chat__providers'));
    assert.equal(host.querySelector('.ai-chat__transcript'), null);
    await act(async () => [...host.querySelectorAll<HTMLButtonElement>('.ai-chat__provider')]
      .find((button) => button.textContent?.includes('Groq'))?.click());
    assert.equal(host.querySelector<HTMLInputElement>('#ai-chat-key')?.value, '');
  });
});
