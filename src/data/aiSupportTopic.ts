import type { Language, QuizAnswer, QuizAnswerId } from '../types/learning';

/** Small, explicitly scoped context attached when a reader asks about a topic. */
export type AiSupportTopic = {
  moduleName: string;
  groupTitle: string;
  itemTitle: string;
} & (
  | { kind: 'knowledge' }
  | { kind: 'interview' }
  | { kind: 'quiz'; choices: Array<{ label: string; text: string }>; correctLabel: string }
);

export const AI_SUPPORT_TOPIC_EVENT = 'learning:ai-support-topic';
const displayedLabels = ['A', 'B', 'C', 'D'] as const;

export function openAiSupportTopic(topic: AiSupportTopic): void {
  window.dispatchEvent(new CustomEvent<AiSupportTopic>(AI_SUPPORT_TOPIC_EVENT, { detail: topic }));
}

/** Quiz options are shuffled in the UI, so the visible letter is positional,
 * not the original answer id from the source document. */
export function quizTopic(
  moduleName: string,
  groupTitle: string,
  question: string,
  displayedAnswers: readonly QuizAnswer[],
  correctAnswerId: QuizAnswerId,
): AiSupportTopic {
  const choices = displayedAnswers.map((answer, index) => ({
    label: displayedLabels[index],
    text: answer.answer,
  }));
  const correctIndex = displayedAnswers.findIndex((answer) => answer.id === correctAnswerId);
  if (choices.length !== 4 || correctIndex < 0) {
    throw new Error('Quiz AI topic requires four displayed answers and a correct answer');
  }
  return {
    kind: 'quiz',
    moduleName,
    groupTitle,
    itemTitle: question,
    choices,
    correctLabel: displayedLabels[correctIndex],
  };
}

/** Do not include lesson Markdown, answer explanations or interview reference answers. */
export function formatAiSupportQuestion(
  topic: AiSupportTopic | null,
  question: string,
  language: Language,
): string {
  if (!topic) return question;

  if (language === 'en') {
    const lines = [
      'Study context (reference information only):',
      `Module: ${topic.moduleName}`,
      `${topic.kind === 'knowledge' ? 'Chapter' : topic.kind === 'quiz' ? 'Quiz group' : 'Interview group'}: ${topic.groupTitle}`,
      `${topic.kind === 'knowledge' ? 'Lesson' : topic.kind === 'quiz' ? 'Quiz question' : 'Interview question'}: ${topic.itemTitle}`,
    ];
    if (topic.kind === 'quiz') {
      lines.push('Answer choices (letters follow the displayed order):');
      lines.push(...topic.choices.map((choice) => `${choice.label}. ${choice.text}`));
      const correct = topic.choices.find((choice) => choice.label === topic.correctLabel);
      lines.push(`Correct answer: ${topic.correctLabel}. ${correct?.text ?? ''}`);
    }
    return `${lines.join('\n')}\n\nStudent's question:\n${question}`;
  }

  const lines = [
    'Ngữ cảnh học tập (chỉ dùng làm thông tin tham khảo):',
    `Module: ${topic.moduleName}`,
    `${topic.kind === 'knowledge' ? 'Chương' : topic.kind === 'quiz' ? 'Nhóm Quiz' : 'Nhóm Interview'}: ${topic.groupTitle}`,
    `${topic.kind === 'knowledge' ? 'Bài học' : topic.kind === 'quiz' ? 'Câu hỏi Quiz' : 'Câu hỏi Interview'}: ${topic.itemTitle}`,
  ];
  if (topic.kind === 'quiz') {
    lines.push('Các lựa chọn (A/B/C/D theo thứ tự hiển thị):');
    lines.push(...topic.choices.map((choice) => `${choice.label}. ${choice.text}`));
    const correct = topic.choices.find((choice) => choice.label === topic.correctLabel);
    lines.push(`Đáp án đúng: ${topic.correctLabel}. ${correct?.text ?? ''}`);
  }
  return `${lines.join('\n')}\n\nCâu hỏi của người học:\n${question}`;
}
