import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { stringify } from 'yaml';
import { InterviewPanel } from '../../src/components/InterviewPanel';
import { QuizPanel } from '../../src/components/QuizPanel';
import { LanguageProvider } from '../../src/state/LanguageContext';
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
    readmeRelated: { anchor: 'anchor' }, apiRelated: { controller: '', methodSignature: '' },
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

    await render('interview');
    assert.match(container.textContent ?? '', /Question first/);
    assert.equal(container.querySelector('[class*="__governance"]'), null);
    await act(async () => { button('Câu trả lời tham khảo').click(); });
    assert.match(container.textContent ?? '', /Answer first/);
    await act(async () => { button('Second').click(); });
    assert.match(container.textContent ?? '', /Question second/);
    assert.doesNotMatch(container.textContent ?? '', /Question first/);
    assert.doesNotMatch(container.textContent ?? '', /Answer first/);
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
