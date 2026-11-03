import { createElement, Fragment, lazy, Suspense, useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import DOMPurify from 'dompurify';
import {
  loadCaseStudyDocument,
  type CaseStudyCodeExplanation,
  type CaseStudyDetailValue,
  type CaseStudyItem,
} from '../data/casestudy';
import { QuestionChapterPicker, useQuestionChapterSelection } from './QuestionChapterPicker';
import { QuestionReadingFrame } from './ReadingFullscreen';
import { RelatedKnowledgeList } from './RelatedKnowledgeList';
import { MermaidMarkdown } from './MermaidMarkdown';
import { useLanguage } from '../state/LanguageContext';
import type { KnowledgeIndex, KnowledgeSectionRef } from '../types/learning';

const CodeExplorerPanel = lazy(() => import('./CodeExplorerPanel'));

interface CaseStudyPanelProps {
  path?: string;
  explorerUrl?: string;
  knowledgeIndex: KnowledgeIndex | null;
  onNavigateToKnowledge: (section: KnowledgeSectionRef) => void;
}

export function CaseStudyPanel({ path, explorerUrl, knowledgeIndex, onNavigateToKnowledge }: CaseStudyPanelProps) {
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
    <QuestionReadingFrame>
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
                <section className="assessment-related assessment-related--casestudy">
                  <h4>{language === 'vi' ? 'Kiến thức liên quan' : 'Related knowledge'}</h4>
                  <RelatedKnowledgeList related={item.readmeRelated} knowledgeIndex={knowledgeIndex}
                    onNavigateToKnowledge={onNavigateToKnowledge} />
                </section>
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
                                  onClose={() => setSourceCase(null)} />
                              </Suspense>
                            </>
                          ) : (
                            <p className="case-study-source__unavailable" role="status">{language === 'vi'
                              ? 'Mã nguồn thực tế chưa được phát hành cho module này. Cần publish dữ liệu STEP 8 để xem trong Monaco Editor.'
                              : 'The STEP 8 Java source material is not published for this module yet.'}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {item.codeExplanation && (
                    <CaseStudyCodeExplanationPanel
                      key={`${documentPath}:${index}`}
                      explanation={item.codeExplanation}
                      language={language}
                    />
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
    </QuestionReadingFrame>
  );
}

// Preserve authored HTML formatting without passing arbitrary attributes, links,
// event handlers or unsupported elements into the live React DOM. DOMPurify is
// applied first; the strict element allowlist provides another safety boundary.
const allowedExplanationTags = new Set([
  'p', 'br', 'b', 'strong', 'em', 'i', 'u', 's', 'del', 'mark',
  'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'h1', 'h2',
  'h3', 'h4', 'h5', 'h6', 'div', 'span', 'hr', 'table', 'thead',
  'tbody', 'tr', 'td', 'th',
]);
const blockedExplanationTags = new Set([
  'script', 'style', 'iframe', 'img', 'svg', 'math', 'object',
  'embed', 'link', 'meta', 'base', 'form', 'input', 'textarea',
  'select', 'button', 'video', 'audio', 'source', 'picture',
  'canvas', 'template', 'noscript', 'frame', 'frameset',
]);

function safeExplanationNode(node: Node, key: string): ReactNode {
  if (node.nodeType === 3) return node.textContent;
  if (node.nodeType !== 1) return null;
  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  if (blockedExplanationTags.has(tag)) return null;
  const children = Array.from(element.childNodes).map((child, index) => (
    safeExplanationNode(child, `${key}-${index}`)
  ));
  // Unknown harmless wrappers, including links, keep their authored text but
  // never carry attributes or become executable/navigation elements.
  if (!allowedExplanationTags.has(tag)) return createElement(Fragment, { key }, ...children);
  return createElement(tag, { key }, ...children);
}

function AuthoredHtml({ html }: { html: string }) {
  const content = useMemo(() => {
    // DOMPurify's ESM default is a factory in non-browser test environments.
    const purifier = typeof DOMPurify.sanitize === 'function' ? DOMPurify : DOMPurify(window);
    const sanitized = purifier.sanitize(html, { USE_PROFILES: { html: true } });
    const template = document.createElement('template');
    template.innerHTML = sanitized;
    return Array.from(template.content.childNodes).map((node, index) => (
      safeExplanationNode(node, String(index))
    ));
  }, [html]);
  return <div className="case-study-explanation__rich markdown-content">{content}</div>;
}

/** Authored strings support safe HTML; structured values remain React-escaped. */
function AuthoredDetail({ value }: { value: CaseStudyDetailValue }) {
  if (typeof value !== 'string') {
    return (
      <pre className="case-study-explanation__structured"><code>{
        typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
      }</code></pre>
    );
  }
  return <AuthoredHtml html={value} />;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: CaseStudyDetailValue;
}) {
  if (value === undefined) return null;
  return (
    <div className="case-study-explanation__detail">
      <strong>{label}</strong>
      <AuthoredDetail value={value} />
    </div>
  );
}

function CaseStudyCodeExplanationPanel({
  explanation,
  language,
}: {
  explanation: CaseStudyCodeExplanation;
  language: 'vi' | 'en';
}) {
  const uid = useId();
  const [expanded, setExpanded] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const [situationsOpen, setSituationsOpen] = useState(false);
  const scenarios = explanation.situations ?? [];
  const [selectedId, setSelectedId] = useState(() => scenarios[0]?.id);
  const selected = scenarios.find((scenario) => scenario.id === selectedId) ?? scenarios[0];

  // An absent child is omitted altogether, rather than displaying an empty accordion.
  if (!explanation.howItWorksHtml && scenarios.length === 0) return null;

  return (
    <section className="case-study-explanation">
      <button type="button" className={`interview-answer-toggle case-study-explanation__toggle${expanded ? ' is-open' : ''}`}
        aria-expanded={expanded} aria-controls={`${uid}-explanation`}
        onClick={() => setExpanded((current) => !current)}>
        <span>{language === 'vi' ? 'Giải thích mã nguồn' : 'Source code explanation'}</span>
        <span aria-hidden="true">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="case-study-explanation__body" id={`${uid}-explanation`}>
          {explanation.howItWorksHtml && (
            <div>
              <button type="button"
                className={`interview-answer-toggle case-study-explanation__subtoggle${howOpen ? ' is-open' : ''}`}
                aria-expanded={howOpen} aria-controls={`${uid}-how`}
                onClick={() => setHowOpen((current) => !current)}>
                <span>{language === 'vi' ? 'Cách hoạt động' : 'How it works'}</span>
                <span aria-hidden="true">{howOpen ? '−' : '+'}</span>
              </button>
              {howOpen && (
                <div className="case-study-explanation__panel" id={`${uid}-how`}>
                  <AuthoredDetail value={explanation.howItWorksHtml} />
                </div>
              )}
            </div>
          )}
          {scenarios.length > 0 && (
            <div>
              <button type="button"
                className={`interview-answer-toggle case-study-explanation__subtoggle${situationsOpen ? ' is-open' : ''}`}
                aria-expanded={situationsOpen} aria-controls={`${uid}-situations`}
                onClick={() => setSituationsOpen((current) => !current)}>
                <span>{language === 'vi' ? 'Các tình huống xảy ra' : 'Possible scenarios'}</span>
                <span aria-hidden="true">{situationsOpen ? '−' : '+'}</span>
              </button>
              {situationsOpen && selected && (
                <div className="case-study-explanation__panel" id={`${uid}-situations`}>
                  <div className="case-study-explanation__choices" role="tablist"
                    aria-label={language === 'vi' ? 'Chọn tình huống' : 'Choose scenario'}>
                    {scenarios.map((scenario) => (
                      <button key={scenario.id} type="button" role="tab"
                        aria-selected={selected.id === scenario.id}
                        aria-controls={`${uid}-scenario-detail`}
                        className={`case-study-explanation__choice${selected.id === scenario.id ? ' is-active' : ''}`}
                        onClick={() => setSelectedId(scenario.id)}>{scenario.title}</button>
                    ))}
                  </div>
                  <div className="case-study-explanation__scenario" role="tabpanel"
                    id={`${uid}-scenario-detail`}>
                    <h4>{selected.title}</h4>
                    {selected.description && <AuthoredDetail value={selected.description} />}
                    {selected.detailDescription && <AuthoredDetail value={selected.detailDescription} />}
                    <div className="case-study-explanation__details">
                      <DetailRow label={language === 'vi' ? 'Đầu vào' : 'Input'} value={selected.input} />
                      <DetailRow label={language === 'vi' ? 'Trạng thái' : 'Status'} value={selected.status} />
                      <DetailRow label={language === 'vi' ? 'Phản hồi' : 'Response'} value={selected.response} />
                    </div>
                    {selected.observations && (
                      <section className="case-study-explanation__observations">
                        <h5>{language === 'vi' ? 'Quan sát' : 'Observations'}</h5>
                        {selected.observations.map((observation, index) => (
                          <div key={index} className="case-study-explanation__observation">
                            <DetailRow label={language === 'vi' ? 'Loại' : 'Type'} value={observation.type} />
                            <DetailRow label={language === 'vi' ? 'Nguồn' : 'Source'} value={observation.source} />
                            <DetailRow label={language === 'vi' ? 'Chương trình' : 'Program'} value={observation.program} />
                            {observation.expect && (
                              <div className="case-study-explanation__expect">
                                <strong>{language === 'vi' ? 'Kỳ vọng' : 'Expected'}</strong>
                                <DetailRow label={language === 'vi' ? 'Từ khóa' : 'Keyword'} value={observation.expect.keyword} />
                                <DetailRow label={language === 'vi' ? 'Kết quả' : 'Results'} value={observation.expect.results} />
                                <DetailRow label={language === 'vi' ? 'Kết luận' : 'Conclusion'} value={observation.expect.conclusion} />
                              </div>
                            )}
                          </div>
                        ))}
                      </section>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
