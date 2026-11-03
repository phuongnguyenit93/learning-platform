import { useCallback, useEffect, useMemo, useState } from 'react';
import { MermaidMarkdown } from './MermaidMarkdown';
import { loadInterviewDocument } from '../data/interview';
import { QuestionChapterPicker, useQuestionChapterSelection } from './QuestionChapterPicker';
import { QuestionReadingFrame } from './ReadingFullscreen';
import { fetchJavaAsset } from '../data/javaAsset';
import { buildQuestionKnowledgeResolver, formatKnowledgeDisplayTitle } from '../data/knowledge';
import { useLanguage } from '../state/LanguageContext';
import type {
  InterviewQuestion,
  KnowledgeIndex,
  KnowledgeSectionRef,
} from '../types/learning';
import { CustomTooltip } from './CustomTooltip';

interface InterviewPanelProps {
  path?: string;
  knowledgeIndex: KnowledgeIndex | null;
}

type RelatedPanelType = 'knowledge';

export function InterviewPanel({ path, knowledgeIndex }: InterviewPanelProps) {
  const { language } = useLanguage();
  const { chapters, selected, selectChapter, mode, loading: indexLoading, error: indexError } =
    useQuestionChapterSelection(path, 'interview', knowledgeIndex);
  const documentPath = selected?.documentPath;
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [expandedAnswers, setExpandedAnswers] = useState<Set<number>>(() => new Set());
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
    setExpandedAnswers(new Set());
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

    loadInterviewDocument(documentPath)
      .then((document) => {
        if (!active) {
          return;
        }

        setQuestions(document.questions);
        setExpandedAnswers((current) => new Set(
          [...current].filter((index) => index < document.questions.length),
        ));
        setRelatedPanelByQuestion((current) => Object.fromEntries(
          Object.entries(current).filter(([questionKey]) => {
            const index = Number(questionKey);
            return Number.isInteger(index) && index >= 0 && index < document.questions.length;
          }),
        ));
        setLoadedPath(documentPath);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (!active) {
          return;
        }

        setQuestions([]);
        setError(caught instanceof Error ? caught.message : 'Unable to load Interview.');
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
    questions.forEach((question, index) => {
      const questionKey = String(index);
      if (relatedPanelByQuestion[questionKey] !== 'knowledge') {
        return;
      }

      const relatedKnowledge = resolveRelatedKnowledge(question.readmeRelated);

      if (relatedKnowledge) {
        ensureKnowledgeContent(relatedKnowledge);
      }
    });
  }, [ensureKnowledgeContent, resolveRelatedKnowledge, questions, relatedPanelByQuestion]);

  const openRelatedKnowledge = (questionKey: string, section: KnowledgeSectionRef) => {
    setRelatedPanelByQuestion((current) => ({ ...current, [questionKey]: 'knowledge' }));
    ensureKnowledgeContent(section);
  };

  const closeRelatedPanel = (questionKey: string) => {
    setRelatedPanelByQuestion((current) => {
      if (current[questionKey] === undefined) {
        return current;
      }

      const next = { ...current };
      delete next[questionKey];
      return next;
    });
  };

  if (indexLoading) {
    return (
      <div className="empty-state">
        <strong>{language === 'vi' ? 'Đang tải danh sách chương Interview...' : 'Loading Interview chapters...'}</strong>
      </div>
    );
  }

  if (indexError) {
    return (
      <div className="empty-state">
        <strong>{language === 'vi' ? 'Không thể tải Interview' : 'Unable to load Interview'}</strong>
        <span>{indexError}</span>
      </div>
    );
  }

  if (chapters.length === 0) {
    return <EmptyInterview />;
  }

  return (
    <QuestionReadingFrame>
    <div className="question-chapter-content">
      <QuestionChapterPicker kind="interview" chapters={chapters} mode={mode} selectedId={selected?.id ?? null} onSelect={selectChapter} />
      {(loading || loadedPath !== documentPath) ? (
        <div className="empty-state">
          <strong>{language === 'vi' ? 'Đang tải Interview...' : 'Loading Interview...'}</strong>
        </div>
      ) : error ? (
        <div className="empty-state">
          <strong>{language === 'vi' ? 'Không thể tải Interview' : 'Unable to load Interview'}</strong>
          <span>{error}</span>
        </div>
      ) : questions.length === 0 ? <EmptyInterview /> : (
    <section className="interview-list">
      {questions.map((question, index) => {
        const expanded = expandedAnswers.has(index);
        const questionKey = String(index);
        const relatedKnowledge = resolveRelatedKnowledge(question.readmeRelated);
        const activeRelatedPanel = relatedPanelByQuestion[questionKey];
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
          <article key={questionKey} className="interview-card">
            <div className="interview-card__topline">
              <span className="interview-card__number">
                {language === 'vi' ? 'Câu' : 'Question'} {index + 1}
              </span>

            </div>

            <h3>{question.question}</h3>

            <button
              type="button"
              className={`interview-answer-toggle${expanded ? ' is-open' : ''}`}
              aria-expanded={expanded}
              onClick={() => {
                setExpandedAnswers((current) => {
                  const next = new Set(current);
                  if (next.has(index)) {
                    next.delete(index);
                  } else {
                    next.add(index);
                  }
                  return next;
                });
              }}
            >
              <span>{language === 'vi' ? 'Câu trả lời tham khảo' : 'Reference Answer'}</span>
              <span aria-hidden="true">{expanded ? '−' : '+'}</span>
            </button>

            {expanded && (
              <>
                <div className="interview-answer">
                  <div className="markdown-content"><MermaidMarkdown>{question.answer}</MermaidMarkdown></div>

                  {relatedKnowledge && (
                    <div className="quiz-related-actions">
                      {relatedKnowledge && (
                        <button
                          type="button"
                          className={`quiz-related-action quiz-related-action--knowledge${activeRelatedPanel === 'knowledge' ? ' is-active' : ''}`}
                          onClick={() => openRelatedKnowledge(questionKey, relatedKnowledge)}
                        >
                          Related Knowledge
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {activeRelatedKnowledge && (
                  <div className="quiz-related-panel">
                    <button
                      type="button"
                      className="quiz-related-panel__close"
                      aria-label={language === 'vi' ? 'Đóng nội dung liên quan' : 'Close related content'}
                      title={language === 'vi' ? 'Đóng' : 'Close'}
                      onClick={() => closeRelatedPanel(questionKey)}
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
    </QuestionReadingFrame>
  );
}

function EmptyInterview() {
  const { language } = useLanguage();
  return (
    <div className="empty-state empty-state--large">
      <span className="empty-state__icon" aria-hidden="true">?</span>
      <strong>{language === 'vi' ? 'Interview chưa có nội dung' : 'Interview content is not available yet'}</strong>
      <span>
        {language === 'vi'
          ? 'Module này chưa có câu hỏi Interview cho ngôn ngữ hiện tại.'
          : 'This module does not have Interview questions for the current language yet.'}
      </span>
    </div>
  );
}
