import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { KnowledgePanel } from '../../src/components/KnowledgePanel';
import { ModuleTabs, type ModuleTab } from '../../src/components/ModuleTabs';
import { QuestionReadingFrame, ReadingFullscreenContext, useModuleReadingFullscreen } from '../../src/components/ReadingFullscreen';
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
        <div className="learning-main learning-main--reading">
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
    assert.equal(sticky.children[1].className, 'reading-fullscreen-toolbar');
    assert.equal((sticky as HTMLElement).style.top, '0px');

    // Simulate mobile browsers without native element fullscreen support.
    Object.defineProperty(panel, 'requestFullscreen', { configurable: true, value: undefined });
    const button = panel.querySelector<HTMLButtonElement>('.reading-fullscreen-button');
    assert.ok(button);
    assert.equal(button.textContent?.trim(), 'Toàn màn hình');
    await act(async () => button.click());
    assert.ok(panel.classList.contains('is-focus-mode'));
    assert.match(button.getAttribute('aria-label') ?? '', /Thoát toàn màn hình/);
    await act(async () => browser.dispatchEvent(new browser.KeyboardEvent('keydown', { key: 'Escape' })));
    assert.equal(panel.classList.contains('is-focus-mode'), false);
    assert.equal(button.textContent?.trim(), 'Toàn màn hình');

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
    assert.equal(button.textContent?.trim(), 'Toàn màn hình');

    // The same fullscreen toolbar is used by question-based reading tabs.
    await act(async () => root.render(
      <LanguageProvider>
        <div className="learning-main learning-main--reading">
          <div className="learning-tab-panel">
            <QuestionReadingFrame><article>Quiz content remains mounted</article></QuestionReadingFrame>
          </div>
        </div>
      </LanguageProvider>,
    ));
    const questionFrame = host.querySelector<HTMLElement>('.question-reading-frame');
    assert.ok(questionFrame);
    assert.ok(questionFrame.querySelector('.question-reading-frame__sticky .reading-fullscreen-toolbar'));
    const questionButton = questionFrame.querySelector<HTMLButtonElement>('.reading-fullscreen-button');
    assert.ok(questionButton);
    Object.defineProperty(questionFrame, 'requestFullscreen', { configurable: true, value: undefined });
    await act(async () => questionButton.click());
    assert.ok(questionFrame.classList.contains('is-focus-mode'));
    assert.match(questionFrame.textContent ?? '', /Quiz content remains mounted/);
    await act(async () => browser.dispatchEvent(new browser.KeyboardEvent('keydown', { key: 'Escape' })));
    assert.equal(questionFrame.classList.contains('is-focus-mode'), false);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    keys.forEach((key, i) => {
      if (saved[i]) Object.defineProperty(globalThis, key, saved[i]);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
});

function SharedFullscreenTestPage() {
  const mainRef = useRef<HTMLElement>(null);
  const controls = useModuleReadingFullscreen(mainRef);
  const [active, setActive] = useState<ModuleTab>('knowledge');
  return (
    <ReadingFullscreenContext.Provider value={controls}>
      <section ref={mainRef} className={`learning-main learning-main--reading${controls.fullscreenMode ? ' learning-main--reading-fullscreen' : ''}${controls.fullscreenMode === 'focus' ? ' learning-main--fullscreen-focus' : ''}`}>
        <div className="learning-main__topline">Header hidden only in fullscreen</div>
        <div className="learning-search">Search hidden only in fullscreen</div>
        <div className="module-tab-wrapper">
          <ModuleTabs activeTab={active} stats={{ knowledge: 8, quiz: 6, interview: 3, casestudy: 2 }}
            referenceEnabled executionEnabled onChange={setActive} />
        </div>
        <div className="learning-tab-panel">
          <QuestionReadingFrame>
            <article>Active content: {active}</article>
          </QuestionReadingFrame>
        </div>
      </section>
    </ReadingFullscreenContext.Provider>
  );
}

test('shared fullscreen keeps module tabs available while switching reading sections', async () => {
  const browser = new Window({ url: 'http://localhost:5000' });
  const keys = ['window', 'document', 'navigator', 'HTMLElement', 'Event', 'KeyboardEvent',
    'MutationObserver', 'IS_REACT_ACT_ENVIRONMENT'] as const;
  const values: unknown[] = [browser, browser.document, browser.navigator, browser.HTMLElement,
    browser.Event, browser.KeyboardEvent, browser.MutationObserver, true];
  const saved = keys.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  keys.forEach((key, i) => Object.defineProperty(globalThis, key, {
    configurable: true, writable: true, value: values[i],
  }));
  const container = browser.document.createElement('div');
  browser.document.body.append(container);
  const root = createRoot(container);
  const getMain = () => container.querySelector<HTMLElement>('.learning-main');
  const fullscreenButton = () => container.querySelector<HTMLButtonElement>('.reading-fullscreen-button');
  const tab = (id: string) => container.querySelector<HTMLButtonElement>(`.module-tabs__button--${id}`);
  try {
    await act(async () => root.render(<LanguageProvider><SharedFullscreenTestPage /></LanguageProvider>));
    const main = getMain();
    assert.ok(main);
    assert.ok(tab('roadmap'));
    assert.ok(tab('reference'));
    assert.ok(tab('execution'));
    assert.ok(tab('feedback'));
    assert.equal(fullscreenButton()?.textContent?.trim(), 'Toàn màn hình');

    Object.defineProperty(main, 'requestFullscreen', { configurable: true, value: async () => {
      Object.defineProperty(browser.document, 'fullscreenElement', { configurable: true, value: main });
      browser.document.dispatchEvent(new browser.Event('fullscreenchange'));
    } });
    Object.defineProperty(browser.document, 'exitFullscreen', { configurable: true, value: async () => {
      Object.defineProperty(browser.document, 'fullscreenElement', { configurable: true, value: null });
      browser.document.dispatchEvent(new browser.Event('fullscreenchange'));
    } });

    await act(async () => fullscreenButton()?.click());
    assert.equal(browser.document.fullscreenElement, main);
    assert.ok(main.classList.contains('learning-main--reading-fullscreen'));
    assert.equal(fullscreenButton()?.textContent?.trim(), 'Thoát toàn màn hình');

    for (const section of ['quiz', 'interview', 'casestudy', 'knowledge']) {
      await act(async () => tab(section)?.click());
      assert.equal(tab(section)?.getAttribute('aria-selected'), 'true');
      assert.match(main.textContent ?? '', new RegExp(`Active content: ${section}`));
      assert.equal(browser.document.fullscreenElement, main);
      assert.equal(fullscreenButton()?.textContent?.trim(), 'Thoát toàn màn hình');
    }

    await act(async () => fullscreenButton()?.click());
    assert.equal(browser.document.fullscreenElement, null);
    assert.equal(main.classList.contains('learning-main--reading-fullscreen'), false);
    assert.equal(fullscreenButton()?.textContent?.trim(), 'Toàn màn hình');

    // Mobile/fallback fullscreen must retain the same shared menu until Escape.
    Object.defineProperty(main, 'requestFullscreen', { configurable: true, value: undefined });
    await act(async () => fullscreenButton()?.click());
    assert.ok(main.classList.contains('learning-main--fullscreen-focus'));
    await act(async () => tab('quiz')?.click());
    assert.ok(main.classList.contains('learning-main--fullscreen-focus'));
    await act(async () => browser.dispatchEvent(new browser.KeyboardEvent('keydown', { key: 'Escape' })));
    assert.equal(main.classList.contains('learning-main--reading-fullscreen'), false);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    keys.forEach((key, i) => {
      if (saved[i]) Object.defineProperty(globalThis, key, saved[i]);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
});
