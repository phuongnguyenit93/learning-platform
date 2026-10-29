import { useEffect, useState } from 'react';
import { loadCaseStudyDocument, type CaseStudyItem } from '../data/casestudy';
import { QuestionChapterPicker, useQuestionChapterSelection } from './QuestionChapterPicker';
import { MermaidMarkdown } from './MermaidMarkdown';
import { useLanguage } from '../state/LanguageContext';

interface CaseStudyPanelProps {
  path?: string;
}

export function CaseStudyPanel({ path }: CaseStudyPanelProps) {
  const { language } = useLanguage();
  const { chapters, selected, selectChapter, mode, loading: indexLoading, error: indexError } =
    useQuestionChapterSelection(path, 'casestudy', null);
  const documentPath = selected?.documentPath;
  const [cases, setCases] = useState<CaseStudyItem[]>([]);
  const [expandedHints, setExpandedHints] = useState<Set<number>>(() => new Set());
  const [expandedAnalysis, setExpandedAnalysis] = useState<Set<number>>(() => new Set());
  const [loadedPath, setLoadedPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setCases([]);
    setExpandedHints(new Set());
    setExpandedAnalysis(new Set());
    setError(null);
    setLoadedPath(null);
    if (!documentPath || selected?.questionCount === 0) {
      setLoadedPath(documentPath ?? null);
      return () => { active = false; };
    }
    loadCaseStudyDocument(documentPath).then((items) => {
      if (!active) return;
      setCases(items);
      setLoadedPath(documentPath);
    }).catch((caught: unknown) => {
      if (!active) return;
      setError(caught instanceof Error ? caught.message : 'Unable to load Case Study.');
      setLoadedPath(documentPath);
    });
    return () => { active = false; };
  }, [documentPath, selected?.questionCount]);

  if (!path) return <div className="empty-state"><strong>{language === 'vi' ? 'Case Study chưa có dữ liệu' : 'No Case Study data yet'}</strong></div>;
  if (indexLoading) return <div className="empty-state"><strong>{language === 'vi' ? 'Đang tải Case Study...' : 'Loading Case Study...'}</strong></div>;
  if (indexError) return <div className="empty-state"><strong>{indexError}</strong></div>;
  if (!chapters.length) return <div className="empty-state"><strong>{language === 'vi' ? 'Case Study chưa có dữ liệu' : 'No Case Study data yet'}</strong></div>;

  return (
    <div className="question-chapter-content">
      <QuestionChapterPicker kind="casestudy" chapters={chapters} mode={mode}
        selectedId={selected?.id ?? null} onSelect={selectChapter} />
      {loadedPath !== documentPath ? (
        <div className="empty-state"><strong>{language === 'vi' ? 'Đang tải tình huống...' : 'Loading cases...'}</strong></div>
      ) : error ? (
        <div className="empty-state"><strong>{error}</strong></div>
      ) : (
        <section className="interview-list">
          {cases.map((item, index) => {
            const hintExpanded = expandedHints.has(index);
            const analysisExpanded = expandedAnalysis.has(index);
            return (
              <article key={index} className="interview-card case-study-card">
                <div className="interview-card__topline">
                  <span className="interview-card__number">{language === 'vi' ? 'Tình huống' : 'Case'} {index + 1}</span>
                </div>
                <div className="markdown-content"><MermaidMarkdown>{item.situation}</MermaidMarkdown></div>
                <div className="case-study-knowledge">
                  <h4>{language === 'vi' ? 'Kiến thức áp dụng' : 'Relevant knowledge'}</h4>
                  <div className="markdown-content"><MermaidMarkdown>{item.knowledge}</MermaidMarkdown></div>
                </div>
                <div className="case-study-disclosures">
                  <div>
                    <button type="button" className={`interview-answer-toggle${hintExpanded ? ' is-open' : ''}`}
                      aria-expanded={hintExpanded}
                      onClick={() => setExpandedHints((current) => {
                        const next = new Set(current);
                        if (next.has(index)) next.delete(index);
                        else next.add(index);
                        return next;
                      })}>
                      <span>{language === 'vi' ? 'Gợi ý' : 'Hint'}</span>
                      <span aria-hidden="true">{hintExpanded ? '−' : '+'}</span>
                    </button>
                    {hintExpanded && (
                      <div className="interview-answer markdown-content"><MermaidMarkdown>{item.resolve}</MermaidMarkdown></div>
                    )}
                  </div>
                  <div>
                    <button type="button" className={`interview-answer-toggle${analysisExpanded ? ' is-open' : ''}`}
                      aria-expanded={analysisExpanded}
                      onClick={() => setExpandedAnalysis((current) => {
                        const next = new Set(current);
                        if (next.has(index)) next.delete(index);
                        else next.add(index);
                        return next;
                      })}>
                      <span>{language === 'vi' ? 'Phân tích và mã nguồn gợi ý' : 'Analysis and suggested code'}</span>
                      <span aria-hidden="true">{analysisExpanded ? '−' : '+'}</span>
                    </button>
                    {analysisExpanded && (
                      <div className="interview-answer markdown-content"><MermaidMarkdown>{item.code}</MermaidMarkdown></div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
