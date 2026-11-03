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
  assert.deepEqual(document.questions[0].readmeRelated, {
    file: '', anchor: '', anchorList: ['oop-basic-001', 'oop-basic-006'],
  });
  assert.equal('apiRelated' in document.questions[0], false);
});

test('Interview module group preserves authored Markdown answers and Knowledge links', async () => {
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
  assert.deepEqual(document.questions[0].readmeRelated, {
    file: '', anchor: '', anchorList: ['class-design-001'],
  });
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
  assert.deepEqual(cases[0].readmeRelated, { file: '', anchor: '', anchorList: ['solid-002'] });
  assert.throws(() => parseCaseStudyDocument({ cases: [{ situation: 'Only situation' }] }), /resolve/);
});

test('Case Study explanation parses authored scenarios without inventing status or response', () => {
  const base = { situation: 'Scenario', resolve: 'Hint', knowledge: 'Fact', code: 'class Demo {}' };
  const [item] = parseCaseStudyDocument({ cases: [{
    ...base,
    codeExplanation: {
      howItWorksHtml: '<p>Runs the method</p>',
      situations: [
        { id: 'ok', title: 'Valid input', description: '<p>Passes validation</p>',
          input: { key: 'value' }, status: null, response: null,
          observations: [{ type: 'APPLICATION', source: 'service',
            expect: { keyword: ['validation'], results: { processed: true }, conclusion: 'Passed' } }] },
        { id: 'second', title: 'Second', detailDescription: '<strong>Details</strong>', status: 0 },
        { id: 'empty', title: 'No content', description: '  ', observations: [{}] },
        { id: 'missing-title', title: ' ', description: 'ignored' },
        { id: 'ok', title: 'Duplicate', description: 'ignored' },
      ],
    },
  }] });
  assert.equal(item.codeExplanation?.howItWorksHtml, '<p>Runs the method</p>');
  assert.deepEqual(item.codeExplanation?.situations?.map((scenario) => scenario.id), ['ok', 'second']);
  assert.deepEqual(item.codeExplanation?.situations?.[0].input, { key: 'value' });
  assert.equal(item.codeExplanation?.situations?.[0].status, undefined);
  assert.equal(item.codeExplanation?.situations?.[0].response, undefined);
  assert.deepEqual(item.codeExplanation?.situations?.[0].observations?.[0].expect?.results, { processed: true });
  assert.equal(item.codeExplanation?.situations?.[1].status, 0);
});

test('Case Study explanation is omitted for empty/placeholder parts and keeps independent children', () => {
  const base = { situation: 'Scenario', resolve: 'Hint', knowledge: 'Fact', code: 'class Demo {}' };
  const cases = parseCaseStudyDocument({ cases: [
    { ...base },
    { ...base, codeExplanation: { howItWorksHtml: '<p> &nbsp; </p>', situations: [] } },
    { ...base, codeExplanation: { howItWorksHtml: 'TODO', situations: [{ id: 'x', title: 'x' }] } },
    { ...base, codeExplanation: { howItWorksHtml: '<p>Executable explanation</p>' } },
    { ...base, codeExplanation: { situations: [{ id: 'y', title: 'Observations only',
      observations: [{ expect: { conclusion: 'Detected by authored log' } }] }] } },
  ] });
  assert.equal(cases[0].codeExplanation, undefined);
  assert.equal(cases[1].codeExplanation, undefined);
  assert.equal(cases[2].codeExplanation, undefined);
  assert.deepEqual(cases[3].codeExplanation, { howItWorksHtml: '<p>Executable explanation</p>' });
  assert.equal(cases[4].codeExplanation?.howItWorksHtml, undefined);
  assert.equal(cases[4].codeExplanation?.situations?.length, 1);
});
