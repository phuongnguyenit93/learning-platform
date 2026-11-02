import { lazy, Suspense, useEffect, useState } from 'react';
import { loadCaseStudyDocument, type CaseStudyItem } from '../data/casestudy';
import { QuestionChapterPicker, useQuestionChapterSelection } from './QuestionChapterPicker';
import { MermaidMarkdown } from './MermaidMarkdown';
import { useLanguage } from '../state/LanguageContext';

const CodeExplorerPanel = lazy(() => import('./CodeExplorerPanel'));

interface CaseStudyPanelProps {
  path?: string;
  explorerUrl?: string;
}

export function CaseStudyPanel({ path, explorerUrl }: CaseStudyPanelProps) {
  const { language } = useLanguage();
  const { chapters, selected, selectChapter, mode, loading: indexLoading, error: indexError } =
    useQuestionChapterSelection(path, 'casestudy', null);
  const documentPath = selected?.documentPath;
  const [cases, setCases] = useState<CaseStudyItem[]>([]);
  const [expandedHints, setExpandedHints] = useState<Set<number>>(() => new Set());
  const [expandedAnalysis, setExpandedAnalysis] = useState<Set<number>>(() => new Set());
  const [loadedPath, setLoadedPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sourceCase, setSourceCase] = useState<number | null>(null);
  const groupID = mode === 'groups' ? selected?.id.match(/^group-([1-9]\d*)$/)?.[1] : undefined;
  const validExplorer = explorerUrl && /^\/module\/[A-Z0-9_-]+\/code-explorer\/casestudy\/index\.json$/.test(explorerUrl);

  useEffect(() => {
    let active = true;
    setCases([]);
    setExpandedHints(new Set());
    setExpandedAnalysis(new Set());
    setSourceCase(null);
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
                  {groupID && (
                    <div className="case-study-source">
                      <button type="button" className={`interview-answer-toggle case-study-source__toggle${sourceCase === index ? ' is-open' : ''}`}
                        aria-expanded={sourceCase === index}
                        aria-controls={`case-study-source-${groupID}-${index + 1}`}
                        onClick={() => setSourceCase((current) => current === index ? null : index)}>
                        <span>{language === 'vi' ? 'Mã nguồn thực tế' : 'Actual Java source'}</span>
                        <span aria-hidden="true">{sourceCase === index ? '−' : '+'}</span>
                      </button>
                      {sourceCase === index && (
                        <div id={`case-study-source-${groupID}-${index + 1}`} className="case-study-source__content">
                          {validExplorer ? (
                            <>
                              <p className="case-study-source__description">{language === 'vi'
                                ? 'Java source của tình huống này, được lọc từ STEP 8. Ctrl+Click hoặc F12 để mở định nghĩa có liên kết.'
                                : 'Case-scoped Java source from STEP 8. Ctrl+Click or F12 to navigate indexed definitions.'}</p>
                              <Suspense fallback={<div className="code-explorer__status">{language === 'vi' ? 'Đang mở Monaco Editor...' : 'Opening Monaco Editor...'}</div>}>
                                <CodeExplorerPanel key={`${groupID}:${index + 1}`}
                                  materialUrl={explorerUrl!.replace(/index\.json$/, `groups/${groupID}/cases/${index + 1}/index.json`)}
                                  caseScope={{ groupID: Number(groupID), caseIndex: index + 1 }}
                                  request={null} onClose={() => setSourceCase(null)} />
                              </Suspense>
                            </>
                          ) : (
                            <p className="case-study-source__unavailable" role="status">{language === 'vi'
                              ? 'Mã nguồn thực tế chưa được phát hành cho module này. Cần publish dữ liệu STEP 9 để xem trong Monaco Editor.'
                              : 'The STEP 9 Java source material is not published for this module yet.'}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
