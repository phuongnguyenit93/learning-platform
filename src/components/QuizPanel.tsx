import { useCallback, useEffect, useMemo, useState } from 'react';
import { MermaidMarkdown } from './MermaidMarkdown';
import { buildQuestionKnowledgeResolver, formatKnowledgeDisplayTitle } from '../data/knowledge';
import { loadQuizDocument } from '../data/quiz';
import { QuestionChapterPicker, useQuestionChapterSelection } from './QuestionChapterPicker';
import { fetchJavaAsset } from '../data/javaAsset';
import { useLanguage } from '../state/LanguageContext';
import type {
  KnowledgeIndex,
  KnowledgeSectionRef,
  QuizAnswer,
  QuizAnswerId,
  QuizQuestion,
} from '../types/learning';
import { CustomTooltip } from './CustomTooltip';

interface QuizPanelProps {
  path?: string;
  knowledgeIndex: KnowledgeIndex | null;
}

interface ShuffledQuestion extends Omit<QuizQuestion, 'answers'> {
  answers: QuizAnswer[];
}

type RelatedPanelType = 'knowledge';

const displayLabels = ['A', 'B', 'C', 'D'];

export function QuizPanel({ path, knowledgeIndex }: QuizPanelProps) {
  const { language } = useLanguage();
  const { chapters, selected, selectChapter, mode, loading: indexLoading, error: indexError } =
    useQuestionChapterSelection(path, 'quiz', knowledgeIndex);
  const documentPath = selected?.documentPath;
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, QuizAnswerId>>({});
  const [relatedPanelByQuestion, setRelatedPanelByQuestion] = useState<Record<string, RelatedPanelType>>({});
  const [knowledgeContentCache, setKnowledgeContentCache] = useState<Record<string, string>>({});
  const [knowledgeLoadingPaths, setKnowledgeLoadingPaths] = useState<Set<string>>(() => new Set());
  const [knowledgeErrors, setKnowledgeErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedPath, setLoadedPath] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setKnowledgeContentCache({});
    setKnowledgeLoadingPaths(new Set());
    setKnowledgeErrors({});
    setError(null);
    setQuestions([]);
    setSelectedAnswers({});
    setRelatedPanelByQuestion({});
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
        setRelatedPanelByQuestion((current) => Object.fromEntries(
          Object.entries(current).filter(([questionId]) => validQuestions.has(questionId)),
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

  const resolveRelatedKnowledge = useMemo(
    () => buildQuestionKnowledgeResolver(knowledgeIndex, selected?.path.split('/')[1] ?? selected?.id),
    [knowledgeIndex, selected?.id, selected?.path],
  );

  const ensureKnowledgeContent = useCallback((section: KnowledgeSectionRef) => {
    if (
      knowledgeContentCache[section.content] !== undefined
      || knowledgeLoadingPaths.has(section.content)
    ) {
      return;
    }

    setKnowledgeErrors((current) => {
      if (current[section.content] === undefined) {
        return current;
      }

      const next = { ...current };
      delete next[section.content];
      return next;
    });
    setKnowledgeLoadingPaths((current) => new Set(current).add(section.content));

    fetchJavaAsset(section.content)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load Knowledge: ${response.status} ${response.statusText}`);
        }

        return response.text();
      })
      .then((markdown) => {
        setKnowledgeContentCache((current) => ({ ...current, [section.content]: markdown }));
      })
      .catch((caught: unknown) => {
        setKnowledgeErrors((current) => ({
          ...current,
          [section.content]: caught instanceof Error ? caught.message : 'Unable to load Knowledge.',
        }));
      })
      .finally(() => {
        setKnowledgeLoadingPaths((current) => {
          const next = new Set(current);
          next.delete(section.content);
          return next;
        });
      });
  }, [knowledgeContentCache, knowledgeLoadingPaths]);

  useEffect(() => {
    questions.forEach((question) => {
      if (relatedPanelByQuestion[question.id] !== 'knowledge') {
        return;
      }

      const relatedKnowledge = resolveRelatedKnowledge(question.readmeRelated);

      if (relatedKnowledge) {
        ensureKnowledgeContent(relatedKnowledge);
      }
    });
  }, [ensureKnowledgeContent, resolveRelatedKnowledge, questions, relatedPanelByQuestion]);

  const openRelatedKnowledge = (questionId: string, section: KnowledgeSectionRef) => {
    setRelatedPanelByQuestion((current) => ({ ...current, [questionId]: 'knowledge' }));
    ensureKnowledgeContent(section);
  };

  const closeRelatedPanel = (questionId: string) => {
    setRelatedPanelByQuestion((current) => {
      if (current[questionId] === undefined) {
        return current;
      }

      const next = { ...current };
      delete next[questionId];
      return next;
    });
  };

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
        const relatedKnowledge = resolveRelatedKnowledge(question.readmeRelated);
        const activeRelatedPanel = relatedPanelByQuestion[question.id];
        const knowledgeMarkdown = relatedKnowledge
          ? knowledgeContentCache[relatedKnowledge.content]
          : undefined;
        const knowledgeLoading = relatedKnowledge
          ? knowledgeLoadingPaths.has(relatedKnowledge.content)
          : false;
        const knowledgeError = relatedKnowledge
          ? knowledgeErrors[relatedKnowledge.content]
          : undefined;
        const activeRelatedKnowledge = activeRelatedPanel === 'knowledge' ? relatedKnowledge : undefined;
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
              <>
                <div className={`quiz-explanation ${selectedIsCorrect ? 'is-correct' : 'is-incorrect'}`}>
                  <div className="quiz-explanation__heading">
                    <strong>
                      {selectedIsCorrect
                        ? language === 'vi' ? 'Chính xác' : 'Correct'
                        : language === 'vi' ? 'Chưa chính xác' : 'Incorrect'}
                    </strong>
                  </div>
                  <p>{selectedAnswer.explanation}</p>

                  {selectedIsCorrect && relatedKnowledge && (
                    <div className="quiz-related-actions">
                      {relatedKnowledge && (
                        <button
                          type="button"
                          className={`quiz-related-action quiz-related-action--knowledge${activeRelatedPanel === 'knowledge' ? ' is-active' : ''}`}
                          onClick={() => openRelatedKnowledge(question.id, relatedKnowledge)}
                        >
                          Related Knowledge
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {selectedIsCorrect && activeRelatedKnowledge && (
                  <div className="quiz-related-panel">
                    <button
                      type="button"
                      className="quiz-related-panel__close"
                      aria-label={language === 'vi' ? 'Đóng nội dung liên quan' : 'Close related content'}
                      title={language === 'vi' ? 'Đóng' : 'Close'}
                      onClick={() => closeRelatedPanel(question.id)}
                    >
                      ×
                    </button>
                    {activeRelatedKnowledge ? (
                      <>
                        <div className="quiz-related-panel__header">
                          <div>
                            <span>{language === 'vi' ? 'Kiến thức liên quan' : 'Related Knowledge'}</span>
                            <strong>{formatKnowledgeDisplayTitle(activeRelatedKnowledge.title)}</strong>
                            <small>{activeRelatedKnowledge.categoryTitle}</small>
                          </div>
                        </div>

                        <div className="quiz-related-panel__content markdown-content">
                          {knowledgeLoading && (
                            <div className="knowledge-section-status">
                              {language === 'vi' ? 'Đang tải nội dung...' : 'Loading content...'}
                            </div>
                          )}
                          {!knowledgeLoading && knowledgeError && (
                            <div className="knowledge-section-status knowledge-section-status--error">
                              {knowledgeError}
                            </div>
                          )}
                          {!knowledgeLoading && !knowledgeError && knowledgeMarkdown !== undefined && (
                            <MermaidMarkdown>{knowledgeMarkdown}</MermaidMarkdown>
                          )}
                        </div>
                      </>
                    ) : null}
                  </div>
                )}
              </>
            )}
          </article>
        );
      })}
    </section>
      )}
    </div>
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
