import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { stringify } from 'yaml';
import { InterviewPanel } from '../../src/components/InterviewPanel';
import { QuizPanel } from '../../src/components/QuizPanel';
import { CaseStudyPanel } from '../../src/components/CaseStudyPanel';
import { LanguageProvider, useLanguage } from '../../src/state/LanguageContext';
import type { KnowledgeIndex } from '../../src/types/learning';

const knowledge: KnowledgeIndex = {
  version: 1, moduleId: 'ASPECT', language: 'vi', categoryCount: 0, sectionCount: 0,
  tree: [
    { kind: 'FOLDER', id: '1.First', title: 'First', children: [] },
    { kind: 'FOLDER', id: '2.Second', title: 'Second', children: [] },
  ],
};

function question(kind: 'quiz' | 'interview', label: string) {
  const common = {
    question: `Question ${label}`,
    readmeRelated: { anchor: 'anchor' },
    // Old Java releases can still contain this field; the UI ignores it.
    apiRelated: { controller: 'LegacyController', methodSignature: 'execute()' },
  };
  if (kind === 'interview') return stringify({ questions: [{ ...common, answer: `Answer ${label}` }] });
  return stringify({ questions: [{
    ...common, id: `Q_${label}`, correctAnswerId: 'A',
    answers: ['A', 'B', 'C', 'D'].map((id) => ({ id, answer: `Option ${id}`, explanation: `Explanation ${id}` })),
  }] });
}

test('Quiz and Interview choose only the selected chapter and keep their question interactions', async () => {
  const browser = new Window({ url: 'http://localhost:5000' });
  const keys = ['window', 'document', 'navigator', 'HTMLElement', 'Event', 'MutationObserver', 'DOMException', 'IS_REACT_ACT_ENVIRONMENT'] as const;
  const values: unknown[] = [browser, browser.document, browser.navigator, browser.HTMLElement, browser.Event, browser.MutationObserver, browser.DOMException, true];
  const saved = keys.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  keys.forEach((key, index) => Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: values[index] }));
  const originalFetch = globalThis.fetch;
  const calls: string[] = [];
  globalThis.fetch = (async (url: URL | RequestInfo) => {
    const request = String(url);
    calls.push(request);
    if (request.endsWith('/index.json')) return new Response(JSON.stringify({
      chapters: [
        { id: '2.Second', title: 'Second', questionCount: 1, path: 'menu/2.Second/question.yml' },
        { id: '1.First', title: 'First', questionCount: 1, path: 'menu/1.First/question.yml' },
      ], totalQuestions: 2,
    }), { status: 200 });
    if (request.endsWith('/question.yml')) {
      const kind = request.includes('/quiz/') ? 'quiz' : 'interview';
      return new Response(question(kind, request.includes('1.First') ? 'first' : 'second'), { status: 200 });
    }
    throw new Error(`Unexpected request: ${request}`);
  }) as typeof fetch;
  const container = browser.document.createElement('main');
  browser.document.body.append(container);
  const root = createRoot(container);
  const render = async (kind: 'quiz' | 'interview') => {
    const path = `/module/ASPECT/${kind}/vi/question.yml`;
    await act(async () => {
      root.render(<LanguageProvider>{kind === 'quiz'
        ? <QuizPanel path={path} knowledgeIndex={knowledge} />
        : <InterviewPanel path={path} knowledgeIndex={knowledge} />}</LanguageProvider>);
    });
  };
  const button = (text: string) => {
    const match = [...container.querySelectorAll('button')].find((item) => item.textContent?.includes(text));
    assert.ok(match, `Missing button ${text}: ${container.textContent}`);
    return match as HTMLButtonElement;
  };
  try {
    await render('quiz');
    assert.match(container.textContent ?? '', /Question first/);
    assert.equal(container.querySelector('[class*="__governance"]'), null);
    assert.doesNotMatch(container.textContent ?? '', /Question second/);
    assert.equal(calls.filter((url) => url.endsWith('/question.yml')).length, 1);
    const chapterButtons = [...container.querySelectorAll('.question-chapter-picker__item')];
    assert.match(chapterButtons[0].textContent ?? '', /First/);
    assert.match(chapterButtons[1].textContent ?? '', /Second/);
    await act(async () => { button('Second').click(); });
    assert.match(container.textContent ?? '', /Question second/);
    assert.doesNotMatch(container.textContent ?? '', /Question first/);
    assert.equal(calls.filter((url) => url.endsWith('/question.yml')).length, 2);
    await act(async () => { button('Option A').click(); });
    assert.match(container.textContent ?? '', /Explanation A/);
    assert.doesNotMatch(container.textContent ?? '', /Related API/);

    await render('interview');
    assert.match(container.textContent ?? '', /Question first/);
    assert.equal(container.querySelector('[class*="__governance"]'), null);
    await act(async () => { button('Câu trả lời tham khảo').click(); });
    assert.match(container.textContent ?? '', /Answer first/);
    assert.doesNotMatch(container.textContent ?? '', /Related API/);
    await act(async () => { button('Second').click(); });
    assert.match(container.textContent ?? '', /Question second/);
    assert.doesNotMatch(container.textContent ?? '', /Question first/);
    assert.doesNotMatch(container.textContent ?? '', /Answer first/);
    assert.equal(calls.some((url) => url.includes('/api/')), false);
  } finally {
    await act(async () => { root.unmount(); });
    await browser.happyDOM.abort();
    globalThis.fetch = originalFetch;
    keys.forEach((key, index) => {
      if (saved[index]) Object.defineProperty(globalThis, key, saved[index]);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
});

test('Case Study shows knowledge first and reveals hints and analysis independently', async () => {
  const browser = new Window({ url: 'http://localhost:5000' });
  const keys = ['window', 'document', 'navigator', 'HTMLElement', 'Event', 'MutationObserver', 'DOMException', 'IS_REACT_ACT_ENVIRONMENT'] as const;
  const values: unknown[] = [browser, browser.document, browser.navigator, browser.HTMLElement, browser.Event, browser.MutationObserver, browser.DOMException, true];
  const saved = keys.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  keys.forEach((key, index) => Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: values[index] }));
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (url: URL | RequestInfo) => {
    const request = String(url);
    if (request.endsWith('/index.json')) {
      return new Response(JSON.stringify({ mode: 'groups', totalQuestions: 2, chapters: [
        { id: 'group-1', title: 'First group', questionCount: 1, path: 'groups/1.yml' },
        { id: 'group-2', title: 'Second group', questionCount: 1, path: 'groups/2.yml' },
      ] }), { status: 200 });
    }
    const isSecond = request.endsWith('/groups/2.yml');
    return new Response(stringify({ cases: [{
      situation: isSecond ? 'Second situation' : 'First situation',
      resolve: 'Split responsibilities', knowledge: 'SRP',
      code: 'class Billing {}', readmeRelated: { anchorList: ['solid-002'] },
    }] }), { status: 200 });
  }) as typeof fetch;
  const container = browser.document.createElement('main');
  browser.document.body.append(container);
  const root = createRoot(container);
  const button = (text: string) => {
    const found = [...container.querySelectorAll('button')].find((item) => item.textContent?.includes(text));
    assert.ok(found, `Missing button ${text}`);
    return found as HTMLButtonElement;
  };
  try {
    await act(async () => root.render(
      <LanguageProvider><CaseStudyPanel path="/module/ASPECT/casestudy/vi/index.json" /></LanguageProvider>,
    ));
    assert.match(container.textContent ?? '', /First situation/);
    assert.match(container.textContent ?? '', /Kiến thức áp dụng/);
    assert.match(container.textContent ?? '', /SRP/);
    const caseCard = container.querySelector('.case-study-card') as HTMLElement;
    assert.ok(caseCard, 'Case Study has a dedicated class for scoped layout and theme styling');
    const knowledge = caseCard.querySelector('.case-study-knowledge') as HTMLElement;
    const hint = button('Gợi ý');
    const analysis = button('Phân tích và mã nguồn gợi ý');
    const source = button('Mã nguồn thực tế');
    assert.ok(knowledge.compareDocumentPosition(hint) & browser.Node.DOCUMENT_POSITION_FOLLOWING);
    assert.ok(hint.compareDocumentPosition(analysis) & browser.Node.DOCUMENT_POSITION_FOLLOWING);
    assert.ok(analysis.compareDocumentPosition(source) & browser.Node.DOCUMENT_POSITION_FOLLOWING);
    assert.equal(hint.getAttribute('aria-expanded'), 'false');
    assert.equal(analysis.getAttribute('aria-expanded'), 'false');
    assert.equal(source.getAttribute('aria-expanded'), 'false');
    assert.doesNotMatch(container.textContent ?? '', /Split responsibilities/);
    assert.doesNotMatch(container.textContent ?? '', /class Billing/);
    assert.doesNotMatch(container.textContent ?? '', /Hướng xử lý|Minh họa và mã nguồn/);
    await act(async () => { hint.click(); });
    assert.equal(hint.getAttribute('aria-expanded'), 'true');
    assert.match(container.textContent ?? '', /Split responsibilities/);
    assert.doesNotMatch(container.textContent ?? '', /class Billing/);
    await act(async () => { analysis.click(); });
    assert.equal(analysis.getAttribute('aria-expanded'), 'true');
    assert.match(container.textContent ?? '', /class Billing/);
    await act(async () => { source.click(); });
    assert.equal(source.getAttribute('aria-expanded'), 'true');
    assert.match(container.textContent ?? '', /chưa được phát hành/);
    await act(async () => { source.click(); });
    assert.equal(source.getAttribute('aria-expanded'), 'false');
    await act(async () => { hint.click(); });
    assert.doesNotMatch(container.textContent ?? '', /Split responsibilities/);
    assert.match(container.textContent ?? '', /class Billing/);
    await act(async () => { button('Second group').click(); });
    assert.match(container.textContent ?? '', /Second situation/);
    assert.doesNotMatch(container.textContent ?? '', /First situation/);
    assert.match(container.textContent ?? '', /SRP/);
    assert.equal(button('Gợi ý').getAttribute('aria-expanded'), 'false');
    assert.equal(button('Phân tích và mã nguồn gợi ý').getAttribute('aria-expanded'), 'false');
    assert.equal(button('Mã nguồn thực tế').getAttribute('aria-expanded'), 'false');
    assert.doesNotMatch(container.textContent ?? '', /class Billing/);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    globalThis.fetch = originalFetch;
    keys.forEach((key, index) => {
      if (saved[index]) Object.defineProperty(globalThis, key, saved[index]);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
});

function SwitchLanguage() {
  const { toggleLanguage } = useLanguage();
  return <button type="button" onClick={toggleLanguage}>Switch language</button>;
}

test('Case Study source explanation shows only authored panels, switches scenarios and sanitizes HTML', async () => {
  const browser = new Window({ url: 'http://localhost:5000' });
  const keys = ['window', 'document', 'navigator', 'HTMLElement', 'Event', 'MutationObserver', 'DOMException', 'IS_REACT_ACT_ENVIRONMENT'] as const;
  const values: unknown[] = [browser, browser.document, browser.navigator, browser.HTMLElement, browser.Event, browser.MutationObserver, browser.DOMException, true];
  const saved = keys.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  keys.forEach((key, index) => Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: values[index] }));
  const originalFetch = globalThis.fetch;
  const calls: string[] = [];
  const base = { situation: 'Example', resolve: 'Hint', knowledge: 'Fact', code: 'class Example {}' };
  globalThis.fetch = (async (url: URL | RequestInfo) => {
    const request = String(url);
    calls.push(request);
    if (request.endsWith('/index.json')) return new Response(JSON.stringify({
      mode: 'groups', totalQuestions: 5, chapters: [
        { id: 'group-1', title: 'First group', questionCount: 4, path: 'groups/1.yml' },
        { id: 'group-2', title: 'Second group', questionCount: 1, path: 'groups/2.yml' },
      ],
    }), { status: 200 });
    if (request.endsWith('/groups/1.yml')) return new Response(stringify({ cases: [
      { ...base, situation: 'Both parts', codeExplanation: {
        howItWorksHtml: '<p><strong>Invokes demo</strong> <img src="x" onerror="alert(1)"><script>alert(2)</script><a href="javascript:alert(3)">reference</a></p>',
        situations: [
          { id: 'valid', title: 'Valid case', description: '<em>Success explanation</em>',
            input: { value: 42 }, observations: [{ type: 'APP', source: 'service',
              expect: { keyword: 'ready', results: 'Passed check', conclusion: 'Observed locally' } }] },
          { id: 'invalid', title: 'Invalid case', detailDescription: '<strong>Fails validation</strong>',
            input: 'bad', status: 0, response: { error: 'rejected' } },
        ],
      } },
      { ...base, situation: 'Only working', codeExplanation: { howItWorksHtml: '<p>Only explanation</p>' } },
      { ...base, situation: 'Only scenarios', codeExplanation: { situations: [
        { id: 'only', title: 'Only scenario', description: 'Scenario text' },
      ] } },
      { ...base, situation: 'Empty content', codeExplanation: {
        howItWorksHtml: '<p>&nbsp;</p>', situations: [{ id: 'empty', title: 'No description' }],
      } },
    ] }), { status: 200 });
    if (request.endsWith('/groups/2.yml')) return new Response(stringify({ cases: [base] }), { status: 200 });
    throw new Error(`Unexpected URL: ${request}`);
  }) as typeof fetch;
  const container = browser.document.createElement('main');
  browser.document.body.append(container);
  const root = createRoot(container);
  const button = (label: string, within: Element = container) => {
    const found = [...within.querySelectorAll('button')].find((node) => node.textContent?.includes(label));
    assert.ok(found, `Missing button ${label}`);
    return found as HTMLButtonElement;
  };
  try {
    await act(async () => root.render(
      <LanguageProvider>
        <SwitchLanguage />
        <CaseStudyPanel path="/module/ASPECT/casestudy/vi/index.json" />
      </LanguageProvider>,
    ));
    const explanations = container.querySelectorAll('.case-study-explanation');
    assert.equal(explanations.length, 3, 'empty metadata must not render a parent');
    const cards = container.querySelectorAll('.case-study-card');
    const actualSource = button('Mã nguồn thực tế', cards[0]);
    const parent = button('Giải thích mã nguồn', cards[0]);
    assert.ok(actualSource.compareDocumentPosition(parent) & browser.Node.DOCUMENT_POSITION_FOLLOWING);
    assert.equal(parent.getAttribute('aria-expanded'), 'false');
    assert.equal(cards[0].textContent?.includes('Invokes demo'), false);
    await act(async () => parent.click());
    const how = button('Cách hoạt động', cards[0]);
    const situations = button('Các tình huống xảy ra', cards[0]);
    assert.equal(how.getAttribute('aria-expanded'), 'false');
    assert.equal(situations.getAttribute('aria-expanded'), 'false');
    await act(async () => how.click());
    assert.match(cards[0].textContent ?? '', /Invokes demo/);
    assert.equal(cards[0].querySelector('script'), null);
    assert.equal(cards[0].querySelector('[onerror]'), null);
    assert.equal(cards[0].querySelector('a[href^="javascript:"]'), null);
    assert.match(cards[0].textContent ?? '', /reference/, 'a link label remains readable without unsafe URL');
    await act(async () => situations.click());
    const choiceTabs = [...cards[0].querySelectorAll('.case-study-explanation__choice')];
    assert.equal(choiceTabs.length, 2);
    assert.equal(choiceTabs[0].getAttribute('aria-selected'), 'true');
    assert.match(cards[0].textContent ?? '', /Success explanation|Passed check|Observed locally/);
    assert.doesNotMatch(cards[0].textContent ?? '', /Fails validation/);
    assert.doesNotMatch(cards[0].textContent ?? '', /Status|Trạng thái/);
    await act(async () => (choiceTabs[1] as HTMLButtonElement).click());
    assert.equal(choiceTabs[1].getAttribute('aria-selected'), 'true');
    assert.match(cards[0].textContent ?? '', /Fails validation|rejected/);
    assert.match(cards[0].textContent ?? '', /Trạng thái|Status/);
    assert.doesNotMatch(cards[0].textContent ?? '', /Passed check/);
    assert.equal(cards[1].querySelectorAll('.case-study-explanation__toggle').length, 1);
    await act(async () => button('Giải thích mã nguồn', cards[1]).click());
    assert.ok(button('Cách hoạt động', cards[1]));
    assert.equal(cards[1].textContent?.includes('Các tình huống xảy ra'), false);
    await act(async () => button('Giải thích mã nguồn', cards[2]).click());
    assert.ok(button('Các tình huống xảy ra', cards[2]));
    assert.equal(cards[2].textContent?.includes('Cách hoạt động'), false);
    await act(async () => button('Switch language').click());
    assert.match(cards[0].textContent ?? '', /Source code explanation/);
    assert.match(cards[0].textContent ?? '', /How it works|Possible scenarios/);
    await act(async () => button('Second group').click());
    assert.equal(container.querySelector('.case-study-explanation'), null);
    assert.equal(calls.some((url) => url.includes('/api/')), false, 'explanation must not fetch API docs');
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    globalThis.fetch = originalFetch;
    keys.forEach((key, index) => {
      if (saved[index]) Object.defineProperty(globalThis, key, saved[index]);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
});
