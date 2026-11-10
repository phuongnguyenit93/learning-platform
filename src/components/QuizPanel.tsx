import { useEffect, useState } from 'react';
import { loadQuizDocument } from '../data/quiz';
import { QuestionChapterPicker, useQuestionChapterSelection } from './QuestionChapterPicker';
import { useLanguage } from '../state/LanguageContext';
import type {
  KnowledgeIndex,
  KnowledgeSectionRef,
  QuizAnswer,
  QuizAnswerId,
  QuizQuestion,
} from '../types/learning';
import { QuestionReadingFrame } from './ReadingFullscreen';
import { RelatedKnowledgeList } from './RelatedKnowledgeList';
import { openAiSupportTopic, quizTopic } from '../data/aiSupportTopic';

interface QuizPanelProps {
  moduleName?: string;
  path?: string;
  knowledgeIndex: KnowledgeIndex | null;
  onNavigateToKnowledge: (section: KnowledgeSectionRef, origin: HTMLButtonElement) => void;
}

interface ShuffledQuestion extends Omit<QuizQuestion, 'answers'> {
  answers: QuizAnswer[];
}

const displayLabels = ['A', 'B', 'C', 'D'];

export function QuizPanel({ path, knowledgeIndex, onNavigateToKnowledge, moduleName = '' }: QuizPanelProps) {
  const { language } = useLanguage();
  const { chapters, selected, selectChapter, mode, loading: indexLoading, error: indexError } =
    useQuestionChapterSelection(path, 'quiz', knowledgeIndex);
  const documentPath = selected?.documentPath;
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, QuizAnswerId>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedPath, setLoadedPath] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setError(null);
    setQuestions([]);
    setSelectedAnswers({});
    setLoadedPath(null);

    if (!documentPath || selected?.questionCount === 0) {
      setLoading(false);
      setLoadedPath(documentPath ?? null);
      return () => {
        active = false;
      };
    }

    setLoading(true);

    loadQuizDocument(documentPath)
      .then((document) => {
        if (!active) {
          return;
        }

        setQuestions((current) => {
          const previousAnswerOrder = new Map(
            current.map((question) => [question.id, question.answers.map((answer) => answer.id)]),
          );

          return document.questions.map((question) => ({
            ...question,
            answers: orderAnswers(
              question.answers,
              previousAnswerOrder.get(question.id),
            ),
          }));
        });

        const validQuestions = new Map(
          document.questions.map((question) => [
            question.id,
            new Set(question.answers.map((answer) => answer.id)),
          ]),
        );
        setSelectedAnswers((current) => Object.fromEntries(
          Object.entries(current).filter(([questionId, answerId]) => (
            validQuestions.get(questionId)?.has(answerId) ?? false
          )),
        ));
        setLoadedPath(documentPath);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (!active) {
          return;
        }

        setQuestions([]);
        setError(caught instanceof Error ? caught.message : 'Unable to load Quiz.');
        setLoadedPath(documentPath);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [documentPath, selected?.questionCount]);

  if (indexLoading) {
    return (
      <div className="empty-state">
        <strong>{language === 'vi' ? 'Đang tải danh sách chương Quiz...' : 'Loading Quiz chapters...'}</strong>
      </div>
    );
  }

  if (indexError) {
    return (
      <div className="empty-state">
        <strong>{language === 'vi' ? 'Không thể tải Quiz' : 'Unable to load Quiz'}</strong>
        <span>{indexError}</span>
      </div>
    );
  }

  if (chapters.length === 0) {
    return <EmptyQuiz />;
  }

  return (
    <QuestionReadingFrame>
    <div className="question-chapter-content">
      <QuestionChapterPicker kind="quiz" chapters={chapters} mode={mode} selectedId={selected?.id ?? null} onSelect={selectChapter} />
      {(loading || loadedPath !== documentPath) ? (
        <div className="empty-state">
          <strong>{language === 'vi' ? 'Đang tải Quiz...' : 'Loading Quiz...'}</strong>
        </div>
      ) : error ? (
        <div className="empty-state">
          <strong>{language === 'vi' ? 'Không thể tải Quiz' : 'Unable to load Quiz'}</strong>
          <span>{error}</span>
        </div>
      ) : questions.length === 0 ? <EmptyQuiz /> : (
    <section className="quiz-grid">
      {questions.map((question, index) => {
        const selectedId = selectedAnswers[question.id];
        const selectedAnswer = question.answers.find((answer) => answer.id === selectedId);
        const selectedIsCorrect = selectedId === question.correctAnswerId;
        return (
          <article key={question.id} className="quiz-card">
            <div className="quiz-card__topline">
              <span className="quiz-card__number">
                {language === 'vi' ? 'Câu' : 'Question'} {index + 1}
              </span>
            </div>
            <h3>{question.question}</h3>

            <div className="quiz-card__answers">
              {question.answers.map((answer, answerIndex) => {
                const isSelected = selectedId === answer.id;
                const isCorrect = answer.id === question.correctAnswerId;
                const stateClass = selectedId
                  ? isCorrect
                    ? ' is-correct'
                    : isSelected
                      ? ' is-incorrect'
                      : ''
                  : '';

                return (
                  <button
                    key={`${question.id}-${answer.id}`}
                    type="button"
                    className={`quiz-answer${isSelected ? ' is-selected' : ''}${stateClass}`}
                    onClick={() => {
                      setSelectedAnswers((current) => ({
                        ...current,
                        [question.id]: answer.id,
                      }));
                    }}
                  >
                    <span>{displayLabels[answerIndex]}</span>
                    <span className="quiz-answer__text">{answer.answer}</span>
                  </button>
                );
              })}
            </div>

            {selectedAnswer && (
                <div className={`quiz-explanation ${selectedIsCorrect ? 'is-correct' : 'is-incorrect'}`}>
                  <div className="quiz-explanation__heading">
                    <strong>
                      {selectedIsCorrect
                        ? language === 'vi' ? 'Chính xác' : 'Correct'
                        : language === 'vi' ? 'Chưa chính xác' : 'Incorrect'}
                    </strong>
                  </div>
                  <p>{selectedAnswer.explanation}</p>

                </div>
            )}
            <details className="assessment-related assessment-related--quiz">
              <summary>{language === 'vi' ? 'Kiến thức liên quan' : 'Related knowledge'}</summary>
              <RelatedKnowledgeList related={question.readmeRelated} knowledgeIndex={knowledgeIndex}
                onNavigateToKnowledge={onNavigateToKnowledge} />
            </details>
            <button type="button" className="ai-topic-action ai-topic-action--assessment"
              onClick={() => openAiSupportTopic(quizTopic(
                moduleName || knowledgeIndex?.moduleId || '',
                selected?.title ?? '',
                question.question,
                question.answers,
                question.correctAnswerId,
              ))}>
              {language === 'vi' ? 'Hỏi AI Support về chủ đề này' : 'Ask AI Support about this topic'}
            </button>
          </article>
        );
      })}
    </section>
      )}
    </div>
    </QuestionReadingFrame>
  );
}

function EmptyQuiz() {
  const { language } = useLanguage();

  return (
    <div className="empty-state">
      <strong>{language === 'vi' ? 'Quiz chưa có dữ liệu' : 'No quiz data yet'}</strong>
      <span>
        {language === 'vi'
          ? 'Module này chưa có câu hỏi Quiz cho ngôn ngữ hiện tại.'
          : 'This module does not have Quiz questions for the current language yet.'}
      </span>
    </div>
  );
}

function shuffleAnswers(answers: QuizAnswer[]): QuizAnswer[] {
  const result = [...answers];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }

  return result;
}

function orderAnswers(answers: QuizAnswer[], previousOrder?: QuizAnswerId[]): QuizAnswer[] {
  if (!previousOrder || previousOrder.length === 0) {
    return shuffleAnswers(answers);
  }

  const orderById = new Map(previousOrder.map((answerId, index) => [answerId, index]));
  return [...answers].sort((left, right) => (
    (orderById.get(left.id) ?? Number.MAX_SAFE_INTEGER)
    - (orderById.get(right.id) ?? Number.MAX_SAFE_INTEGER)
  ));
}
