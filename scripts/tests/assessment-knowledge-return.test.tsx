import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { stringify } from 'yaml';
import { LearningPage } from '../../src/pages/LearningPage';
import { LanguageProvider } from '../../src/state/LanguageContext';

const route = 'ASSESSMENT_RETURN_TEST';
const moduleNode = {
  kind: 'MODULE', id: 'assessment-return', name: 'assessment-return',
  routeId: route, path: '/module/assessment-return', children: [],
  knowledge: { vi: `/module/${route}/knowledge/vi/index.json` },
  quiz: { vi: `/module/${route}/quiz/vi/index.json` },
  interview: { vi: `/module/${route}/interview/vi/index.json` },
  casestudy: { vi: `/module/${route}/casestudy/vi/index.json` },
};

const section = {
  kind: 'CATEGORY', id: 'basics', title: 'Basics', sourcePath: 'basics',
  sections: [{ id: 'lesson-1', title: '1. Lesson', difficulty: 'BASIC',
    content: `/module/${route}/knowledge/vi/lesson.md` }],
};

const quiz = stringify({ questions: [{
  id: 'Q1', question: 'Quiz source question', correctAnswerId: 'A',
  readmeRelated: { anchorList: ['lesson-1'] },
  answers: ['A', 'B', 'C', 'D'].map((id) => ({
    id, answer: `Answer ${id}`, explanation: `Explanation ${id}`,
  })),
}] });
const interview = stringify({ questions: [{
  question: 'Interview source question', answer: 'Detailed answer',
  readmeRelated: { anchorList: ['lesson-1'] },
}] });
const casestudy = stringify({ cases: [{
  situation: 'Case Study source situation', resolve: 'Hint', knowledge: 'Design',
  code: 'class Example {}', readmeRelated: { anchorList: ['lesson-1'] },
}] });

test('only related-knowledge navigation shows a back button beside fullscreen and restores each assessment', async () => {
  const browser = new Window({ url: 'http://localhost:5000' });
  const keys = ['window', 'document', 'navigator', 'HTMLElement', 'Event', 'KeyboardEvent',
    'MutationObserver', 'ResizeObserver', 'IS_REACT_ACT_ENVIRONMENT'] as const;
  const values: unknown[] = [browser, browser.document, browser.navigator, browser.HTMLElement,
    browser.Event, browser.KeyboardEvent, browser.MutationObserver,
    class ResizeObserverStub { observe() {} disconnect() {} }, true];
  const previous = keys.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  keys.forEach((key, i) => Object.defineProperty(globalThis, key, {
    configurable: true, writable: true, value: values[i],
  }));
  const oldFetch = globalThis.fetch;
  globalThis.fetch = (async (target: RequestInfo | URL) => {
    const url = String(target);
    const json = (data: unknown) => new Response(JSON.stringify(data), { status: 200 });
    if (url === '/module-navigation.json') return json({
      version: 1, root: { id: 'module', kind: 'GROUP', name: 'Modules', children: [moduleNode] },
    });
    if (url === `/module-details/${route}.json`) return json(moduleNode);
    if (url === '/module-content-counts.json') return json({
      version: 1, locales: {
        vi: { [route]: { knowledge: 1, quiz: 1, interview: 1, casestudy: 1 } },
        en: { [route]: { knowledge: 1, quiz: 1, interview: 1, casestudy: 1 } },
      },
    });
    if (url.endsWith('/knowledge/vi/index.json')) return json({
      version: 1, moduleId: route, language: 'vi', categoryCount: 1,
      sectionCount: 1, tree: [section],
    });
    if (url.endsWith('/knowledge/vi/lesson.md')) {
      return new Response('# Lesson content', { status: 200 });
    }
    if (url.endsWith('/quiz/vi/index.json')
      || url.endsWith('/interview/vi/index.json')
      || url.endsWith('/casestudy/vi/index.json')) {
      return json({ mode: 'groups', totalQuestions: 1, chapters: [
        { id: 'group-1', title: 'Group 1', questionCount: 1, path: 'groups/1.yml' },
      ] });
    }
    if (url.endsWith('/quiz/vi/groups/1.yml')) return new Response(quiz, { status: 200 });
    if (url.endsWith('/interview/vi/groups/1.yml')) return new Response(interview, { status: 200 });
    if (url.endsWith('/casestudy/vi/groups/1.yml')) return new Response(casestudy, { status: 200 });
    throw new Error(`Unexpected fetch: ${url}`);
  }) as typeof fetch;

  const container = browser.document.createElement('div');
  browser.document.body.append(container);
  const root = createRoot(container);
  const tab = (kind: string) => container.querySelector<HTMLButtonElement>(
    `.module-tabs__button--${kind}`);
  const main = () => container.querySelector<HTMLElement>('.learning-main');
  const back = () => container.querySelector<HTMLButtonElement>(
    '.knowledge-sticky-controls .reading-return-button');
  try {
    await act(async () => root.render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[`/learning/java/knowledge/${route}`]}>
          <Routes><Route path="/learning/java/knowledge/:moduleId" element={<LearningPage />} /></Routes>
        </MemoryRouter>
      </LanguageProvider>,
    ));
    assert.equal(back(), null, 'Direct Knowledge entry must never offer assessment return');

    for (const [kind, cardSelector, expected] of [
      ['quiz', '.quiz-card', 'Quay lại Quiz'],
      ['interview', '.interview-card', 'Quay lại Interview'],
      ['casestudy', '.case-study-card', 'Quay lại Case Study'],
    ] as const) {
      await act(async () => tab(kind)?.click());
      const card = container.querySelector<HTMLElement>(cardSelector);
      assert.ok(card, `Missing ${kind} card`);
      assert.ok(main());
      if (kind === 'quiz') {
        await act(async () => card.querySelector<HTMLButtonElement>('.quiz-answer')?.click());
        assert.ok(card.querySelector('.quiz-answer.is-selected'));
      } else if (kind === 'interview') {
        await act(async () => card.querySelector<HTMLButtonElement>('.interview-answer-toggle')?.click());
        assert.ok(card.querySelector('.interview-answer'));
      } else {
        await act(async () => card.querySelector<HTMLButtonElement>('.interview-answer-toggle')?.click());
        assert.ok(card.querySelector('.interview-answer'));
      }

      const currentMain = main()!;
      currentMain.scrollTop = 375;
      const origin = card.querySelector<HTMLButtonElement>('.related-knowledge-list__link');
      assert.ok(origin);
      Object.defineProperty(currentMain, 'getBoundingClientRect', {
        configurable: true, value: () => ({ top: 50 }),
      });
      let sourceOffset = 200;
      Object.defineProperty(origin, 'getBoundingClientRect', {
        configurable: true, value: () => ({ top: sourceOffset }),
      });
      await act(async () => origin.click());
      assert.equal(tab('knowledge')?.getAttribute('aria-selected'), 'true');
      assert.equal(back()?.textContent?.trim(), expected);
      const buttons = container.querySelectorAll(
        '.knowledge-sticky-controls .reading-fullscreen-toolbar button');
      assert.deepEqual([...buttons].map((button) => button.textContent?.trim()),
        [expected, 'Toàn màn hình']);
      // Simulate a layout change while reading Knowledge: the return action
      // must align the original link, not just restore a stale pixel offset.
      if (kind === 'quiz') sourceOffset = 230;
      await act(async () => back()?.click());
      assert.equal(tab(kind)?.getAttribute('aria-selected'), 'true');
      assert.equal(currentMain.scrollTop, kind === 'quiz' ? 405 : 375,
        `Return must restore the clicked ${kind} link position`);
      assert.equal(back(), null, 'The return button is single-use');
      if (kind === 'quiz') assert.ok(card.querySelector('.quiz-answer.is-selected'));
      if (kind === 'interview') assert.ok(card.querySelector('.interview-answer'));
      if (kind === 'casestudy') assert.ok(card.querySelector('.interview-answer'));
      // Manually opening Knowledge is not a related-lesson navigation.
      await act(async () => tab('knowledge')?.click());
      assert.equal(back(), null);
    }
    // A manual tab switch cancels a pending return, rather than leaving a
    // misleading button on a later direct visit to Knowledge.
    await act(async () => tab('quiz')?.click());
    await act(async () => container.querySelector<HTMLButtonElement>(
      '.quiz-card .related-knowledge-list__link')?.click());
    assert.ok(back());
    await act(async () => tab('interview')?.click());
    await act(async () => tab('knowledge')?.click());
    assert.equal(back(), null);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    globalThis.fetch = oldFetch;
    keys.forEach((key, i) => {
      if (previous[i]) Object.defineProperty(globalThis, key, previous[i]);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
});
