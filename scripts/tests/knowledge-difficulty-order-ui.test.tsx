import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Window } from 'happy-dom';
import { KnowledgePanel } from '../../src/components/KnowledgePanel';
import { MenuPanel } from '../../src/components/MenuPanel';
import { LanguageProvider } from '../../src/state/LanguageContext';
import type { KnowledgeDifficulty, KnowledgeIndex } from '../../src/types/learning';

const lesson = (id: string, level: KnowledgeDifficulty) => ({
  id,
  title: id,
  content: '/' + id + '.md',
  difficulty: level,
});

const index: KnowledgeIndex = {
  version: 1,
  moduleId: 'test',
  language: 'vi',
  categoryCount: 2,
  sectionCount: 8,
  tree: [
    {
      kind: 'CATEGORY',
      id: 'chapter-one',
      title: 'Chapter One',
      sourcePath: '/one',
      sections: [
        lesson('advanced-1', 'ADVANCED'),
        lesson('basic-1', 'BASIC'),
        lesson('intermediate-1', 'INTERMEDIATE'),
        lesson('basic-2', 'BASIC'),
        lesson('advanced-2', 'ADVANCED'),
        lesson('intermediate-2', 'INTERMEDIATE'),
      ],
    },
    {
      kind: 'CATEGORY',
      id: 'chapter-two',
      title: 'Chapter Two',
      sourcePath: '/two',
      sections: [
        lesson('second-advanced', 'ADVANCED'),
        lesson('second-basic', 'BASIC'),
      ],
    },
  ],
};

test('Menu, Knowledge cards and topic flyout share difficulty order per chapter', async (t) => {
  const browser = new Window({ url: 'http://localhost:5000' });
  const originals = new Map<string, PropertyDescriptor | undefined>();
  class FakeResizeObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
  }

  for (const [key, value] of Object.entries({
    window: browser,
    document: browser.document,
    navigator: browser.navigator,
    HTMLElement: browser.HTMLElement,
    Event: browser.Event,
    MutationObserver: browser.MutationObserver,
    DOMException: browser.DOMException,
    ResizeObserver: FakeResizeObserver,
    IS_REACT_ACT_ENVIRONMENT: true,
  })) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }

  const container = browser.document.createElement('div');
  browser.document.body.append(container);
  const root = createRoot(container);
  let selectedCategory: string | null = null;

  t.after(async () => {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });

  await act(async () => root.render(
    <LanguageProvider>
      <MenuPanel index={index} loading={false} error={null} searchQuery=""
        selectedSectionId={null} onSelectSection={() => {}} />
      <KnowledgePanel index={index} loading={false} error={null} searchQuery=""
        activeCategoryId="all" selectedSectionId={null}
        onCategoryChange={(categoryId) => { selectedCategory = categoryId; }}
        onSectionChange={() => {}}
        onNavigateToSection={() => {}} />
    </LanguageProvider>,
  ));

  assert.equal(container.querySelector('[class*="__governance"]'), null);

  const expansionButtons = container.querySelectorAll<HTMLButtonElement>(
    '.knowledge-menu__toggle--category',
  );
  assert.equal(expansionButtons.length, 2);
  await act(async () => { expansionButtons[0].click(); expansionButtons[1].click(); });

  const expectedFirstChapter = [
    'basic-1', 'basic-2', 'intermediate-1',
    'intermediate-2', 'advanced-1', 'advanced-2',
  ];
  const categories = container.querySelectorAll('.knowledge-menu__category');
  assert.deepEqual(
    Array.from(categories[0].querySelectorAll('.knowledge-menu__section-title')).map((item) => item.textContent?.trim()),
    expectedFirstChapter,
  );
  assert.deepEqual(
    Array.from(categories[1].querySelectorAll('.knowledge-menu__section-title')).map((item) => item.textContent?.trim()),
    ['second-basic', 'second-advanced'],
  );

  const knowledgeGroups = container.querySelectorAll('.knowledge-category-group');
  assert.equal(knowledgeGroups.length, 2);
  assert.equal(knowledgeGroups[0].querySelector('.knowledge-card'), null, 'chapters start collapsed');
  for (const group of Array.from(knowledgeGroups)) {
    const chapterToggle = group.querySelector<HTMLButtonElement>('.knowledge-category-group__header');
    assert.equal(chapterToggle?.getAttribute('aria-expanded'), 'false');
    await act(async () => chapterToggle?.click());
    const lessonsToggle = group.querySelector<HTMLButtonElement>('.knowledge-lessons-heading--toggle');
    assert.equal(lessonsToggle?.getAttribute('aria-expanded'), 'false');
    await act(async () => lessonsToggle?.click());
  }
  assert.deepEqual(
    Array.from(knowledgeGroups[0].querySelectorAll('.knowledge-card')).map((item) => item.id.replace('knowledge-section-', '')),
    expectedFirstChapter,
  );
  assert.deepEqual(
    Array.from(knowledgeGroups[1].querySelectorAll('.knowledge-card')).map((item) => item.id.replace('knowledge-section-', '')),
    ['second-basic', 'second-advanced'],
  );

  const allTopic = container.querySelector<HTMLButtonElement>('.knowledge-topic-strip__button:first-child');
  assert.ok(allTopic);
  await act(async () => allTopic.focus());
  assert.equal(allTopic.getAttribute('aria-expanded'), 'true');
  assert.deepEqual(
    Array.from(container.querySelectorAll('.knowledge-topic-flyout__chapter > span:first-child'))
      .map((item) => item.textContent?.trim()),
    ['Chapter One', 'Chapter Two'],
    'All dropdown lists chapter names only, not individual lessons',
  );
  assert.equal(container.querySelectorAll('.knowledge-topic-flyout__chapter-count').length, 2);
  await act(async () => container.querySelector<HTMLButtonElement>('.knowledge-topic-flyout__chapter')?.click());
  assert.equal(selectedCategory, 'chapter-one', 'choosing a chapter changes the active category');
  assert.equal(container.querySelector('.knowledge-topic-flyout'), null);

  const firstTopic = container.querySelector<HTMLButtonElement>('.knowledge-topic-strip__button:nth-child(2)');
  assert.ok(firstTopic);
  await act(async () => firstTopic.focus());
  assert.deepEqual(
    Array.from(container.querySelectorAll('.knowledge-topic-flyout__item')).map((item) => item.textContent?.trim()),
    expectedFirstChapter,
  );

  // Selecting a single chapter must retain the exact same ordering as "All".
  await act(async () => root.render(
    <LanguageProvider>
      <MenuPanel index={index} loading={false} error={null} searchQuery=""
        selectedSectionId={null} onSelectSection={() => {}} />
      <KnowledgePanel index={index} loading={false} error={null} searchQuery=""
        activeCategoryId="chapter-one" selectedSectionId={null}
        onCategoryChange={() => {}} onSectionChange={() => {}}
        onNavigateToSection={() => {}} />
    </LanguageProvider>,
  ));
  const standaloneLessons = container.querySelector<HTMLButtonElement>('.knowledge-list > .knowledge-lessons-heading--toggle');
  // Expanded chapter state survives switching from All to a single category.
  assert.equal(standaloneLessons?.getAttribute('aria-expanded'), 'true');
  assert.deepEqual(
    Array.from(container.querySelectorAll('.knowledge-list > .knowledge-category-group__sections .knowledge-card'))
      .map((item) => item.id.replace('knowledge-section-', '')),
    expectedFirstChapter,
  );
});
