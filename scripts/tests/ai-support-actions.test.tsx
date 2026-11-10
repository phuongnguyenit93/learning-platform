import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Window } from 'happy-dom';
import { KnowledgePanel } from '../../src/components/KnowledgePanel';
import { QuizPanel } from '../../src/components/QuizPanel';
import { InterviewPanel } from '../../src/components/InterviewPanel';
import { AiChatWidget } from '../../src/components/AiChatWidget';
import { LanguageProvider } from '../../src/state/LanguageContext';
import { AI_SUPPORT_TOPIC_EVENT, type AiSupportTopic } from '../../src/data/aiSupportTopic';
import type { KnowledgeIndex } from '../../src/types/learning';

const knowledge: KnowledgeIndex = {
  version: 1,
  moduleId: 'OOP',
  language: 'vi',
  categoryCount: 1,
  sectionCount: 1,
  tree: [{
    kind: 'CATEGORY',
    id: 'object-identity',
    title: 'Danh tính đối tượng',
    sourcePath: '/chapter.yml',
    sections: [{
      id: 'references', title: '1.1 Biến tham chiếu', content: '/long-lesson.md', difficulty: 'BASIC',
    }],
  }],
};

async function withPanel(
  render: () => React.ReactElement,
  verify: (host: HTMLElement, browser: Window, received: AiSupportTopic[]) => Promise<void>,
) {
  const browser = new Window({ url: 'http://localhost:5000' });
  const globals = {
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, Event: browser.Event,
    CustomEvent: browser.CustomEvent, MutationObserver: browser.MutationObserver,
    ResizeObserver: class { observe() {} disconnect() {} },
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const saved = new Map<string, PropertyDescriptor | undefined>();
  for (const [key, value] of Object.entries(globals)) {
    saved.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  const received: AiSupportTopic[] = [];
  browser.addEventListener(AI_SUPPORT_TOPIC_EVENT, (event) =>
    received.push((event as CustomEvent<AiSupportTopic>).detail));
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (request: RequestInfo | URL) => {
    const path = String(request);
    if (path.endsWith('/index.json')) {
      return new Response(JSON.stringify({
        mode: 'groups',
        totalQuestions: 1,
        chapters: [{
          id: 'group-1', title: 'Nền tảng và tư duy thiết kế OOP',
          path: 'groups/1.yml', questionCount: 1,
        }],
      }), { status: 200 });
    }
    if (path.endsWith('/quiz/vi/groups/1.yml')) {
      return new Response(`questions:
  - question: OOP giúp gì?
    readmeRelated:
      anchorList: []
    correctAnswerId: B
    answers:
      - { id: A, answer: Câu trả lời một, explanation: Không gửi giải thích }
      - { id: B, answer: Câu trả lời đúng, explanation: Không gửi giải thích }
      - { id: C, answer: Câu trả lời ba, explanation: Không gửi giải thích }
      - { id: D, answer: Câu trả lời bốn, explanation: Không gửi giải thích }
`, { status: 200 });
    }
    if (path.endsWith('/interview/vi/groups/1.yml')) {
      return new Response(`questions:
  - question: OOP giải quyết vấn đề gì?
    answer: Đây là câu trả lời tham khảo không được gửi
    readmeRelated:
      anchorList: []
`, { status: 200 });
    }
    if (path.endsWith('/long-lesson.md')) {
      return new Response('# Nội dung Markdown dài không được gửi cho AI');
    }
    throw Error(`Unexpected requested content: ${path}`);
  }) as typeof fetch;

  const host = browser.document.createElement('div');
  browser.document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(<LanguageProvider>{render()}<AiChatWidget /></LanguageProvider>));
    await act(async () => new Promise((resolve) => setTimeout(resolve, 10)));
    await verify(host, browser, received);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    globalThis.fetch = originalFetch;
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

test('Knowledge Ask AI action sits before lesson Markdown and sends just the three titles', async () => {
  await withPanel(() => <KnowledgePanel moduleName="Object Contract"
    index={knowledge} loading={false} error={null} searchQuery=""
    activeCategoryId="all" selectedSectionId={null}
    onCategoryChange={() => {}} onSectionChange={() => {}} onNavigateToSection={() => {}} />,
  async (host, _browser, received) => {
    await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-category-group__header')?.click());
    await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-lessons-heading--toggle')?.click());
    await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-card__trigger')?.click());
    const body = host.querySelector<HTMLElement>('.knowledge-card__body');
    assert.ok(body);
    const button = body.querySelector<HTMLButtonElement>('.ai-topic-action--knowledge');
    assert.ok(button);
    assert.equal(body.firstElementChild, button, 'Ask AI should be the first action before lesson content');
    assert.equal(button.textContent, 'Hỏi AI Support về chủ đề này');
    await act(async () => button.click());
    assert.ok(host.querySelector('.ai-chat__panel'), 'Asking from Knowledge should open AI Support');
    assert.match(host.querySelector('.ai-chat__topic')?.textContent ?? '', /Biến tham chiếu/);
    assert.ok(host.querySelector('.ai-chat__topic-remove'), 'Remove topic must be available before choosing provider');
    assert.deepEqual(received, [{
      kind: 'knowledge', moduleName: 'Object Contract',
      groupTitle: 'Danh tính đối tượng', itemTitle: 'Biến tham chiếu',
    }]);
    assert.doesNotMatch(JSON.stringify(received), /Markdown dài/);
    await act(async () => host.querySelector<HTMLButtonElement>('.ai-chat__topic-remove')?.click());
    assert.equal(host.querySelector('.ai-chat__topic'), null);
    assert.ok(host.querySelector('.ai-chat__panel'), 'Removing a topic must keep popup open');
  });
});

test('Quiz Ask AI action sits after related knowledge and forwards the displayed answer order', async () => {
  await withPanel(() => <QuizPanel moduleName="OOP"
    path="/module/OOP/quiz/vi/index.json" knowledgeIndex={knowledge}
    onNavigateToKnowledge={() => {}} />, async (host, _browser, received) => {
    const card = host.querySelector<HTMLElement>('.quiz-card');
    assert.ok(card);
    const related = card.querySelector('.assessment-related--quiz');
    const button = card.querySelector<HTMLButtonElement>('.ai-topic-action--assessment');
    assert.ok(related && button);
    assert.equal(related.nextElementSibling, button);
    const shownAnswers = [...card.querySelectorAll<HTMLElement>('.quiz-answer__text')]
      .map((element) => element.textContent);
    await act(async () => button.click());
    assert.match(host.querySelector('.ai-chat__topic')?.textContent ?? '', /Nền tảng và tư duy thiết kế OOP/);
    assert.equal(received.length, 1);
    const topic = received[0];
    assert.equal(topic.kind, 'quiz');
    if (topic.kind !== 'quiz') throw Error('Unexpected topic');
    assert.equal(topic.moduleName, 'OOP');
    assert.equal(topic.groupTitle, 'Nền tảng và tư duy thiết kế OOP');
    assert.equal(topic.itemTitle, 'OOP giúp gì?');
    assert.deepEqual(topic.choices.map((choice) => choice.text), shownAnswers);
    assert.equal(topic.choices.find((choice) => choice.label === topic.correctLabel)?.text, 'Câu trả lời đúng');
    assert.doesNotMatch(JSON.stringify(topic), /giải thích/);
  });
});

test('Interview Ask AI action sits after related knowledge without reference answer text', async () => {
  await withPanel(() => <InterviewPanel moduleName="OOP"
    path="/module/OOP/interview/vi/index.json" knowledgeIndex={knowledge}
    onNavigateToKnowledge={() => {}} />, async (host, _browser, received) => {
    const card = host.querySelector<HTMLElement>('.interview-card');
    assert.ok(card);
    const related = card.querySelector('.assessment-related--interview');
    const button = card.querySelector<HTMLButtonElement>('.ai-topic-action--assessment');
    assert.ok(related && button);
    assert.equal(related.nextElementSibling, button);
    await act(async () => button.click());
    assert.match(host.querySelector('.ai-chat__topic')?.textContent ?? '', /OOP giải quyết vấn đề gì/);
    assert.deepEqual(received, [{
      kind: 'interview', moduleName: 'OOP',
      groupTitle: 'Nền tảng và tư duy thiết kế OOP',
      itemTitle: 'OOP giải quyết vấn đề gì?',
    }]);
    assert.doesNotMatch(JSON.stringify(received), /câu trả lời tham khảo/);
  });
});

test('Ask AI remains visible inside native Knowledge fullscreen and can remove its topic', async () => {
  await withPanel(() => <KnowledgePanel moduleName="OOP"
    index={knowledge} loading={false} error={null} searchQuery=""
    activeCategoryId="all" selectedSectionId={null}
    onCategoryChange={() => {}} onSectionChange={() => {}} onNavigateToSection={() => {}} />,
  async (host, browser) => {
    await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-category-group__header')?.click());
    await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-lessons-heading--toggle')?.click());
    await act(async () => host.querySelector<HTMLButtonElement>('.knowledge-card__trigger')?.click());
    const reading = host.querySelector<HTMLElement>('.knowledge-panel');
    assert.ok(reading);
    Object.defineProperty(browser.document, 'fullscreenElement', {
      configurable: true, value: reading,
    });
    await act(async () => browser.document.dispatchEvent(new browser.Event('fullscreenchange')));
    await act(async () => host.querySelector<HTMLButtonElement>('.ai-topic-action--knowledge')?.click());
    assert.ok(reading.querySelector('.ai-chat__panel'),
      'AI popup must be portaled into the browser fullscreen surface');
    assert.ok(reading.querySelector('.ai-chat__topic-remove'));
    await act(async () => reading.querySelector<HTMLButtonElement>('.ai-chat__topic-remove')?.click());
    assert.equal(reading.querySelector('.ai-chat__topic'), null);
    assert.ok(reading.querySelector('.ai-chat__panel'));
    Object.defineProperty(browser.document, 'fullscreenElement', {
      configurable: true, value: null,
    });
    await act(async () => browser.document.dispatchEvent(new browser.Event('fullscreenchange')));
    assert.ok(host.querySelector('.ai-chat__panel'), 'Popup must return to normal layer after exit');
  });
});
