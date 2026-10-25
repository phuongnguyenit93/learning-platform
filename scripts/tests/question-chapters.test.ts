import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildQuestionKnowledgeResolver } from '../../src/data/knowledge';
import {
  loadQuestionChapterIndex, parseQuestionChapterIndex,
  questionIndexPath, resolveQuestionChapterPath, sortQuestionChapters,
} from '../../src/data/questionChapters';
import type { KnowledgeIndex } from '../../src/types/learning';

const quizIndexPath = '/module/ASPECT/quiz/vi/index.json';
const interviewIndexPath = '/module/ASPECT/interview/en/index.json';
const chapters = [
  { id: '2.Second', title: 'Second', questionCount: 0, path: 'menu/2.Second/question.yml' },
  { id: '1.First', title: 'First', questionCount: 2, path: 'menu/1.First/question.yml' },
];

const knowledge: KnowledgeIndex = {
  version: 1, language: 'vi', moduleId: 'ASPECT', categoryCount: 2, sectionCount: 2,
  tree: [
    { kind: 'FOLDER', id: '1.First', title: 'First', children: [
      { kind: 'CATEGORY', id: 'first', title: 'Topic', sourcePath: 'menu/1.First/topic.md',
        sections: [{ id: 'shared-anchor', title: 'First item', content: '/first.md', difficulty: 'BASIC', }] },
    ] },
    { kind: 'FOLDER', id: '2.Second', title: 'Second', children: [
      { kind: 'CATEGORY', id: 'second', title: 'Topic', sourcePath: 'menu/2.Second/topic.md',
        sections: [{ id: 'shared-anchor', title: 'Second item', content: '/second.md', difficulty: 'BASIC', }] },
    ] },
  ],
};

test('chapter index and paths resolve from both new and legacy module catalog paths', () => {
  assert.equal(questionIndexPath('/module/ASPECT/quiz/vi/question.yml', 'quiz'), quizIndexPath);
  assert.equal(questionIndexPath(interviewIndexPath, 'interview'), interviewIndexPath);
  assert.equal(resolveQuestionChapterPath(quizIndexPath, 'menu/1.First/question.yml'),
    '/module/ASPECT/quiz/vi/menu/1.First/question.yml');
  const parsed = parseQuestionChapterIndex({ chapters, totalQuestions: 2 }, quizIndexPath);
  assert.equal(parsed.totalQuestions, 2);
  assert.deepEqual(sortQuestionChapters(parsed.chapters, knowledge).map((chapter) => chapter.id),
    ['1.First', '2.Second']);
});

test('malformed counts, duplicate ids and unsafe chapter paths are rejected', () => {
  assert.throws(() => parseQuestionChapterIndex({ chapters, totalQuestions: 3 }, quizIndexPath), /totalQuestions/);
  assert.throws(() => parseQuestionChapterIndex({ chapters: [chapters[0], chapters[0]], totalQuestions: 0 }, quizIndexPath), /unique/);
  for (const path of ['../other.yml', 'menu/../question.yml', 'menu/first/../../secret', '/module/OTHER/question.yml', 'https://evil.test/file.yml']) {
    assert.throws(() => resolveQuestionChapterPath(quizIndexPath, path), /Invalid question chapter path/);
  }
});

test('anchor-only Knowledge references are scoped to chapter; legacy file references remain global', () => {
  const firstChapter = buildQuestionKnowledgeResolver(knowledge, '1.First');
  assert.equal(firstChapter({ file: '', anchor: 'shared-anchor' })?.content, '/first.md');
  assert.equal(firstChapter({ file: 'menu/2.Second/topic.md', anchor: 'shared-anchor' })?.content, '/second.md');
  assert.equal(buildQuestionKnowledgeResolver(knowledge)({ file: '', anchor: 'shared-anchor' }), undefined);
});

test('chapter loader fetches index JSON and never eagerly requests chapter YAML', async () => {
  const requests: string[] = [];
  const original = globalThis.fetch;
  globalThis.fetch = (async (url: URL | RequestInfo) => {
    requests.push(String(url));
    return new Response(JSON.stringify({ chapters, totalQuestions: 2 }), { status: 200 });
  }) as typeof fetch;
  try {
    const index = await loadQuestionChapterIndex('/module/ASPECT/quiz/vi/question.yml', 'quiz');
    assert.equal(index.chapters.length, 2);
    assert.deepEqual(requests, ['/language/java/module/ASPECT/quiz/vi/index.json']);
  } finally {
    globalThis.fetch = original;
  }
});
