import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadQuizDocument } from '../../src/data/quiz';
import { loadInterviewDocument } from '../../src/data/interview';
import { loadCaseStudyDocument, parseCaseStudyDocument } from '../../src/data/casestudy';

async function withYamlResponse<T>(content: string, action: () => Promise<T>): Promise<T> {
  const original = globalThis.fetch;
  globalThis.fetch = (async () => new Response(content, { status: 200 })) as typeof fetch;
  try {
    return await action();
  } finally {
    globalThis.fetch = original;
  }
}

test('Quiz module group generates stable question IDs and keeps correct-answer explanations', async () => {
  const path = '/module/OBJECT_ORIENTED_PROGRAMMING/quiz/vi/groups/2.yml';
  const yaml = `questions:
  - question: What is OOP?
    readmeRelated:
      anchorList: [oop-basic-001, oop-basic-006]
    answers:
      - { id: A, answer: First, explanation: First reason }
      - { id: B, answer: Second, explanation: Second reason }
      - { id: C, answer: Third, explanation: Third reason }
      - { id: D, answer: Fourth, explanation: Fourth reason }
    correctAnswerId: B
`;
  const document = await withYamlResponse(yaml, () => loadQuizDocument(path));
  assert.equal(document.questions.length, 1);
  assert.equal(document.questions[0].id, `${path}#1`);
  assert.equal(document.questions[0].correctAnswerId, 'B');
  assert.equal(document.questions[0].answers[1].explanation, 'Second reason');
  assert.deepEqual(document.questions[0].readmeRelated, { file: '', anchor: '' });
  assert.deepEqual(document.questions[0].apiRelated, { controller: '', methodSignature: '' });
});

test('Interview module group reads long authored Markdown answers without invented relations', async () => {
  const yaml = `questions:
  - question: Why?
    answer: |
      **Responsibility**

      - Encapsulation
      - Polymorphism
    readmeRelated:
      anchorList: [class-design-001]
    knowledge: OOP
`;
  const document = await withYamlResponse(yaml,
    () => loadInterviewDocument('/module/OBJECT_ORIENTED_PROGRAMMING/interview/vi/groups/1.yml'));
  assert.equal(document.questions.length, 1);
  assert.match(document.questions[0].answer, /\*\*Responsibility\*\*/);
  assert.deepEqual(document.questions[0].readmeRelated, { file: '', anchor: '' });
});

test('Case Study group preserves situation, resolution, knowledge and multiline source code', async () => {
  const yaml = `cases:
  - situation: Legacy manager owns billing and schedules
    resolve: Split responsibilities
    knowledge: SRP
    readmeRelated:
      anchorList: [solid-002]
    code: |
      ~~~java
      class Billing {}
      ~~~
`;
  const cases = await withYamlResponse(yaml,
    () => loadCaseStudyDocument('/module/OBJECT_ORIENTED_PROGRAMMING/casestudy/vi/groups/1.yml'));
  assert.equal(cases.length, 1);
  assert.equal(cases[0].resolve, 'Split responsibilities');
  assert.match(cases[0].code, /class Billing/);
  assert.throws(() => parseCaseStudyDocument({ cases: [{ situation: 'Only situation' }] }), /resolve/);
});
