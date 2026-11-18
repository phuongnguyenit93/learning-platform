import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchModuleChapterInsights, fetchModuleKnowledgeLesson, type DatabaseChapterInsights, type DatabaseKnowledgeLesson, type DatabaseMenuChapter, type DatabaseMenuSection, type DatabaseModuleMenu } from '../data/moduleKnowledge';
import { normalizeKnowledgeSearchText } from '../data/knowledgeSearch';
import { formatKnowledgeDisplayTitle } from '../data/knowledge';
import { openAiSupportTopic } from '../data/aiSupportTopic';
import { useLanguage } from '../state/LanguageContext';
import { MermaidMarkdown } from './MermaidMarkdown';
import { getReadingScroller, ReadingFullscreenToolbar, useReadingFullscreen } from './ReadingFullscreen';

interface DatabaseKnowledgePanelProps {
  moduleSlug: string;
  moduleName: string;
  menu: DatabaseModuleMenu | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  chapterSlug: string | null;
  sectionSlug: string | null;
  onSelectChapter: (chapterSlug: string | null) => void;
  onSelectLesson: (chapterSlug: string, sectionSlug: string) => void;
}

type LessonState =
  | { status: 'loading' }
  | { status: 'ready'; lesson: DatabaseKnowledgeLesson }
  | { status: 'missing' }
  | { status: 'error'; message: string };

type InsightsState =
  | { status: 'loading' }
  | { status: 'ready'; insights: DatabaseChapterInsights }
  | { status: 'missing' }
  | { status: 'error'; message: string };

const NO_CHAPTERS: DatabaseMenuChapter[] = [];

/** A section slug is unique within a chapter, NOT within a module. */
export function knowledgeLessonKey(chapter: DatabaseMenuChapter, section: DatabaseMenuSection): string {
  return `${chapter.id}:${section.id}`;
}

function difficultyLabel(value: DatabaseMenuSection['difficulty'], language: 'vi' | 'en'): string {
  if (value === 'BASIC') return language === 'vi' ? 'CƠ BẢN' : 'BASIC';
  if (value === 'INTERMEDIATE') return language === 'vi' ? 'TRUNG BÌNH' : 'INTERMEDIATE';
  if (value === 'ADVANCED') return language === 'vi' ? 'NÂNG CAO' : 'ADVANCED';
  return language === 'vi' ? 'CHƯA XÁC ĐỊNH' : 'NOT SET';
}

function lessonComparison(lesson: DatabaseKnowledgeLesson, language: 'vi' | 'en') {
  const rows = [
    [language === 'vi' ? 'Trọng tâm' : 'Focus', lesson.focus],
    [language === 'vi' ? 'Vấn đề giải quyết' : 'Problem solved', lesson.problemSolved],
    [language === 'vi' ? 'Cơ chế' : 'Mechanism', lesson.mechanism],
    [language === 'vi' ? 'Giá trị ứng dụng' : 'Application value', lesson.applicationValue],
  ];
  return (
    <div className="knowledge-db-comparison">
      <h3>{language === 'vi' ? 'Trọng tâm và giá trị bài học' : 'Lesson focus and value'}</h3>
      <div className="knowledge-summary-table-scroll">
        <table>
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DatabaseKnowledgePanel({
  moduleSlug, moduleName, menu, loading, error, onRetry,
  chapterSlug, sectionSlug, onSelectChapter, onSelectLesson,
}: DatabaseKnowledgePanelProps) {
  const { language } = useLanguage();
  const { panelRef, fullscreenMode, toggleFullscreen } = useReadingFullscreen(Boolean(menu));
  const [search, setSearch] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(() => new Set());
  const [expandedLessonGroups, setExpandedLessonGroups] = useState<Set<number>>(() => new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(() => new Set());
  const [lessonStates, setLessonStates] = useState<Record<string, LessonState>>({});
  const [summaryId, setSummaryId] = useState<string | null>(null);
  const [comparisonChapters, setComparisonChapters] = useState<Set<number>>(() => new Set());
  const [insightsStates, setInsightsStates] = useState<Record<number, InsightsState>>({});
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);
  const [flyoutLeft, setFlyoutLeft] = useState(8);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [scrollRight, setScrollRight] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [navigationSerial, setNavigationSerial] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const manualOpenRef = useRef<string | null>(null);
  const lastScrollRef = useRef<string | null>(null);
  const autoScrollCancelled = useRef(false);
  const dragRef = useRef({ active: false, pointerId: -1, x: 0, scroll: 0, dragged: false });
  const suppressClick = useRef(false);
  const controllers = useRef(new Map<string, AbortController>());
  const insightsControllers = useRef(new Map<number, AbortController>());

  const chapters = menu?.chapters ?? NO_CHAPTERS;
  const requestedChapter = chapters.find((chapter) => chapter.slug === chapterSlug);
  const selectedChapter = requestedChapter ?? null;
  // Old ?section= links have no scoped chapter; resolve only when unambiguous.
  const sectionMatches = sectionSlug
    ? chapters.flatMap((chapter) => chapter.sections
      .filter((section) => section.slug === sectionSlug)
      .map((section) => ({ chapter, section }))) : [];
  const activeLesson = (selectedChapter
    ? sectionMatches.find(({ chapter }) => chapter.id === selectedChapter.id)
    : sectionMatches.length === 1 ? sectionMatches[0] : null) ?? null;
  const effectiveChapter = selectedChapter ?? (activeLesson?.chapter ?? null);
  const activeKey = activeLesson ? knowledgeLessonKey(activeLesson.chapter, activeLesson.section) : null;
  const unknownDeepLink = Boolean(menu && (
    (chapterSlug && !selectedChapter && !activeLesson) || (sectionSlug && !activeLesson)
  ));

  const visibleChapters = useMemo(() => {
    const query = normalizeKnowledgeSearchText(search);
    return chapters.map((chapter) => {
      const matchChapter = normalizeKnowledgeSearchText(chapter.title + ' ' + chapter.slug + ' ' + (chapter.description ?? '')).includes(query);
      const sections = chapter.sections.filter((section) => !query || matchChapter
        || normalizeKnowledgeSearchText(section.title + ' ' + section.slug + ' ' + (section.description ?? '')).includes(query));
      return { chapter, sections };
    }).filter(({ chapter, sections }) => (!effectiveChapter || chapter.id === effectiveChapter.id) && sections.length > 0);
  }, [chapters, effectiveChapter?.id, search]);

  useEffect(() => {
    // Module / locale state cannot leak into another reader.
    for (const controller of controllers.current.values()) controller.abort();
    controllers.current.clear();
    for (const controller of insightsControllers.current.values()) controller.abort();
    insightsControllers.current.clear();
    setExpandedChapters(new Set());
    setExpandedLessonGroups(new Set());
    setExpandedLessons(new Set());
    setLessonStates({});
    setComparisonChapters(new Set());
    setInsightsStates({});
    setSummaryId(null);
    setSearch('');
    setHoveredChapter(null);
    manualOpenRef.current = null;
    lastScrollRef.current = null;
    return () => {
      for (const controller of controllers.current.values()) controller.abort();
      controllers.current.clear();
      for (const controller of insightsControllers.current.values()) controller.abort();
      insightsControllers.current.clear();
    };
  }, [moduleSlug, language]);

  useEffect(() => {
    if (!activeLesson || !activeKey) return;
    setExpandedChapters((current) => new Set(current).add(activeLesson.chapter.id));
    setExpandedLessonGroups((current) => new Set(current).add(activeLesson.chapter.id));
    setExpandedLessons((current) => new Set(current).add(activeKey));
  }, [activeKey, activeLesson?.chapter.id]);

  useEffect(() => {
    if (!search.trim()) return;
    const ids = visibleChapters.map(({ chapter }) => chapter.id);
    setExpandedChapters((current) => new Set([...current, ...ids]));
    setExpandedLessonGroups((current) => new Set([...current, ...ids]));
  }, [search, visibleChapters]);

  // Only expanded, published lessons trigger CLOB fetches.
  useEffect(() => {
    if (!menu) return;
    for (const { chapter, sections } of visibleChapters) {
      for (const section of sections) {
        const key = knowledgeLessonKey(chapter, section);
        if (!section.available || !expandedLessons.has(key)) continue;
        if (lessonStates[key] || controllers.current.has(key)) continue;
        const controller = new AbortController();
        controllers.current.set(key, controller);
        setLessonStates((current) => ({ ...current, [key]: { status: 'loading' } }));
        void fetchModuleKnowledgeLesson(moduleSlug, chapter.slug, section.slug, language, controller.signal)
          .then((lesson) => {
            if (lesson && (lesson.knowledgeId !== section.knowledgeId
              || lesson.section.id !== section.id || lesson.chapter.id !== chapter.id)) {
              throw new Error('Invalid Module Knowledge lesson ownership.');
            }
            if (!controller.signal.aborted) setLessonStates((current) => ({
              ...current, [key]: lesson
                ? { status: 'ready', lesson }
                : { status: 'missing' },
            }));
          })
          .catch((cause: unknown) => {
            if (!controller.signal.aborted) setLessonStates((current) => ({
              ...current, [key]: {
                status: 'error', message: cause instanceof Error ? cause.message : 'Unable to load lesson.',
              },
            }));
          })
          .finally(() => {
            if (controllers.current.get(key) === controller) controllers.current.delete(key);
          });
      }
    }
    // In-flight collapsed lessons may finish and be cached, but module/locale changes abort them.
  }, [menu, moduleSlug, language, visibleChapters, expandedLessons, lessonStates]);

  useEffect(() => {
    if (!menu) return;
    for (const chapter of chapters) {
      if (!comparisonChapters.has(chapter.id) || insightsStates[chapter.id]
        || insightsControllers.current.has(chapter.id)) continue;
      const controller = new AbortController();
      insightsControllers.current.set(chapter.id, controller);
      setInsightsStates((current) => ({ ...current, [chapter.id]: { status: 'loading' } }));
      void fetchModuleChapterInsights(moduleSlug, chapter.slug, language, controller.signal)
        .then((insights) => {
          if (insights && insights.chapter.id !== chapter.id) {
            throw new Error('Invalid Chapter Insights ownership.');
          }
          if (!controller.signal.aborted) setInsightsStates((current) => ({
            ...current, [chapter.id]: insights
              ? { status: 'ready', insights } : { status: 'missing' },
          }));
        })
        .catch((cause: unknown) => {
          if (!controller.signal.aborted) setInsightsStates((current) => ({
            ...current, [chapter.id]: {
              status: 'error', message: cause instanceof Error ? cause.message : 'Unable to load insights.',
            },
          }));
        })
        .finally(() => {
          if (insightsControllers.current.get(chapter.id) === controller) insightsControllers.current.delete(chapter.id);
        });
    }
  }, [menu, chapters, comparisonChapters, insightsStates, moduleSlug, language]);

  useEffect(() => {
    if (!activeLesson || !activeKey || !expandedLessons.has(activeKey)) return;
    const marker = `${moduleSlug}:${language}:${activeKey}:${navigationSerial}`;
    if (manualOpenRef.current === activeKey) {
      manualOpenRef.current = null;
      lastScrollRef.current = marker;
      return;
    }
    if (lastScrollRef.current !== marker) {
      lastScrollRef.current = marker;
      autoScrollCancelled.current = false;
    }
    const frame = window.requestAnimationFrame(() => {
      if (autoScrollCancelled.current) return;
      const target = document.getElementById(`knowledge-db-section-${activeKey}`);
      if (!target) return;
      const scroller = getReadingScroller(panelRef.current);
      const clearance = (stickyRef.current?.getBoundingClientRect().height ?? 0)
        + (document.querySelector<HTMLElement>('.module-tab-wrapper')?.getBoundingClientRect().height ?? 0);
      if (scroller) {
        scroller.scrollTop += target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - clearance - 12;
      } else {
        const header = document.querySelector<HTMLElement>('.topbar')?.getBoundingClientRect().height ?? 0;
        window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - header - clearance - 12), behavior: 'instant' });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeKey, moduleSlug, language, navigationSerial, expandedLessons, lessonStates[activeKey ?? '']]);

  useEffect(() => {
    const cancel = () => { autoScrollCancelled.current = true; };
    const onKey = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) cancel();
    };
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchmove', cancel, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchmove', cancel);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    const tab = stripRef.current;
    if (!tab) return;
    const measure = () => {
      setScrollLeft(tab.scrollLeft > 2);
      setScrollRight(tab.scrollWidth - tab.clientWidth - tab.scrollLeft > 2);
    };
    measure();
    tab.addEventListener('scroll', measure, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(tab);
    return () => { tab.removeEventListener('scroll', measure); observer?.disconnect(); };
  }, [menu, chapters.length]);

  useEffect(() => {
    const sticky = stickyRef.current;
    const panel = panelRef.current;
    if (!sticky || !panel) return;
    const measure = () => {
      const tabBar = document.querySelector<HTMLElement>('.module-tab-wrapper');
      const header = document.querySelector<HTMLElement>('.topbar');
      const scroller = getReadingScroller(panel);
      const inFullscreen = Boolean(panel.closest('.learning-main--reading-fullscreen'));
      const top = scroller ? (inFullscreen ? tabBar?.getBoundingClientRect().height ?? 0 : 0)
        : (tabBar?.getBoundingClientRect().height ?? 0) + (header?.getBoundingClientRect().height ?? 0);
      sticky.style.top = `${top}px`;
      panel.style.setProperty('--knowledge-lesson-top', `${top + sticky.getBoundingClientRect().height}px`);
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (sticky) observer?.observe(sticky);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      sticky.style.removeProperty('top');
      panel.style.removeProperty('--knowledge-lesson-top');
    };
  }, [menu, fullscreenMode]);

  const navigateLesson = (chapter: DatabaseMenuChapter, section: DatabaseMenuSection, manual: boolean) => {
    const key = knowledgeLessonKey(chapter, section);
    if (manual) manualOpenRef.current = key;
    else {
      manualOpenRef.current = null;
      setNavigationSerial((value) => value + 1);
    }
    setExpandedChapters((current) => new Set(current).add(chapter.id));
    setExpandedLessonGroups((current) => new Set(current).add(chapter.id));
    setExpandedLessons((current) => new Set(current).add(key));
    setHoveredChapter(null);
    setSearch('');
    onSelectLesson(chapter.slug, section.slug);
  };

  const toggleLesson = (chapter: DatabaseMenuChapter, section: DatabaseMenuSection) => {
    if (!section.available) return;
    const key = knowledgeLessonKey(chapter, section);
    const willOpen = !expandedLessons.has(key);
    setExpandedLessons((current) => {
      const next = new Set(current);
      if (willOpen) next.add(key);
      else next.delete(key);
      return next;
    });
    setSummaryId(null);
    if (willOpen) {
      if (lessonStates[key]?.status === 'error' || lessonStates[key]?.status === 'missing') {
        setLessonStates((current) => {
          const next = { ...current };
          delete next[key];
          return next;
        });
      }
      navigateLesson(chapter, section, true);
    }
  };

  const retryLesson = (key: string) => {
    setLessonStates((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const toggleChapter = (id: number) => setExpandedChapters((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const toggleLessons = (id: number) => setExpandedLessonGroups((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const renderLesson = (chapter: DatabaseMenuChapter, section: DatabaseMenuSection, index: number) => {
    const key = knowledgeLessonKey(chapter, section);
    const state = lessonStates[key];
    const expanded = expandedLessons.has(key);
    const summaryOpen = summaryId === key;
    const loaded = state?.status === 'ready' ? state.lesson : null;
    return (
      <article key={key} id={`knowledge-db-section-${key}`}
        className={`knowledge-card${expanded ? ' is-expanded' : ''}`}>
        <div className="knowledge-card__sticky">
          <div className="knowledge-card__header">
            <button type="button" className="knowledge-card__trigger"
              aria-expanded={expanded} disabled={!section.available}
              onClick={() => toggleLesson(chapter, section)}>
              <span className="knowledge-card__index">#{index + 1}</span>
              <span className="knowledge-card__title-group">
                <span className="knowledge-card__title">{formatKnowledgeDisplayTitle(section.title)}</span>
                {!effectiveChapter && <span className="knowledge-card__category">{chapter.title}</span>}
                {!section.available && <span className="knowledge-section-status">{language === 'vi' ? 'Chưa xuất bản' : 'Not published'}</span>}
              </span>
            </button>
            <span className="knowledge-card__metadata">
              {section.difficulty && <span className={`knowledge-card__level knowledge-card__level--${section.difficulty.toLowerCase()}`}>
                {difficultyLabel(section.difficulty, language)}
              </span>}
              {section.hasSummary && section.available && (
                <button type="button" className={`knowledge-card__summary-toggle${summaryOpen ? ' is-active' : ''}`}
                  aria-expanded={summaryOpen} aria-controls={`knowledge-db-summary-${key}`}
                  onClick={() => {
                    if (!expanded) navigateLesson(chapter, section, true);
                    setSummaryId((current) => current === key ? null : key);
                  }}>
                  {language === 'vi' ? 'Tóm tắt' : 'Summary'}
                </button>
              )}
            </span>
            <button type="button" className="knowledge-card__expand" disabled={!section.available}
              aria-expanded={expanded}
              aria-label={expanded ? (language === 'vi' ? 'Đóng bài học' : 'Collapse lesson')
                : (language === 'vi' ? 'Mở bài học' : 'Expand lesson')}
              onClick={() => toggleLesson(chapter, section)}>{expanded ? '−' : '+'}</button>
          </div>
          {summaryOpen && loaded?.summary && (
            <div id={`knowledge-db-summary-${key}`} className="knowledge-card__summary">
              <div className="knowledge-card__summary-heading">
                <strong>{language === 'vi' ? 'Tóm tắt bài học' : 'Lesson summary'}</strong>
                <button type="button" aria-label="Close summary" onClick={() => setSummaryId(null)}>×</button>
              </div>
              <div className="knowledge-card__summary-scroll markdown-content">
                <MermaidMarkdown scrollTables>{loaded.summary}</MermaidMarkdown>
              </div>
            </div>
          )}
        </div>
        {expanded && (
          <div className="knowledge-card__body">
            <button type="button" className="ai-topic-action ai-topic-action--knowledge"
              onClick={() => openAiSupportTopic({
                kind: 'knowledge', moduleName: moduleName || moduleSlug,
                groupTitle: chapter.title, itemTitle: formatKnowledgeDisplayTitle(section.title),
              })}>
              {language === 'vi' ? 'Hỏi AI Support về chủ đề này' : 'Ask AI Support about this topic'}
            </button>
            {(!state || state.status === 'loading') && (
              <div className="knowledge-section-status" role="status">
                {language === 'vi' ? 'Đang tải nội dung...' : 'Loading lesson...'}
              </div>
            )}
            {state?.status === 'missing' && (
              <div className="knowledge-section-status knowledge-section-status--error">
                {language === 'vi' ? 'Bài học chưa có bản dịch hoặc chưa xuất bản.' : 'Lesson translation is unavailable.'}
                <button type="button" onClick={() => retryLesson(key)}>{language === 'vi' ? 'Thử lại' : 'Retry'}</button>
              </div>
            )}
            {state?.status === 'error' && (
              <div className="knowledge-section-status knowledge-section-status--error" role="alert">
                {state.message} <button type="button" onClick={() => retryLesson(key)}>
                  {language === 'vi' ? 'Thử lại' : 'Retry'}
                </button>
              </div>
            )}
            {loaded && (
              <>
                {lessonComparison(loaded, language)}
                <div className="markdown-content knowledge-card__markdown">
                  <MermaidMarkdown>{loaded.markdownContent}</MermaidMarkdown>
                </div>
              </>
            )}
          </div>
        )}
      </article>
    );
  };

  const renderChapterComparison = (chapter: DatabaseMenuChapter) => {
    const state = insightsStates[chapter.id];
    const lessons = state?.status === 'ready' ? state.insights.lessons : [];
    const opened = comparisonChapters.has(chapter.id);
    return (
      <div className="knowledge-chapter-summary">
        <button type="button" className="knowledge-chapter-summary__heading knowledge-accordion-toggle"
          aria-expanded={opened} onClick={() => setComparisonChapters((current) => {
            const next = new Set(current);
            if (next.has(chapter.id)) next.delete(chapter.id); else next.add(chapter.id);
            return next;
          })}>
          {language === 'vi' ? 'So sánh bài học trong chương' : 'Compare chapter lessons'}
          <span className="knowledge-accordion-chevron">{opened ? '−' : '+'}</span>
        </button>
        {opened && (
          <div className="knowledge-chapter-summary__scroll markdown-content">
            {(!state || state.status === 'loading') && (
              <p role="status">{language === 'vi' ? 'Đang tải bảng so sánh chương...' : 'Loading chapter comparison...'}</p>
            )}
            {state?.status === 'missing' && (
              <p>{language === 'vi' ? 'Chương chưa có thông tin so sánh đã xuất bản.' : 'No published chapter comparison available.'}</p>
            )}
            {state?.status === 'error' && (
              <div role="alert">
                <p>{state.message}</p>
                <button type="button" onClick={() => setInsightsStates((current) => {
                  const next = { ...current };
                  delete next[chapter.id];
                  return next;
                })}>{language === 'vi' ? 'Thử lại' : 'Retry'}</button>
              </div>
            )}
            {state?.status === 'ready' && lessons.length === 0 && (
              <p>{language === 'vi' ? 'Chương chưa có bài học đã xuất bản.' : 'No published lessons yet.'}</p>
            )}
            {state?.status === 'ready' && lessons.length > 0 && (
              <div className="knowledge-summary-table-scroll">
                <table>
                  <thead><tr>
                    <th>{language === 'vi' ? 'Bài học' : 'Lesson'}</th>
                    <th>{language === 'vi' ? 'Trọng tâm' : 'Focus'}</th>
                    <th>{language === 'vi' ? 'Vấn đề giải quyết' : 'Problem solved'}</th>
                    <th>{language === 'vi' ? 'Cơ chế' : 'Mechanism'}</th>
                    <th>{language === 'vi' ? 'Giá trị ứng dụng' : 'Application value'}</th>
                  </tr></thead>
                  <tbody>{lessons.map((lesson) => (
                    <tr key={lesson.knowledgeId}>
                      <th scope="row">{lesson.title}</th>
                      <td>{lesson.focus}</td><td>{lesson.problemSolved}</td>
                      <td>{lesson.mechanism}</td><td>{lesson.applicationValue}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderLessons = (chapter: DatabaseMenuChapter, sections: DatabaseMenuSection[]) => {
    const expanded = expandedLessonGroups.has(chapter.id);
    return (
      <>
        <button type="button" className="knowledge-lessons-heading knowledge-lessons-heading--toggle"
          aria-expanded={expanded} onClick={() => toggleLessons(chapter.id)}>
          <span>{language === 'vi' ? 'BÀI HỌC' : 'LESSONS'}</span>
          <span className="knowledge-lessons-heading__line" aria-hidden="true" />
          <span className="knowledge-lessons-heading__count">{sections.length}</span>
          <span className="knowledge-accordion-chevron">{expanded ? '−' : '+'}</span>
        </button>
        {expanded && (
          <div className="knowledge-category-group__sections">
            {sections.map((section) => renderLesson(chapter, section,
              chapter.sections.findIndex((value) => value.id === section.id)))}
          </div>
        )}
      </>
    );
  };

  if (loading) return <div className="empty-state empty-state--large" role="status">
    <strong>{language === 'vi' ? 'Đang tải Menu Knowledge...' : 'Loading Knowledge menu...'}</strong>
  </div>;
  if (error) return <div className="empty-state empty-state--large" role="alert">
    <strong>{language === 'vi' ? 'Không thể tải Knowledge từ database' : 'Unable to load database Knowledge'}</strong>
    <span>{error}</span><button type="button" onClick={onRetry}>{language === 'vi' ? 'Thử lại' : 'Retry'}</button>
  </div>;
  if (!menu || chapters.length === 0) return <div className="empty-state empty-state--large">
    <strong>{language === 'vi' ? 'Chưa có dữ liệu Knowledge' : 'No Knowledge data yet'}</strong>
  </div>;

  const hovered = hoveredChapter === 'all' ? null : chapters.find((chapter) => chapter.slug === hoveredChapter);
  const showFlyout = hoveredChapter === 'all' || Boolean(hovered);
  return (
    <section ref={panelRef} className={`knowledge-panel reading-fullscreen-surface knowledge-db-panel${fullscreenMode === 'focus' ? ' is-focus-mode' : ''}`}>
      <div className="knowledge-sticky-controls" ref={stickyRef}>
        <div className="knowledge-topic-nav" ref={navRef}
          onPointerLeave={() => setHoveredChapter(null)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHoveredChapter(null); }}
          onKeyDown={(event) => { if (event.key === 'Escape') setHoveredChapter(null); }}>
          <button type="button" className="knowledge-topic-nav__scroll" disabled={!scrollLeft}
            aria-label="Previous chapters" onClick={() => stripRef.current?.scrollBy({ left: -180, behavior: 'smooth' })}>‹</button>
          <div className={`knowledge-topic-strip${dragging ? ' is-dragging' : ''}`} ref={stripRef}
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              dragRef.current = { active: true, pointerId: event.pointerId, x: event.clientX,
                scroll: stripRef.current?.scrollLeft ?? 0, dragged: false };
            }}
            onPointerMove={(event) => {
              const drag = dragRef.current;
              if (!drag.active || drag.pointerId !== event.pointerId || !stripRef.current) return;
              const delta = event.clientX - drag.x;
              if (!drag.dragged && Math.abs(delta) > 5) {
                drag.dragged = true;
                setDragging(true);
                setHoveredChapter(null);
                if (!stripRef.current.hasPointerCapture(event.pointerId)) stripRef.current.setPointerCapture(event.pointerId);
              }
              if (drag.dragged) { event.preventDefault(); stripRef.current.scrollLeft = drag.scroll - delta; }
            }}
            onPointerUp={(event) => {
              if (dragRef.current.pointerId !== event.pointerId) return;
              suppressClick.current = dragRef.current.dragged;
              window.setTimeout(() => { suppressClick.current = false; }, 0);
              dragRef.current.active = false;
              setDragging(false);
              if (stripRef.current?.hasPointerCapture(event.pointerId)) stripRef.current.releasePointerCapture(event.pointerId);
            }}
            onPointerCancel={() => { dragRef.current.active = false; setDragging(false); }}
            onClickCapture={(event) => {
              if (suppressClick.current) { suppressClick.current = false; event.preventDefault(); event.stopPropagation(); }
            }}>
            <button type="button" className={`knowledge-topic-strip__button${!effectiveChapter ? ' is-active' : ''}`}
              onClick={() => onSelectChapter(null)}
              onPointerEnter={(event) => { if (event.pointerType !== 'touch') setHoveredChapter('all'); }}
              onFocus={() => setHoveredChapter('all')}>
              {language === 'vi' ? 'Tất cả' : 'All'} <span>{menu.lessonCount}</span>
            </button>
            {chapters.map((chapter) => (
              <button type="button" key={chapter.id}
                className={`knowledge-topic-strip__button${effectiveChapter?.id === chapter.id ? ' is-active' : ''}`}
                onClick={() => { setHoveredChapter(null); onSelectChapter(chapter.slug); }}
                onPointerEnter={(event) => {
                  if (event.pointerType !== 'touch') {
                    const bounds = navRef.current?.getBoundingClientRect();
                    if (bounds) setFlyoutLeft(Math.max(8, Math.min(
                      event.currentTarget.getBoundingClientRect().left - bounds.left,
                      bounds.width - Math.min(420, bounds.width - 16) - 8,
                    )));
                    setHoveredChapter(chapter.slug);
                  }
                }}
                onFocus={() => setHoveredChapter(chapter.slug)}>
                {chapter.title}<span>{chapter.sections.filter((section) => section.available).length}</span>
              </button>
            ))}
          </div>
          <button type="button" className="knowledge-topic-nav__scroll" disabled={!scrollRight}
            aria-label="Next chapters" onClick={() => stripRef.current?.scrollBy({ left: 180, behavior: 'smooth' })}>›</button>
          {showFlyout && !dragging && (
            <div className="knowledge-topic-flyout" style={{ left: flyoutLeft }}>
              <div className="knowledge-topic-flyout__heading">
                {hoveredChapter === 'all' ? (language === 'vi' ? 'Các chương' : 'Chapters') : hovered?.title}
                <span>{hoveredChapter === 'all' ? chapters.length : hovered?.sections.length}</span>
              </div>
              <div className="knowledge-topic-flyout__items">
                {hoveredChapter === 'all' ? chapters.map((chapter) => (
                  <button type="button" className="knowledge-topic-flyout__item knowledge-topic-flyout__chapter"
                    key={chapter.id} onClick={() => { setHoveredChapter(null); onSelectChapter(chapter.slug); }}>
                    {chapter.title}<span className="knowledge-topic-flyout__chapter-count">{chapter.lessonCount}</span>
                  </button>
                )) : hovered?.sections.map((section) => (
                  <button type="button" className="knowledge-topic-flyout__item" disabled={!section.available}
                    key={section.id} onClick={() => navigateLesson(hovered, section, false)}>
                    {formatKnowledgeDisplayTitle(section.title)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <ReadingFullscreenToolbar fullscreenMode={fullscreenMode} onToggle={toggleFullscreen} />
      </div>
      <label className="learning-search knowledge-db-search">
        <span className="learning-search__icon" aria-hidden="true">⌕</span>
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)}
          placeholder={language === 'vi' ? 'Tìm chương hoặc bài học...' : 'Search chapters and lessons...'} />
        {search && <button type="button" className="learning-search__clear" onClick={() => setSearch('')}>×</button>}
      </label>
      <div className="knowledge-list">
        {unknownDeepLink && (
          <div className="empty-state" role="alert">
            <strong>{language === 'vi' ? 'Không tìm thấy chương hoặc bài học từ liên kết' : 'Chapter or lesson link not found'}</strong>
            <span>{language === 'vi' ? 'Chọn một chương hoặc bài học khác trong Menu.' : 'Choose another chapter or lesson from the menu.'}</span>
          </div>
        )}
        {effectiveChapter ? (
          visibleChapters.map(({ chapter, sections }) => (
            <div key={chapter.id}>
              {chapter.description && <p className="knowledge-db-chapter-description">{chapter.description}</p>}
              {renderChapterComparison(chapter)}
              {renderLessons(chapter, sections)}
            </div>
          ))
        ) : visibleChapters.map(({ chapter, sections }) => {
          const expanded = expandedChapters.has(chapter.id);
          return (
            <section key={chapter.id} className="knowledge-category-group">
              <button type="button" className="knowledge-category-group__header knowledge-accordion-toggle"
                aria-expanded={expanded} onClick={() => toggleChapter(chapter.id)}>
                <span className="knowledge-category-group__title">{chapter.title}</span>
                <span className="knowledge-category-group__actions">
                  <span className="knowledge-category-group__count">{sections.length} {language === 'vi' ? 'bài' : 'lessons'}</span>
                  <span className="knowledge-accordion-chevron">{expanded ? '−' : '+'}</span>
                </span>
              </button>
              {expanded && (
                <div className="knowledge-category-group__content">
                  {chapter.description && <p className="knowledge-db-chapter-description">{chapter.description}</p>}
                  {renderChapterComparison(chapter)}
                  {renderLessons(chapter, sections)}
                </div>
              )}
            </section>
          );
        })}
        {visibleChapters.length === 0 && <div className="empty-state">
          <strong>{language === 'vi' ? 'Không tìm thấy bài học phù hợp' : 'No matching lessons'}</strong>
        </div>}
      </div>
    </section>
  );
}
