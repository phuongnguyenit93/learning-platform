import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ModuleSidebar } from '../components/ModuleSidebar';
import { ModuleTabs, type ModuleTab } from '../components/ModuleTabs';
import { DatabaseOverviewPanel } from '../components/DatabaseOverviewPanel';
import { RoadmapPanel } from '../components/RoadmapPanel';
import { ReferencePanel } from '../components/ReferencePanel';
import { DatabaseKnowledgePanel } from '../components/DatabaseKnowledgePanel';
import { ReadingFullscreenContext, useModuleReadingFullscreen } from '../components/ReadingFullscreen';
import { collectRealModules, findModuleByRouteId, formatCatalogName } from '../data/moduleCatalog';
import { fetchModuleCore, type ModuleCore } from '../data/moduleCore';
import { fetchModuleMenu, type DatabaseModuleMenu } from '../data/moduleKnowledge';
import { fetchTopicKnowledgeCounts } from '../data/topicKnowledgeCounts';
import { fetchTopicStructure } from '../data/topicStructure';
import { topicKnowledgePath } from '../data/topicRoutes';
import { useLanguage } from '../state/LanguageContext';
import type { ModuleCatalog } from '../types/learning';

type StructureState =
  | { topicSlug: string; status: 'loading' }
  | { topicSlug: string; status: 'ready'; catalog: ModuleCatalog }
  | { topicSlug: string; status: 'error'; message: string };

type ModuleCoreState =
  | { slug: string; status: 'loading' }
  | { slug: string; status: 'ready'; module: ModuleCore }
  | { slug: string; status: 'missing' }
  | { slug: string; status: 'error'; message: string };

type MenuState =
  | { slug: string; language: string; status: 'loading' }
  | { slug: string; language: string; status: 'ready'; menu: DatabaseModuleMenu }
  | { slug: string; language: string; status: 'missing' }
  | { slug: string; language: string; status: 'error'; message: string };

type TopicCountsState =
  | { topicId: number; language: string; status: 'loading' }
  | { topicId: number; language: string; status: 'ready'; counts: Record<string, number> }
  | { topicId: number; language: string; status: 'error' };

const EMPTY_COUNTS: Record<string, number> = {};
const EMPTY_ROADMAPS: Record<string, boolean> = {};

const TABS: ModuleTab[] = ['overview', 'roadmap', 'reference', 'knowledge', 'quiz', 'interview', 'casestudy', 'feedback'];

function queryTab(search: string): ModuleTab {
  const tab = new URLSearchParams(search).get('tab');
  return TABS.find((item) => item === tab) ?? 'knowledge';
}

/**
 * DB-driven navigation for every Topic. Menu metadata is lightweight, and
 * each published Knowledge lesson is fetched only when opened.
 */
export function TopicStructurePage() {
  const { topicSlug = 'java', moduleSlug } = useParams();
  const { search, hash } = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [state, setState] = useState<StructureState>({ topicSlug, status: 'loading' });
  const [reload, setReload] = useState(0);
  const requestedTab = queryTab(search);
  const [activeTab, setActiveTab] = useState<ModuleTab>(requestedTab);
  const [visitedKnowledge, setVisitedKnowledge] = useState(requestedTab === 'knowledge');
  const [moduleCoreState, setModuleCoreState] = useState<ModuleCoreState | null>(null);
  const [moduleCoreRetry, setModuleCoreRetry] = useState(0);
  const [menuState, setMenuState] = useState<MenuState | null>(null);
  const [menuReload, setMenuReload] = useState(0);
  const [topicCountsState, setTopicCountsState] = useState<TopicCountsState | null>(null);
  const readingRef = useRef<HTMLElement>(null);
  const readingFullscreen = useModuleReadingFullscreen(readingRef);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => window.matchMedia?.('(max-width: 820px)').matches ?? false,
  );

  useEffect(() => {
    const controller = new AbortController();
    setState({ topicSlug, status: 'loading' });
    fetchTopicStructure(topicSlug, controller.signal)
      .then((catalog) => {
        if (!controller.signal.aborted) setState({ topicSlug, status: 'ready', catalog });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setState({
          topicSlug,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unable to load topic structure.',
        });
      });
    return () => controller.abort();
  }, [topicSlug, reload]);

  useEffect(() => {
    setActiveTab(requestedTab);
    if (requestedTab === 'knowledge') setVisitedKnowledge(true);
  }, [topicSlug, moduleSlug, requestedTab]);

  const catalog = state.topicSlug === topicSlug && state.status === 'ready' ? state.catalog : null;
  const topicId = Number(catalog?.root.id.replace('topic:', '')) || 0;
  const modules = useMemo(() => catalog ? collectRealModules(catalog.root) : [], [catalog]);
  const selected = useMemo(() => (
    catalog && moduleSlug ? findModuleByRouteId(catalog.root, moduleSlug) : undefined
  ), [catalog, moduleSlug]);
  const selectedSlug = selected?.slug ?? '';

  useEffect(() => {
    if (!topicId) return;
    const controller = new AbortController();
    setTopicCountsState({ topicId, language, status: 'loading' });
    fetchTopicKnowledgeCounts(topicId, language, controller.signal)
      .then((counts) => {
        if (!controller.signal.aborted) setTopicCountsState({ topicId, language, status: 'ready', counts });
      })
      .catch(() => {
        if (!controller.signal.aborted) setTopicCountsState({ topicId, language, status: 'error' });
      });
    return () => controller.abort();
  }, [topicId, language, reload]);

  useEffect(() => {
    if (!selectedSlug) {
      setMenuState(null);
      return;
    }
    const controller = new AbortController();
    setMenuState({ slug: selectedSlug, language, status: 'loading' });
    fetchModuleMenu(selectedSlug, language, controller.signal)
      .then((menu) => {
        if (controller.signal.aborted) return;
        setMenuState(menu
          ? { slug: selectedSlug, language, status: 'ready', menu }
          : { slug: selectedSlug, language, status: 'missing' });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setMenuState({
          slug: selectedSlug, language, status: 'error',
          message: error instanceof Error ? error.message : 'Unable to load Knowledge Menu.',
        });
      });
    return () => controller.abort();
  }, [selectedSlug, language, menuReload]);

  useEffect(() => {
    if (!selectedSlug) {
      setModuleCoreState(null);
      return;
    }
    const controller = new AbortController();
    setModuleCoreState({ slug: selectedSlug, status: 'loading' });
    fetchModuleCore(selectedSlug, controller.signal)
      .then((module) => {
        if (controller.signal.aborted) return;
        setModuleCoreState(module
          ? { slug: selectedSlug, status: 'ready', module }
          : { slug: selectedSlug, status: 'missing' });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setModuleCoreState({
          slug: selectedSlug,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unable to load Module Core.',
        });
      });
    return () => controller.abort();
  }, [selectedSlug, moduleCoreRetry, reload]);

  useEffect(() => {
    if (catalog && !moduleSlug && modules[0]?.routeId) {
      navigate(`${topicKnowledgePath(topicSlug, modules[0].routeId)}${search}${hash}`, { replace: true });
    }
  }, [catalog, moduleSlug, modules, navigate, topicSlug, search, hash]);

  const scopedMenuState = menuState?.slug === selectedSlug && menuState.language === language
    ? menuState : null;
  const menu = scopedMenuState?.status === 'ready' ? scopedMenuState.menu : null;
  const scopedCountsState = topicCountsState?.topicId === topicId && topicCountsState.language === language
    ? topicCountsState : null;
  const knowledgeCounts = useMemo(() => {
    const all = scopedCountsState?.status === 'ready' ? scopedCountsState.counts : EMPTY_COUNTS;
    return menu && selectedSlug ? { ...all, [selectedSlug]: menu.lessonCount } : all;
  }, [scopedCountsState, menu, selectedSlug]);

  if (state.topicSlug !== topicSlug || state.status === 'loading') {
    return (
      <main className="learning-layout learning-layout--status" role="status">
        <div className="empty-state empty-state--large">
          <strong>{language === 'vi' ? 'Đang tải cấu trúc từ cơ sở dữ liệu...' : 'Loading structure from database...'}</strong>
        </div>
      </main>
    );
  }

  if (state.status === 'error') {
    return (
      <main className="learning-layout learning-layout--status" role="alert">
        <div className="empty-state empty-state--large">
          <strong>{language === 'vi' ? 'Không thể tải cấu trúc chủ đề' : 'Unable to load topic structure'}</strong>
          <span>{state.message}</span>
          <button type="button" onClick={() => setReload((value) => value + 1)}>
            {language === 'vi' ? 'Thử lại' : 'Retry'}
          </button>
        </div>
      </main>
    );
  }

  const core = moduleCoreState?.slug === selectedSlug && moduleCoreState.status === 'ready'
    ? moduleCoreState.module : null;
  const tabStats = { knowledge: menu?.lessonCount ?? 0, quiz: 0, interview: 0, casestudy: 0 };
  const routeParams = new URLSearchParams(search);
  const chapterSlug = routeParams.get('chapter') ?? routeParams.get('category');
  const sectionSlug = routeParams.get('lesson') ?? routeParams.get('section');
  const changeTab = (tab: ModuleTab) => {
    setActiveTab(tab);
    if (tab === 'knowledge') setVisitedKnowledge(true);
    const next = new URLSearchParams(search);
    if (tab === 'knowledge' && !next.has('chapter') && !next.has('lesson')
      && !next.has('category') && !next.has('section')) next.delete('tab');
    else next.set('tab', tab);
    navigate({ search: next.toString() ? `?${next}` : '' });
  };
  const selectKnowledge = (chapter: string | null, lesson?: string) => {
    setActiveTab('knowledge');
    setVisitedKnowledge(true);
    const next = new URLSearchParams(search);
    next.set('tab', 'knowledge');
    next.delete('category');
    next.delete('section');
    if (chapter) next.set('chapter', chapter); else next.delete('chapter');
    if (lesson) next.set('lesson', lesson); else next.delete('lesson');
    navigate({ search: `?${next}` });
  };
  const name = selected ? formatCatalogName(core?.name ?? selected.name) : '';
  const path = selected?.path?.split('/').filter(Boolean).slice(1, -1).map(formatCatalogName).join(' / ');
  const description = core?.description?.trim() || selected?.description;
  const contentTitle = language === 'vi' ? 'Nội dung đang được đồng bộ lên cơ sở dữ liệu' : 'Content will be loaded from the database';
  const contentMessage = language === 'vi'
    ? 'Quiz, Interview và Case Study chưa có API nội dung từ cơ sở dữ liệu.'
    : 'Quiz, Interview and Case Study content APIs are not available yet.';

  return (
    <main className={`learning-layout${sidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
      <ModuleSidebar
        key={topicSlug}
        nodes={catalog!.root.children}
        topicId={topicId || undefined}
        onStructureChanged={() => setReload((value) => value + 1)}
        activeModuleId={selected?.routeId ?? ''}
        enableRealModulesFilter={false}
        knowledgeCounts={knowledgeCounts}
        quizCounts={EMPTY_COUNTS}
        interviewCounts={EMPTY_COUNTS}
        caseStudyCounts={EMPTY_COUNTS}
        roadmapAvailability={EMPTY_ROADMAPS}
        contentCountsState={scopedCountsState?.status ?? 'loading'}
        onRetryContentCounts={() => {}}
      />

      {!sidebarCollapsed && (
        <button type="button" className="learning-sidebar-collapse-control"
          onClick={() => setSidebarCollapsed(true)}
          aria-label={language === 'vi' ? 'Thu gọn thanh menu' : 'Collapse sidebar'}>
          ‹
        </button>
      )}
      {sidebarCollapsed && (
        <button type="button" className="learning-sidebar-reveal"
          onClick={() => setSidebarCollapsed(false)}
          aria-label={language === 'vi' ? 'Mở thanh menu' : 'Open sidebar'}>
          ›
        </button>
      )}

      <ReadingFullscreenContext.Provider value={readingFullscreen}>
      <section ref={readingRef}
        className={`learning-main${activeTab === 'knowledge' ? ' learning-main--reading' : ''}${readingFullscreen.fullscreenMode ? ' learning-main--reading-fullscreen' : ''}${readingFullscreen.fullscreenMode === 'focus' ? ' learning-main--fullscreen-focus' : ''}`}>
        {selected ? (
          <>
            <div className="learning-main__topline">
              <div>
                {path && <span className="eyebrow">{path}</span>}
                <h1>{name}</h1>
                {description && <p className="learning-main__module-description">{description}</p>}
              </div>
              <span className="module-id-badge" title={core?.serviceName}>{selected.slug}</span>
            </div>
            {moduleCoreState?.slug === selectedSlug && moduleCoreState.status === 'error' && (
              <div className="empty-state" role="alert">
                <strong>{language === 'vi' ? 'Không thể tải thông tin Module' : 'Unable to load Module Core'}</strong>
                <span>{moduleCoreState.message}</span>
                <button type="button" className="module-core-retry"
                  onClick={() => setModuleCoreRetry((value) => value + 1)}>
                  {language === 'vi' ? 'Thử lại' : 'Retry'}
                </button>
              </div>
            )}
            {moduleCoreState?.slug === selectedSlug && moduleCoreState.status === 'missing' && (
              <div className="empty-state" role="alert">
                <strong>{language === 'vi' ? 'Không tìm thấy Module trong cơ sở dữ liệu' : 'Module not found in database'}</strong>
              </div>
            )}
            <div className="module-tab-wrapper">
              <ModuleTabs activeTab={activeTab} stats={tabStats} referenceEnabled={true}
                executionEnabled={false} onChange={changeTab} />
            </div>
            <div className="learning-content">
              {activeTab === 'overview' ? (
                <div className="learning-tab-panel" role="tabpanel" aria-label="Overview">
                  <DatabaseOverviewPanel key={selected.slug} moduleSlug={selected.slug!} />
                </div>
              ) : activeTab === 'roadmap' ? (
                <div className="learning-tab-panel" role="tabpanel" aria-label="Roadmap">
                  <RoadmapPanel key={selected.slug} moduleId={selected.slug!}
                    moduleSlug={selected.slug!} moduleName={name} searchQuery="" />
                </div>
              ) : activeTab === 'reference' ? (
                <div className="learning-tab-panel" role="tabpanel" aria-label="Reference">
                  <ReferencePanel key={selected.slug} moduleSlug={selected.slug!} searchQuery="" />
                </div>
              ) : activeTab === 'feedback' ? (
                <div className="learning-tab-panel" role="tabpanel" aria-label="Feedback">
                  <section className="feedback-panel">
                    <span className="feedback-panel__eyebrow">MODULE FEEDBACK</span>
                    <h2>Feedback</h2>
                    <p>{language === 'vi' ? 'Khu vực feedback dành riêng cho module hiện tại.' : 'Feedback area for the current module.'}</p>
                  </section>
                </div>
              ) : activeTab !== 'knowledge' ? (
                <div className="learning-tab-panel" role="tabpanel" aria-label={activeTab}>
                  <div className="empty-state empty-state--large">
                    <strong>{contentTitle}</strong>
                    <span>{contentMessage}</span>
                  </div>
                </div>
              ) : null}
              {visitedKnowledge && (
                <div className={`learning-tab-panel${activeTab !== 'knowledge' ? ' learning-tab-panel--inactive' : ''}`}
                  role="tabpanel" aria-label="Knowledge" aria-hidden={activeTab !== 'knowledge'}
                  inert={activeTab !== 'knowledge'}>
                  <DatabaseKnowledgePanel key={`${selectedSlug}:${language}`}
                    moduleSlug={selectedSlug}
                    moduleName={name}
                    menu={menu}
                    loading={Boolean(selectedSlug) && (scopedMenuState === null || scopedMenuState.status === 'loading')}
                    error={scopedMenuState?.status === 'error' ? scopedMenuState.message : null}
                    onRetry={() => setMenuReload((value) => value + 1)}
                    chapterSlug={chapterSlug}
                    sectionSlug={sectionSlug}
                    onSelectChapter={(chapter) => selectKnowledge(chapter)}
                    onSelectLesson={(chapter, lesson) => selectKnowledge(chapter, lesson)}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="empty-state empty-state--large" role="status">
            <strong>{moduleSlug
              ? (language === 'vi' ? 'Không tìm thấy module theo slug' : 'Module slug not found')
              : (language === 'vi' ? 'Chưa có module trong chủ đề này' : 'No modules in this topic yet')}
            </strong>
            {moduleSlug && <span>{moduleSlug}</span>}
          </div>
        )}
      </section>
      </ReadingFullscreenContext.Provider>
    </main>
  );
}
