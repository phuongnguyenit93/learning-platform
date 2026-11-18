import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { BACKEND_API_BASE_URL as base } from '../../src/data/backendHealth';
import {
  fetchModuleChapterInsights, fetchModuleKnowledgeLesson, fetchModuleMenu,
} from '../../src/data/moduleKnowledge';
import { TopicStructurePage } from '../../src/pages/TopicStructurePage';
import { LanguageProvider, useLanguage } from '../../src/state/LanguageContext';

const section = (id: number, title: string, difficulty: string, available = true) => ({
  id, slug: 'shared', title, description: null, sortOrder: 1,
  knowledgeId: available ? id + 100 : null,
  difficulty: available ? difficulty : null, available, hasSummary: available,
});

const menu = {
  slug: 'java-oop', languageCode: 'vi',
  chapters: [
    { id: 22, slug: 'advanced', title: 'Advanced', description: null,
      sortOrder: 20, lessonCount: 1, sections: [section(20, 'Advanced Lesson', 'ADVANCED')] },
    { id: 11, slug: 'basics', title: 'Basics', description: null,
      sortOrder: 10, lessonCount: 2,
      sections: [
        { ...section(14, 'Second Lesson', 'ADVANCED'), slug: 'second', sortOrder: 9 },
        { ...section(10, 'First Lesson', 'BASIC'), sortOrder: 1 },
      ] },
  ],
  chapterCount: 2, lessonCount: 3,
};

const introLesson = {
  moduleSlug: 'java-oop', languageCode: 'vi',
  chapter: { id: 11, slug: 'basics', title: 'Basics', description: null },
  section: { id: 10, slug: 'shared', title: 'First Lesson', description: null },
  knowledgeId: 110, difficulty: 'BASIC', markdownContent: '# Basic content from DB',
  summary: '## Lesson summary from DB',
  focus: 'Focus value', problemSolved: 'Problem value',
  mechanism: 'Mechanism value', applicationValue: 'Application value',
};

const chapterInsights = {
  moduleSlug: 'java-oop', languageCode: 'vi',
  chapter: introLesson.chapter,
  lessons: [
    { id: 14, slug: 'second', title: 'Second Lesson', sortOrder: 9, knowledgeId: 114,
      difficulty: 'ADVANCED', focus: 'Advanced focus', problemSolved: 'Advanced problem',
      mechanism: 'Advanced mechanism', applicationValue: 'Advanced value' },
    { id: 10, slug: 'shared', title: 'First Lesson', sortOrder: 1, knowledgeId: 110,
      difficulty: 'BASIC', focus: 'Focus value', problemSolved: 'Problem value',
      mechanism: 'Mechanism value', applicationValue: 'Application value' },
  ],
};

function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), { status });
}

test('Menu adapter orders by DB sortOrder, accepts chapter-scoped duplicate lesson slugs and validates identity', async () => {
  const old = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, options?: RequestInit) => {
    requests.push(String(input));
    assert.equal(options?.cache, 'no-store');
    assert.equal((options?.headers as Record<string, string>).Accept, 'application/json');
    return json(menu);
  }) as typeof fetch;
  try {
    const result = await fetchModuleMenu('java-oop', 'vi', new AbortController().signal);
    assert.deepEqual(requests, [`${base}/modules/java-oop/menu?lang=vi`]);
    assert.deepEqual(result?.chapters.map((chapter) => chapter.slug), ['basics', 'advanced']);
    assert.deepEqual(result?.chapters[0].sections.map((item) => item.id), [10, 14],
      'Backend sort order has priority over the difficulty order');
    assert.equal(result?.lessonCount, 3);
  } finally { globalThis.fetch = old; }
});

test('Menu and lesson adapters distinguish 404 from 5xx, reject mismatched IDs and locale', async () => {
  const old = globalThis.fetch;
  let response = new Response(null, { status: 404 });
  globalThis.fetch = (async () => response) as typeof fetch;
  try {
    const signal = new AbortController().signal;
    assert.equal(await fetchModuleMenu('java-oop', 'vi', signal), null);
    assert.equal(await fetchModuleKnowledgeLesson('java-oop', 'basics', 'shared', 'vi', signal), null);
    assert.equal(await fetchModuleChapterInsights('java-oop', 'basics', 'vi', signal), null);
    response = new Response(null, { status: 503 });
    await assert.rejects(fetchModuleMenu('java-oop', 'vi', signal), /HTTP 503/);
    await assert.rejects(fetchModuleKnowledgeLesson('java-oop', 'basics', 'shared', 'vi', signal), /HTTP 503/);
    await assert.rejects(fetchModuleChapterInsights('java-oop', 'basics', 'vi', signal), /HTTP 503/);
    response = json({ ...menu, slug: 'other' });
    await assert.rejects(fetchModuleMenu('java-oop', 'vi', signal), /Invalid Module Menu/);
    response = json({ ...introLesson, chapter: { ...introLesson.chapter, slug: 'other' } });
    await assert.rejects(fetchModuleKnowledgeLesson('java-oop', 'basics', 'shared', 'vi', signal),
      /Invalid Module Knowledge/);
    response = json({ ...chapterInsights, languageCode: 'en' });
    await assert.rejects(fetchModuleChapterInsights('java-oop', 'basics', 'vi', signal),
      /Invalid Chapter Insights/);
  } finally { globalThis.fetch = old; }
});

test('Published Markdown accepts null/blank optional metadata but still requires content and difficulty', async () => {
  const old = globalThis.fetch;
  const signal = new AbortController().signal;
  let response = json({
    ...introLesson, summary: null, focus: null, problemSolved: null,
    mechanism: null, applicationValue: null,
  });
  globalThis.fetch = (async () => response) as typeof fetch;
  try {
    const published = await fetchModuleKnowledgeLesson('java-oop', 'basics', 'shared', 'vi', signal);
    assert.equal(published?.markdownContent, '# Basic content from DB');
    assert.equal(published?.summary, null);
    assert.deepEqual([published?.focus, published?.problemSolved,
      published?.mechanism, published?.applicationValue], [null, null, null, null]);

    response = json({ ...introLesson, summary: '', focus: '  ',
      problemSolved: null, mechanism: '', applicationValue: null });
    const partial = await fetchModuleKnowledgeLesson('java-oop', 'basics', 'shared', 'vi', signal);
    assert.equal(partial?.summary, '');
    assert.equal(partial?.focus, '  ');

    response = json({ ...introLesson, markdownContent: '  ', summary: null,
      focus: null, problemSolved: null, mechanism: null, applicationValue: null });
    await assert.rejects(fetchModuleKnowledgeLesson('java-oop', 'basics', 'shared', 'vi', signal),
      /Invalid Module Knowledge/);
    response = json({ ...introLesson, difficulty: null, summary: null,
      focus: null, problemSolved: null, mechanism: null, applicationValue: null });
    await assert.rejects(fetchModuleKnowledgeLesson('java-oop', 'basics', 'shared', 'vi', signal),
      /Invalid Module Knowledge/);
  } finally { globalThis.fetch = old; }
});

test('Chapter Insights adapter accepts null or blank comparison fields and preserves published lesson order', async () => {
  const old = globalThis.fetch;
  const response = {
    ...chapterInsights,
    lessons: chapterInsights.lessons.map((lesson, index) => ({
      ...lesson,
      focus: index === 0 ? null : '',
      problemSolved: null,
      mechanism: index === 0 ? 'Mechanism still available' : ' ',
      applicationValue: null,
    })),
  };
  globalThis.fetch = (async () => json(response)) as typeof fetch;
  try {
    const insights = await fetchModuleChapterInsights('java-oop', 'basics', 'vi', new AbortController().signal);
    assert.deepEqual(insights?.lessons.map((item) => item.title), ['First Lesson', 'Second Lesson']);
    assert.equal(insights?.lessons[0].focus, '');
    assert.equal(insights?.lessons[1].focus, null);
    assert.equal(insights?.lessons[1].mechanism, 'Mechanism still available');
  } finally { globalThis.fetch = old; }
});

function Controls() {
  const { toggleLanguage, language } = useLanguage();
  const navigate = useNavigate();
  const { search } = useLocation();
  return <>
    <button type="button" data-testid="switch-language" onClick={toggleLanguage}>{language}</button>
    <button type="button" data-testid="back" onClick={() => navigate(-1)}>Back</button>
    <output data-testid="search">{search}</output>
  </>;
}

async function withReader(
  initial: string,
  handle: (url: string, options?: RequestInit) => Response | Promise<Response>,
  verify: (host: HTMLElement, requests: string[]) => Promise<void>,
) {
  const browser = new Window({ url: 'http://localhost:5173' });
  const globals = {
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, Event: browser.Event, CustomEvent: browser.CustomEvent,
    KeyboardEvent: browser.KeyboardEvent, Node: browser.Node,
    ResizeObserver: class { observe() {} disconnect() {} }, MutationObserver: browser.MutationObserver,
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const saved = Object.fromEntries(Object.keys(globals).map((key) =>
    [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  const oldFetch = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, options?: RequestInit) => {
    const url = String(input);
    requests.push(url);
    if (url === `${base}/topics`) return json([{
      id: 1, code: 'JAVA', slug: 'java', name: 'Java', description: '',
      iconSvg: '<svg/>', status: 'AVAILABLE', sortOrder: 0,
      category: { id: 1, code: 'BACKEND', name: 'Backend', sortOrder: 0 },
    }]);
    if (url === `${base}/topics/1/structure`) return json({
      version: 1, root: { kind: 'GROUP', children: [
        { kind: 'MODULE', nodeKey: 'JAVA_OOP', slug: 'java-oop',
          name: 'Object-oriented', path: '/java/oop', children: [] },
      ] },
    });
    if (url === `${base}/modules/java-oop`) return json({
      id: 3, serviceName: 'JAVA_OOP', slug: 'java-oop', name: 'Java OOP',
      description: 'Learn OOP', specialNote: null,
    });
    return handle(url, options);
  }) as typeof fetch;
  const host = browser.document.createElement('div');
  browser.document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[initial]}>
          <Controls />
          <Routes>
            <Route path="/learning/:topicSlug/knowledge/:moduleSlug" element={<TopicStructurePage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    ));
    await verify(host, requests);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    globalThis.fetch = oldFetch;
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

test('Deep-link opens scoped lesson, lazy fetches one CLOB, renders summary and whole-chapter insights', async () => {
  await withReader('/learning/java/knowledge/java-oop?tab=knowledge&chapter=basics&lesson=shared',
    (url) => {
      if (url === `${base}/modules/java-oop/menu?lang=vi`) return json(menu);
      if (url === `${base}/modules/java-oop/knowledge/basics/shared?lang=vi`) return json(introLesson);
      if (url === `${base}/modules/java-oop/chapters/basics/insights?lang=vi`) return json(chapterInsights);
      throw new Error(`Unexpected URL: ${url}`);
    }, async (host, requests) => {
      assert.deepEqual(requests.filter((url) => url.includes('/knowledge/')), [
        `${base}/modules/java-oop/knowledge/basics/shared?lang=vi`,
      ], 'Identical section slugs in other chapters must never trigger a second fetch');
      assert.match(host.querySelector('.knowledge-card__markdown')?.textContent ?? '', /Basic content from DB/);
      assert.match(host.querySelector('.knowledge-db-comparison')?.textContent ?? '', /Focus value/);
      assert.equal(host.querySelector('.module-tabs__button--knowledge .module-tabs__count')?.textContent, '3');
      assert.ok(host.querySelector('.reading-fullscreen-button'), 'Keep the original fullscreen controls');
      assert.deepEqual(requests.filter((url) => url.includes('/insights?')), [], 'Comparison metadata loads lazily');
      await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-card__summary-toggle')?.click());
      assert.match(host.querySelector('.knowledge-card__summary')?.textContent ?? '', /Lesson summary from DB/);
      await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-chapter-summary__heading')?.click());
      assert.deepEqual(requests.filter((url) => url.includes('/insights?')), [
        `${base}/modules/java-oop/chapters/basics/insights?lang=vi`,
      ]);
      const comparison = host.querySelector('.knowledge-chapter-summary__scroll')?.textContent ?? '';
      assert.match(comparison, /Advanced focus/);
      assert.match(comparison, /Focus value/);
      assert.ok(comparison.indexOf('First Lesson') < comparison.indexOf('Second Lesson'),
        'Insights sort by DB sortOrder, independent of difficulty');
      assert.equal(requests.some((url) => url.includes('/language/java')), false);
    });
});

test('Unpublished sections are disabled and never requested; Menu 404 gives empty state', async () => {
  const inactive = { ...menu, chapters: [{
    id: 11, slug: 'basics', title: 'Basics', description: null, sortOrder: 1,
    lessonCount: 0, sections: [section(10, 'Hidden', 'BASIC', false)],
  }] };
  await withReader('/learning/java/knowledge/java-oop',
    (url) => {
      if (url === `${base}/modules/java-oop/menu?lang=vi`) return json(inactive);
      throw new Error(`Unexpected URL: ${url}`);
    }, async (host, requests) => {
      await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-category-group__header')?.click());
      await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-lessons-heading--toggle')?.click());
      const button = host.querySelector<HTMLButtonElement>('.knowledge-card__trigger');
      assert.equal(button?.disabled, true);
      assert.match(host.querySelector('.knowledge-card')?.textContent ?? '', /Chưa xuất bản/);
      assert.equal(requests.some((url) => url.includes('/knowledge/')), false);
    });
  await withReader('/learning/java/knowledge/java-oop',
    (url) => {
      if (url === `${base}/modules/java-oop/menu?lang=vi`)
        return new Response(null, { status: 404 });
      throw new Error(`Unexpected URL: ${url}`);
    }, async (host) => {
      assert.match(host.textContent ?? '', /Chưa có dữ liệu Knowledge/);
      assert.doesNotMatch(host.textContent ?? '', /Không thể tải Knowledge từ database/);
    });
});

test('Lesson 5xx exposes retry and does not refetch structure or unrelated sections', async () => {
  let calls = 0;
  await withReader('/learning/java/knowledge/java-oop?chapter=basics&lesson=shared',
    (url) => {
      if (url === `${base}/modules/java-oop/menu?lang=vi`) return json(menu);
      if (url === `${base}/modules/java-oop/knowledge/basics/shared?lang=vi`) {
        calls += 1;
        return calls === 1 ? new Response(null, { status: 503 }) : json(introLesson);
      }
      throw new Error(`Unexpected URL: ${url}`);
    }, async (host, requests) => {
      assert.match(host.querySelector('.knowledge-section-status--error')?.textContent ?? '', /HTTP 503/);
      await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-section-status--error button')?.click());
      assert.equal(calls, 2);
      assert.match(host.querySelector('.knowledge-card__markdown')?.textContent ?? '', /Basic content from DB/);
      assert.equal(requests.filter((url) => url.endsWith('/topics/1/structure')).length, 1);
    });
});

test('Language switch drops VI lesson while EN Menu loads, without silently falling back', async () => {
  let release!: (response: Response) => void;
  const english = new Promise<Response>((resolve) => { release = resolve; });
  const enMenu = { ...menu, languageCode: 'en', chapters: [
    { ...menu.chapters[1], title: 'English basics', sections: [
      { ...section(10, 'English lesson', 'BASIC') },
    ] },
  ] };
  await withReader('/learning/java/knowledge/java-oop?chapter=basics&lesson=shared',
    (url) => {
      if (url === `${base}/modules/java-oop/menu?lang=vi`) return json(menu);
      if (url === `${base}/modules/java-oop/knowledge/basics/shared?lang=vi`) return json(introLesson);
      if (url === `${base}/modules/java-oop/menu?lang=en`) return english;
      if (url === `${base}/modules/java-oop/knowledge/basics/shared?lang=en`)
        return json({ ...introLesson, languageCode: 'en', markdownContent: '# English DB lesson',
          chapter: { ...introLesson.chapter, title: 'English basics' },
          section: { ...introLesson.section, title: 'English lesson' } });
      throw new Error(`Unexpected URL: ${url}`);
    }, async (host, requests) => {
      assert.match(host.textContent ?? '', /Basic content from DB/);
      await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="switch-language"]')?.click());
      assert.doesNotMatch(host.textContent ?? '', /Basic content from DB/);
      assert.match(host.textContent ?? '', /Loading Knowledge menu/);
      assert.ok(requests.includes(`${base}/modules/java-oop/menu?lang=en`));
      await act(async () => release(json(enMenu)));
      assert.match(host.querySelector('.knowledge-card__markdown')?.textContent ?? '', /English DB lesson/);
      assert.doesNotMatch(host.textContent ?? '', /Basic content from DB/);
    });
});

test('WRITTEN lesson without metadata remains readable; summary and empty chapter comparison have no blank shells', async () => {
  const withoutMetadata = {
    ...introLesson, summary: null, focus: null, problemSolved: null,
    mechanism: null, applicationValue: null,
  };
  const withoutSummaryMenu = {
    ...menu,
    chapters: menu.chapters.map((chapter) => ({
      ...chapter,
      sections: chapter.sections.map((item) => item.id === 10
        ? { ...item, hasSummary: false, available: true } : item),
    })),
  };
  const withoutInsights = {
    ...chapterInsights,
    lessons: chapterInsights.lessons.map((item) => ({
      ...item, focus: null, problemSolved: null, mechanism: null, applicationValue: null,
    })),
  };
  await withReader('/learning/java/knowledge/java-oop?chapter=basics&lesson=shared',
    (url) => {
      if (url === `${base}/modules/java-oop/menu?lang=vi`) return json(withoutSummaryMenu);
      if (url === `${base}/modules/java-oop/knowledge/basics/shared?lang=vi`) return json(withoutMetadata);
      if (url === `${base}/modules/java-oop/chapters/basics/insights?lang=vi`) return json(withoutInsights);
      throw new Error(`Unexpected URL: ${url}`);
    }, async (host, requests) => {
      assert.match(host.querySelector('.knowledge-card__markdown')?.textContent ?? '', /Basic content from DB/);
      assert.equal(host.querySelector('.knowledge-db-comparison'), null,
        'Do not show an empty per-lesson comparison table');
      const firstLesson = host.querySelector('[id="knowledge-db-section-11:10"]');
      assert.ok(firstLesson, 'The deep-linked lesson should be present');
      assert.equal(firstLesson.querySelector('.knowledge-card__summary-toggle') === null, true,
        'hasSummary:false must not produce an empty summary toggle for this lesson');
      assert.doesNotMatch(host.textContent ?? '', /Invalid Module Knowledge/);
      await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-chapter-summary__heading')?.click());
      assert.match(host.querySelector('.knowledge-chapter-summary__scroll')?.textContent ?? '',
        /Chưa bổ sung thông tin so sánh cho chương này/);
      assert.equal(host.querySelector('.knowledge-chapter-summary__scroll table'), null,
        'Chapter insights with only null metadata must not render an empty table');
      assert.equal(requests.filter((url) => url.includes('/knowledge/')).length, 1);
    });
});

test('Partially populated metadata displays values and neutral missing cells; null summary remains safe', async () => {
  const partialLesson = {
    ...introLesson, summary: null, focus: 'Focus already filled',
    problemSolved: null, mechanism: '   ', applicationValue: null,
  };
  const partialInsights = {
    ...chapterInsights,
    lessons: chapterInsights.lessons.map((item) => ({
      ...item,
      focus: item.id === 10 ? 'Focus already filled' : null,
      problemSolved: null, mechanism: '', applicationValue: null,
    })),
  };
  await withReader('/learning/java/knowledge/java-oop?chapter=basics&lesson=shared',
    (url) => {
      if (url === `${base}/modules/java-oop/menu?lang=vi`) return json(menu);
      if (url === `${base}/modules/java-oop/knowledge/basics/shared?lang=vi`) return json(partialLesson);
      if (url === `${base}/modules/java-oop/chapters/basics/insights?lang=vi`) return json(partialInsights);
      throw new Error(`Unexpected URL: ${url}`);
    }, async (host) => {
      assert.match(host.querySelector('.knowledge-card__markdown')?.textContent ?? '', /Basic content from DB/);
      assert.match(host.querySelector('.knowledge-db-comparison')?.textContent ?? '', /Focus already filled/);
      assert.match(host.querySelector('.knowledge-db-comparison')?.textContent ?? '', /Chưa bổ sung/);
      await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-card__summary-toggle')?.click());
      assert.match(host.querySelector('.knowledge-card__summary')?.textContent ?? '',
        /Chưa bổ sung tóm tắt bài học/);
      await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-chapter-summary__heading')?.click());
      const summaryTable = host.querySelector('.knowledge-chapter-summary__scroll table');
      assert.ok(summaryTable, 'Partially filled chapter metadata should still render a comparison');
      assert.match(summaryTable.textContent ?? '', /Focus already filled/);
      assert.match(summaryTable.textContent ?? '', /Chưa bổ sung/);
    });
});
