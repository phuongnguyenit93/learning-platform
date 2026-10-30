import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Window } from 'happy-dom';
import { KnowledgePanel } from '../../src/components/KnowledgePanel';
import { LanguageProvider } from '../../src/state/LanguageContext';
import type { KnowledgeIndex } from '../../src/types/learning';

const knowledge: KnowledgeIndex = {
  version: 1, moduleId: 'OOP', language: 'vi', categoryCount: 1, sectionCount: 2,
  tree: [{
    kind: 'CATEGORY', id: 'ch1', title: 'Tư duy OOP', sourcePath: 'chapter.md',
    sections: [1, 2].map((n) => ({
      id: `lesson-${n}`, title: `Bài học ${n}`, content: `/lesson-${n}.md`,
      difficulty: 'BASIC',
    })),
  }],
};

test('chapter summary renders before lessons; sticky lesson summary closes on crossing into next lesson', async (t) => {
  const browser = new Window({ url: 'http://localhost:5000' });
  const originals = new Map<string, PropertyDescriptor | undefined>();
  let articleOneBottom = 1600;
  const mockFetch = async (path: string) => {
    const value = path.endsWith('/video/vi/index.json')
      ? {
        version: 1, moduleId: 'OOP', language: 'vi', videoCount: 1,
        items: [{ categoryId: 'ch1', title: 'Tư duy OOP', sourcePath: 'chapter.md',
          content: '/module/OOP/video/vi/content/ch1/script.json',
          url: '', sectionCount: 2, sceneCount: 3, transitionCount: 1 }],
      }
      : path.endsWith('/summary/vi/index.json')
      ? {
        version: 1, moduleId: 'OOP', language: 'vi', sectionCount: 1,
        items: [{ categoryId: 'ch1', title: 'Tư duy OOP',
          content: '/module/OOP/summary/vi/content/ch1/summary.json', lessonCount: 2 }],
      }
      : path.endsWith('/summary.json')
        ? {
          version: 1, moduleId: 'OOP', language: 'vi', categoryId: 'ch1',
          section: {
            version: 1, type: 'LEARNING_ROADMAP', title: 'Summary của chương',
            roadmapHeading: 'Mạch liên kết bài học',
            roadmap: [
              { id: 'lesson-1', order: 1, title: 'Tư duy OOP', description: 'Nền tảng lập trình hướng đối tượng.',
                transition: { to: 'lesson-2', description: '**Từ tư duy → ứng dụng**' } },
              { id: 'lesson-2', order: 2, title: 'Ứng dụng OOP', description: 'Vận dụng trách nhiệm.', transition: null },
            ],
            comparisonMarkdown: '## 2. Bảng đối chiếu các bài học\n\n| Tiêu chí | Bài 1 | Bài 2 | Bài 3 | Bài 4 | Bài 5 | Bài 6 | Bài 7 | Bài 8 | Bài 9 |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| Năng lực | Định hướng | Dữ liệu | Kiểu | Đóng gói | Kế thừa | Tương tác | Thiết kế | Thực hành | Kiểm thử |',
          },
          summaries: [
            { id: 'lesson-1', title: 'Bài học 1', summary: '## Tóm tắt riêng của bài 1' },
            { id: 'lesson-2', title: 'Bài học 2', summary: '## Tóm tắt riêng của bài 2' },
          ],
        }
        : null;
    return value ? { ok: true, json: async () => value } as Response
      : { ok: true, text: async () => '# Knowledge bài học' } as Response;
  };
  class FakeResizeObserver {
    observe() {}
    disconnect() {}
  }
  for (const [key, value] of Object.entries({
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, Event: browser.Event,
    MutationObserver: browser.MutationObserver, DOMException: browser.DOMException,
    ResizeObserver: FakeResizeObserver, IS_REACT_ACT_ENVIRONMENT: true, fetch: mockFetch,
  })) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  const originalRect = browser.HTMLElement.prototype.getBoundingClientRect;
  const originalRaf = browser.requestAnimationFrame;
  const originalCancel = browser.cancelAnimationFrame;
  const originalScrollTo = browser.scrollTo;
  browser.requestAnimationFrame = (callback) => browser.setTimeout(() => callback(0), 1) as unknown as number;
  browser.cancelAnimationFrame = (id) => browser.clearTimeout(id);
  browser.scrollTo = () => {};
  browser.HTMLElement.prototype.getBoundingClientRect = function () {
    const top = this.id === 'knowledge-section-lesson-1' ? 100 : 1500;
    const height = this.id === 'knowledge-section-lesson-1' ? articleOneBottom - top
      : this.classList.contains('topbar') ? 58
        : this.classList.contains('module-tab-wrapper') ? 48
          : this.classList.contains('knowledge-topic-nav') ? 42
            : this.classList.contains('knowledge-card__sticky') ? 180 : 40;
    return { top, bottom: top + height, height, left: 0, right: 400, width: 400,
      x: 0, y: top, toJSON: () => ({}) };
  };
  const container = browser.document.createElement('div');
  browser.document.body.append(container);
  const root = createRoot(container);
  let setCategory: ((id: string) => void) | undefined;
  function Harness() {
    const [category, updateCategory] = useState('all');
    const [selected, setSelected] = useState<string | null>(null);
    setCategory = updateCategory;
    return <LanguageProvider>
      <div className="topbar" /><div className="module-tab-wrapper" />
      <KnowledgePanel index={knowledge} loading={false} error={null} searchQuery=""
        activeCategoryId={category} selectedSectionId={selected}
        videoIndexPath="/module/OOP/video/vi/index.json"
        summaryIndexPath="/module/OOP/summary/vi/index.json"
        onCategoryChange={updateCategory} onSectionChange={setSelected}
        onNavigateToSection={(_, id) => setSelected(id)} />
    </LanguageProvider>;
  }
  t.after(async () => {
    await act(async () => root.unmount());
    browser.HTMLElement.prototype.getBoundingClientRect = originalRect;
    browser.requestAnimationFrame = originalRaf;
    browser.cancelAnimationFrame = originalCancel;
    browser.scrollTo = originalScrollTo;
    await browser.happyDOM.abort();
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });

  await act(async () => root.render(<Harness />));
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 45)); });
  const categoryToggle = container.querySelector<HTMLButtonElement>('.knowledge-category-group__header');
  assert.equal(categoryToggle?.getAttribute('aria-expanded'), 'false', 'chapter starts collapsed');
  await act(async () => categoryToggle?.click());
  const videoToggle = container.querySelector<HTMLButtonElement>('.knowledge-video__toggle');
  assert.equal(videoToggle?.getAttribute('aria-expanded'), 'false', 'video starts collapsed');
  assert.equal(container.querySelector('.knowledge-video__player-shell'), null);
  await act(async () => videoToggle?.click());
  assert.ok(container.querySelector('.knowledge-video__player-shell'));
  await act(async () => videoToggle?.click());
  assert.equal(container.querySelector('.knowledge-video__player-shell'), null);
  const chapter = container.querySelector('.knowledge-chapter-summary');
  const heading = container.querySelector('.knowledge-lessons-heading');
  assert.ok(chapter && heading && chapter.compareDocumentPosition(heading) & browser.Node.DOCUMENT_POSITION_FOLLOWING);
  assert.match(chapter.textContent ?? '', /Tóm tắt chương/);
  const chapterToggle = chapter.querySelector<HTMLButtonElement>('.knowledge-chapter-summary__heading');
  assert.equal(chapterToggle?.getAttribute('aria-expanded'), 'false', 'chapter summary starts collapsed');
  assert.equal(chapter.querySelector('.knowledge-roadmap__card'), null);
  await act(async () => chapterToggle?.click());
  assert.equal(chapter.querySelectorAll('.knowledge-roadmap__card').length, 2);
  assert.equal(chapter.querySelectorAll('.knowledge-roadmap__connector').length, 1);
  assert.match(chapter.querySelector('.knowledge-roadmap__connector-copy')?.textContent ?? '', /Từ tư duy → ứng dụng/);
  const wideTable = chapter.querySelector('.knowledge-summary-table-scroll');
  assert.ok(wideTable, 'wide summary tables have their own scroll region');
  assert.equal(wideTable.getAttribute('tabindex'), '0', 'table scroller is keyboard-accessible');
  assert.equal(wideTable.querySelectorAll('th').length, 10, 'all ten columns remain in the table');
  assert.match(chapter.querySelector('.knowledge-summary-table__hint')?.textContent ?? '', /Cuộn ngang/);
  const lessonsToggle = container.querySelector<HTMLButtonElement>('.knowledge-lessons-heading--toggle');
  assert.equal(lessonsToggle?.getAttribute('aria-expanded'), 'false');
  await act(async () => lessonsToggle?.click());
  const lesson1 = container.querySelector<HTMLElement>('#knowledge-section-lesson-1');
  const lesson2 = container.querySelector<HTMLElement>('#knowledge-section-lesson-2');
  assert.ok(lesson1 && lesson2);
  const button1 = lesson1.querySelector<HTMLButtonElement>('.knowledge-card__summary-toggle');
  const button2 = lesson2.querySelector<HTMLButtonElement>('.knowledge-card__summary-toggle');
  assert.ok(button1 && button2);
  await act(async () => button1.click());
  assert.equal(lesson1.classList.contains('is-expanded'), true);
  assert.match(lesson1.querySelector('.knowledge-card__summary')?.textContent ?? '', /Tóm tắt riêng của bài 1/);
  assert.equal(lesson2.querySelector('.knowledge-card__summary'), null);

  await act(async () => {
    browser.dispatchEvent(new browser.Event('scroll'));
    await new Promise((resolve) => setTimeout(resolve, 15));
  });
  assert.ok(lesson1.querySelector('.knowledge-card__summary'), 'the summary stays open while reading its lesson');
  articleOneBottom = 230;
  await act(async () => {
    browser.dispatchEvent(new browser.Event('scroll'));
    await new Promise((resolve) => setTimeout(resolve, 15));
  });
  assert.equal(lesson1.querySelector('.knowledge-card__summary'), null, 'crossing the next lesson closes the previous summary');
  assert.equal(button2.getAttribute('aria-expanded'), 'false', 'the following summary must not open automatically');

  await act(async () => setCategory?.('ch1'));
  assert.ok(container.querySelector('.knowledge-chapter-summary'), 'chapter summary also appears in a single-category view');
});
