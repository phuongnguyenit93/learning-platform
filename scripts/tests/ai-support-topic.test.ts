import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  formatAiSupportQuestion, quizTopic,
  type AiSupportTopic,
} from '../../src/data/aiSupportTopic';

test('Knowledge AI prompt includes only module, chapter, lesson and user question', () => {
  const topic: AiSupportTopic = {
    kind: 'knowledge',
    moduleName: 'Object Contract',
    groupTitle: 'Danh tính đối tượng',
    itemTitle: 'Biến tham chiếu khác đối tượng',
  };
  const result = formatAiSupportQuestion(topic, 'Cho tôi ví dụ Java', 'vi');
  assert.match(result, /Module: Object Contract/);
  assert.match(result, /Chương: Danh tính đối tượng/);
  assert.match(result, /Bài học: Biến tham chiếu khác đối tượng/);
  assert.match(result, /Câu hỏi của người học:\nCho tôi ví dụ Java/);
  assert.doesNotMatch(result, /markdown|readme|\.md/);
  assert.equal(formatAiSupportQuestion(null, 'Hỏi bình thường', 'vi'), 'Hỏi bình thường');
  assert.match(formatAiSupportQuestion(topic, 'Explain', 'en'), /Chapter: Danh tính đối tượng/);
});

test('Quiz AI context follows shuffled visible choices, not original answer ids, and omits explanations', () => {
  const topic = quizTopic('OOP', 'Nền tảng OOP', 'OOP giúp gì?', [
    { id: 'C', answer: 'Đáp án C gốc', explanation: 'Giải thích không gửi' },
    { id: 'A', answer: 'Đáp án A gốc', explanation: 'Giải thích không gửi' },
    { id: 'D', answer: 'Đáp án D gốc', explanation: 'Giải thích không gửi' },
    { id: 'B', answer: 'Đáp án B gốc', explanation: 'Giải thích không gửi' },
  ], 'A');
  assert.equal(topic.kind, 'quiz');
  if (topic.kind !== 'quiz') throw Error('Unexpected topic type');
  assert.equal(topic.correctLabel, 'B', 'Original answer A is displayed as B');
  assert.deepEqual(topic.choices.map((choice) => choice.text), [
    'Đáp án C gốc', 'Đáp án A gốc', 'Đáp án D gốc', 'Đáp án B gốc',
  ]);
  const prompt = formatAiSupportQuestion(topic, 'Giải thích vì sao?', 'vi');
  assert.match(prompt, /Nhóm Quiz: Nền tảng OOP/);
  assert.match(prompt, /Câu hỏi Quiz: OOP giúp gì\?/);
  assert.match(prompt, /A\. Đáp án C gốc/);
  assert.match(prompt, /B\. Đáp án A gốc/);
  assert.match(prompt, /C\. Đáp án D gốc/);
  assert.match(prompt, /D\. Đáp án B gốc/);
  assert.match(prompt, /Đáp án đúng: B\. Đáp án A gốc/);
  assert.doesNotMatch(prompt, /Giải thích không gửi/);
  assert.throws(() => quizTopic('OOP', 'Quiz', 'Question', [
    { id: 'A', answer: 'only one', explanation: 'x' },
  ], 'A'), /four displayed answers/);
});

test('Interview AI context never includes the reference answer or related Knowledge', () => {
  const topic: AiSupportTopic = {
    kind: 'interview',
    moduleName: 'OOP',
    groupTitle: 'Nền tảng và tư duy thiết kế OOP',
    itemTitle: 'Vì sao OOP xử lý thay đổi tốt?',
  };
  assert.equal(formatAiSupportQuestion(topic, 'Give examples', 'en'), [
    'Study context (reference information only):',
    'Module: OOP',
    'Interview group: Nền tảng và tư duy thiết kế OOP',
    'Interview question: Vì sao OOP xử lý thay đổi tốt?',
    '',
    "Student's question:",
    'Give examples',
  ].join('\n'));
});
