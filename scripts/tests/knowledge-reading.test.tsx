import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { KnowledgePanel } from '../../src/components/KnowledgePanel';
import { LanguageProvider } from '../../src/state/LanguageContext';
import type { KnowledgeIndex } from '../../src/types/learning';

const index: KnowledgeIndex = {
  version: 1,
  moduleId: 'TEST_MODULE',
  language: 'vi',
  categoryCount: 1,
  sectionCount: 1,
  tree: [{
    kind: 'CATEGORY',
    id: 'basics',
    title: 'Tư duy OOP',
    sourcePath: 'basics',
    sections: [{ id: 'lesson-1', title: 'Bài học đầu tiên', content: '/lesson.md', difficulty: 'BASIC' }],
  }],
};

test('Knowledge fullscreen controls stay with the category navigation and can exit focus fallback via Escape', async () => {
  const browser = new Window({ url: 'http://localhost:5000' });
  const keys = ['window', 'document', 'navigator', 'HTMLElement', 'Event', 'KeyboardEvent',
    'MutationObserver', 'ResizeObserver', 'IS_REACT_ACT_ENVIRONMENT'] as const;
  const values: unknown[] = [browser, browser.document, browser.navigator, browser.HTMLElement,
    browser.Event, browser.KeyboardEvent, browser.MutationObserver,
    class ResizeObserverStub { observe() {} disconnect() {} }, true];
  const saved = keys.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  keys.forEach((key, i) => Object.defineProperty(globalThis, key, {
    configurable: true, writable: true, value: values[i],
  }));

  const host = browser.document.createElement('main');
  browser.document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(
      <LanguageProvider>
        <div className="module-tab-wrapper" />
        <div className="learning-main learning-main--knowledge-reading">
          <div className="learning-tab-panel">
            <KnowledgePanel index={index} loading={false} error={null} searchQuery=""
              activeCategoryId="all" selectedSectionId={null}
              onCategoryChange={() => {}} onSectionChange={() => {}} onNavigateToSection={() => {}} />
          </div>
        </div>
      </LanguageProvider>,
    ));

    const panel = host.querySelector<HTMLElement>('.knowledge-panel');
    assert.ok(panel);
    const sticky = panel.querySelector('.knowledge-sticky-controls');
    assert.ok(sticky);
    assert.equal(sticky.children[0].className, 'knowledge-topic-nav');
    assert.equal(sticky.children[1].className, 'knowledge-reader-toolbar');
    assert.equal((sticky as HTMLElement).style.top, '0px');

    // Simulate mobile browsers without native element fullscreen support.
    Object.defineProperty(panel, 'requestFullscreen', { configurable: true, value: undefined });
    const button = panel.querySelector<HTMLButtonElement>('.knowledge-reader-toolbar__fullscreen');
    assert.ok(button);
    assert.match(button.getAttribute('aria-label') ?? '', /Phóng toàn màn hình/);
    await act(async () => button.click());
    assert.ok(panel.classList.contains('is-focus-mode'));
    assert.match(button.getAttribute('aria-label') ?? '', /Thoát toàn màn hình/);
    await act(async () => browser.dispatchEvent(new browser.KeyboardEvent('keydown', { key: 'Escape' })));
    assert.equal(panel.classList.contains('is-focus-mode'), false);
    assert.match(button.getAttribute('aria-label') ?? '', /Phóng toàn màn hình/);

    // Desktop path: native fullscreenchange updates the toolbar in both directions.
    Object.defineProperty(panel, 'requestFullscreen', { configurable: true, value: async () => {
      Object.defineProperty(browser.document, 'fullscreenElement', { configurable: true, value: panel });
      browser.document.dispatchEvent(new browser.Event('fullscreenchange'));
    } });
    Object.defineProperty(browser.document, 'exitFullscreen', { configurable: true, value: async () => {
      Object.defineProperty(browser.document, 'fullscreenElement', { configurable: true, value: null });
      browser.document.dispatchEvent(new browser.Event('fullscreenchange'));
    } });
    await act(async () => button.click());
    assert.match(button.getAttribute('aria-label') ?? '', /Thoát toàn màn hình/);
    await act(async () => button.click());
    assert.match(button.getAttribute('aria-label') ?? '', /Phóng toàn màn hình/);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    keys.forEach((key, i) => {
      if (saved[i]) Object.defineProperty(globalThis, key, saved[i]);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
});
