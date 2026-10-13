import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Window } from 'happy-dom';
import { KnowledgePanel } from '../../src/components/KnowledgePanel';
import { LanguageProvider } from '../../src/state/LanguageContext';
import type { KnowledgeIndex } from '../../src/types/learning';

const index: KnowledgeIndex = {
  version: 1,
  moduleId: 'OOP',
  language: 'vi',
  categoryCount: 1,
  sectionCount: 2,
  tree: [{
    kind: 'CATEGORY',
    id: 'ch1',
    title: 'Chapter One',
    sourcePath: 'chapter-one',
    sections: [1, 2].map((number) => ({
      id: `oop-1-${number}`,
      title: `1.${number} Lesson ${number}`,
      content: `/lesson-${number}.md`,
      difficulty: 'BASIC',
      aiGenerated: false,
      reviewed: false,
    })),
  }],
};

test('manual expand never scrolls; navigation realigns once Markdown arrives', async (t) => {
  const browser = new Window({ url: 'http://localhost:5000' });
  const originals = new Map<string, PropertyDescriptor | undefined>();
  const pendingFetch = new Map<string, (response: Response) => void>();
  const scrolls: number[] = [];
  const raf = (callback: FrameRequestCallback): number =>
    browser.setTimeout(() => callback(0), 1) as unknown as number;

  class FakeResizeObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
  }

  for (const [key, value] of Object.entries({
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, Event: browser.Event,
    MutationObserver: browser.MutationObserver, DOMException: browser.DOMException,
    ResizeObserver: FakeResizeObserver, IS_REACT_ACT_ENVIRONMENT: true,
    fetch: (path: string) => new Promise<Response>((resolve) => {
      pendingFetch.set(path, resolve);
    }),
  })) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }

  const originalRect = browser.HTMLElement.prototype.getBoundingClientRect;
  const originalElementScroll = browser.HTMLElement.prototype.scrollTo;
  const originalWindowScroll = browser.scrollTo;
  const originalRaf = browser.requestAnimationFrame;
  const originalCancelRaf = browser.cancelAnimationFrame;

  browser.requestAnimationFrame = raf;
  browser.cancelAnimationFrame = (id) => browser.clearTimeout(id);
  browser.scrollTo = ((options: ScrollToOptions) => { scrolls.push(options.top ?? 0); }) as typeof browser.scrollTo;
  browser.HTMLElement.prototype.scrollTo = () => {};
  browser.HTMLElement.prototype.getBoundingClientRect = function () {
    const top = this.id === 'knowledge-section-oop-1-2'
      ? (this.querySelector('.knowledge-card__markdown') ? 780 : 500)
      : 0;
    const height = this.classList.contains('topbar') ? 58
      : this.classList.contains('module-tab-wrapper') ? 48
        : this.classList.contains('knowledge-topic-nav') ? 42 : 40;
    return { x: 0, y: top, top, left: 0, bottom: top + height, right: 400, width: 400, height, toJSON: () => ({}) };
  };

  const container = browser.document.createElement('div');
  browser.document.body.append(container);
  const root = createRoot(container);
  let selectExternal: ((id: string) => void) | undefined;
  function Harness() {
    const [selected, setSelected] = useState<string | null>(null);
    selectExternal = setSelected;
    return <LanguageProvider>
      <div className="topbar" /><div className="module-tab-wrapper" />
      <KnowledgePanel index={index} loading={false} error={null} searchQuery=""
        activeCategoryId="ch1" selectedSectionId={selected}
        onCategoryChange={() => {}} onSectionChange={setSelected}
        onNavigateToSection={(_, id) => setSelected(id)} />
    </LanguageProvider>;
  }

  t.after(async () => {
    await act(async () => root.unmount());
    browser.HTMLElement.prototype.getBoundingClientRect = originalRect;
    browser.HTMLElement.prototype.scrollTo = originalElementScroll;
    browser.scrollTo = originalWindowScroll;
    browser.requestAnimationFrame = originalRaf;
    browser.cancelAnimationFrame = originalCancelRaf;
    await browser.happyDOM.abort();
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });

  await act(async () => root.render(<Harness />));
  const manualButton = container.querySelector<HTMLButtonElement>('#knowledge-section-oop-1-1 button');
  assert.ok(manualButton);
  await act(async () => manualButton.click());
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });
  assert.equal(scrolls.length, 0, 'opening an accordion should not reposition the page');

  assert.ok(selectExternal);
  await act(async () => selectExternal!('oop-1-2'));
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 30)); });
  assert.ok(scrolls.length > 0, 'navigation to section id must scroll');
  assert.equal(scrolls.at(-1), 340, 'initial target uses actual measured sticky heights');

  const resolve = pendingFetch.get('/lesson-2.md');
  assert.ok(resolve, 'expanded selected lesson should load its Markdown');
  await act(async () => resolve({
    ok: true, text: async () => '# Lesson 2\n\nLoaded Markdown body',
  } as Response));
  await act(async () => { await new Promise((done) => setTimeout(done, 30)); });
  assert.equal(scrolls.at(-1), 620,
    'after content replaces the loading placeholder, navigation must remeasure section position');
});
