import { useEffect, useMemo, useState } from 'react';
import { loadQuestionChapterIndex, sortQuestionChapters, type QuestionKind } from '../data/questionChapters';
import { useLanguage } from '../state/LanguageContext';
import type { KnowledgeIndex } from '../types/learning';

interface PickerProps {
  kind: QuestionKind;
  chapters: ReturnType<typeof sortQuestionChapters>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function useQuestionChapterSelection(path: string | undefined, kind: QuestionKind, knowledgeIndex: KnowledgeIndex | null) {
  const [index, setIndex] = useState<Awaited<ReturnType<typeof loadQuestionChapterIndex>> | null>(null);
  const [requestedId, setRequestedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(path));

  useEffect(() => {
    let active = true;
    setIndex(null);
    setRequestedId(null);
    setError(null);
    if (!path) {
      setLoading(false);
      return () => { active = false; };
    }
    setLoading(true);
    loadQuestionChapterIndex(path, kind).then((result) => {
      if (active) {
        setIndex(result);
        setLoading(false);
      }
    }).catch((caught: unknown) => {
      if (active) {
        setError(caught instanceof Error ? caught.message : 'Unable to load chapter index.');
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [path, kind]);

  const chapters = useMemo(() => sortQuestionChapters(index?.chapters ?? [], knowledgeIndex), [index, knowledgeIndex]);
  const selected = chapters.find((chapter) => chapter.id === requestedId)
    ?? chapters.find((chapter) => chapter.questionCount > 0)
    ?? chapters[0];

  return { chapters, selected, selectChapter: setRequestedId, loading, error, totalQuestions: index?.totalQuestions ?? 0 };
}

export function QuestionChapterPicker({ kind, chapters, selectedId, onSelect }: PickerProps) {
  const { language } = useLanguage();
  return (
    <nav className="question-chapter-picker" aria-label={language === 'vi' ? 'Chọn chương' : 'Choose a chapter'}>
      <div className="question-chapter-picker__heading">
        <strong>{language === 'vi' ? 'Chương' : 'Chapters'}</strong>
        <span>{chapters.reduce((total, chapter) => total + chapter.questionCount, 0)} {language === 'vi' ? 'câu hỏi' : 'questions'}</span>
      </div>
      <div className="question-chapter-picker__list">
        {chapters.map((chapter) => (
          <button
            type="button"
            key={chapter.id}
            className={`question-chapter-picker__item${chapter.id === selectedId ? ' is-active' : ''}`}
            aria-current={chapter.id === selectedId ? 'true' : undefined}
            onClick={() => onSelect(chapter.id)}
          >
            <span>{chapter.title}</span>
            <span className={`question-chapter-picker__count question-chapter-picker__count--${kind}`}>
              {chapter.questionCount}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
