import { useEffect, useState } from 'react';
import { MermaidMarkdown } from './MermaidMarkdown';
import { loadInterviewDocument } from '../data/interview';
import { QuestionChapterPicker, useQuestionChapterSelection } from './QuestionChapterPicker';
import { QuestionReadingFrame } from './ReadingFullscreen';
import { RelatedKnowledgeList } from './RelatedKnowledgeList';
import { useLanguage } from '../state/LanguageContext';
import { openAiSupportTopic } from '../data/aiSupportTopic';
import type {
  InterviewQuestion,
  KnowledgeIndex,
  KnowledgeSectionRef,
} from '../types/learning';

interface InterviewPanelProps {
  moduleName?: string;
  path?: string;
  knowledgeIndex: KnowledgeIndex | null;
  onNavigateToKnowledge: (section: KnowledgeSectionRef, origin: HTMLButtonElement) => void;
}

export function InterviewPanel({ path, knowledgeIndex, onNavigateToKnowledge, moduleName = '' }: InterviewPanelProps) {
  const { language } = useLanguage();
  const { chapters, selected, selectChapter, mode, loading: indexLoading, error: indexError } =
    useQuestionChapterSelection(path, 'interview', knowledgeIndex);
  const documentPath = selected?.documentPath;
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [expandedAnswers, setExpandedAnswers] = useState<Set<number>>(() => new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedPath, setLoadedPath] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setError(null);
    setQuestions([]);
    setExpandedAnswers(new Set());
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
              <div className="interview-answer">
                <div className="markdown-content"><MermaidMarkdown>{question.answer}</MermaidMarkdown></div>
              </div>
            )}
            <details className="assessment-related assessment-related--interview">
              <summary>{language === 'vi' ? 'Kiến thức liên quan' : 'Related knowledge'}</summary>
              <RelatedKnowledgeList related={question.readmeRelated} knowledgeIndex={knowledgeIndex}
                onNavigateToKnowledge={onNavigateToKnowledge} />
            </details>
            <button type="button" className="ai-topic-action ai-topic-action--assessment"
              onClick={() => openAiSupportTopic({
                kind: 'interview',
                moduleName: moduleName || knowledgeIndex?.moduleId || '',
                groupTitle: selected?.title ?? '',
                itemTitle: question.question,
              })}>
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
