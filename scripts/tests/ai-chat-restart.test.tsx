import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Window } from 'happy-dom';
import { AiChatWidget } from '../../src/components/AiChatWidget';
import { LanguageProvider } from '../../src/state/LanguageContext';

test('AI Support uses an icon-only start-over action and resets the selected provider in popup/fullscreen', async () => {
  const browser = new Window({ url: 'http://localhost:5000' });
  const globals = {
    window: browser,
    document: browser.document,
    navigator: browser.navigator,
    HTMLElement: browser.HTMLElement,
    HTMLInputElement: browser.HTMLInputElement,
    Node: browser.Node,
    Event: browser.Event,
    MouseEvent: browser.MouseEvent,
    KeyboardEvent: browser.KeyboardEvent,
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const previous = new Map<string, PropertyDescriptor | undefined>();
  for (const [key, value] of Object.entries(globals)) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }

  const host = browser.document.createElement('div');
  browser.document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(<LanguageProvider><AiChatWidget /></LanguageProvider>));
    const launcher = host.querySelector<HTMLButtonElement>('.ai-chat__launcher');
    assert.ok(launcher);
    await act(async () => launcher.click());

    assert.ok(host.querySelector('.ai-chat__providers'));
    assert.equal(host.querySelector('[aria-label="Bắt đầu lại"]'), null,
      'Restart is not needed before a provider is chosen');
    assert.equal(host.textContent?.includes('Trò chuyện mới'), false);

    const gemini = [...host.querySelectorAll<HTMLButtonElement>('.ai-chat__provider')]
      .find((button) => button.textContent?.includes('Gemini'));
    assert.ok(gemini);
    await act(async () => gemini.click());
    assert.ok(host.querySelector('.ai-chat__key-form'));

    const reset = host.querySelector<HTMLButtonElement>('[aria-label="Bắt đầu lại"]');
    assert.ok(reset, 'Restart icon should appear after choosing a provider');
    assert.equal(reset.textContent?.trim(), '', 'Restart should be icon-only');
    assert.match(reset.title, /Xóa cuộc trò chuyện hiện tại và chọn lại trợ lý AI/);
    assert.ok(reset.querySelector('svg'), 'Restart action must have an SVG icon');

    const expand = host.querySelector<HTMLButtonElement>('[aria-label="Phóng to toàn màn hình"]');
    assert.ok(expand);
    await act(async () => expand.click());
    assert.ok(host.querySelector('.ai-chat__panel--fullscreen'));
    await act(async () => reset.click());
    assert.ok(host.querySelector('.ai-chat__providers'));
    assert.equal(host.querySelector('.ai-chat__key-form'), null);
    assert.equal(host.querySelector('.ai-chat__panel--fullscreen') === null, false,
      'Restart must preserve the expanded view');

    const workers = [...host.querySelectorAll<HTMLButtonElement>('.ai-chat__provider')]
      .find((button) => button.textContent?.includes('Workers AI'));
    assert.ok(workers);
    await act(async () => workers.click());
    assert.ok(host.querySelector('.ai-chat__welcome'));
    const resetAfterWorkers = host.querySelector<HTMLButtonElement>('[aria-label="Bắt đầu lại"]');
    assert.ok(resetAfterWorkers);
    await act(async () => resetAfterWorkers.click());
    assert.ok(host.querySelector('.ai-chat__providers'));
    assert.equal(host.querySelector('.ai-chat__welcome'), null);
    assert.equal(host.querySelector('[aria-label="Bắt đầu lại"]'), null);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
