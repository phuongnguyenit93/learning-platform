import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ModuleSidebar } from '../components/ModuleSidebar';
import { ModuleTabs, type ModuleTab } from '../components/ModuleTabs';
import { collectRealModules, findModuleByRouteId, formatCatalogName } from '../data/moduleCatalog';
import { fetchTopicStructure } from '../data/topicStructure';
import { topicKnowledgePath } from '../data/topicRoutes';
import { useLanguage } from '../state/LanguageContext';
import type { ModuleCatalog } from '../types/learning';

type StructureState =
  | { topicSlug: string; status: 'loading' }
  | { topicSlug: string; status: 'ready'; catalog: ModuleCatalog }
  | { topicSlug: string; status: 'error'; message: string };

const EMPTY_COUNTS: Record<string, number> = {};
const EMPTY_STATS = { knowledge: 0, quiz: 0, interview: 0, casestudy: 0 };
const EMPTY_ROADMAPS: Record<string, boolean> = {};

/**
 * DB-driven navigation for every Topic. Content tabs deliberately have no
 * static Java assets: their API-backed data will be added in a later phase.
 */
export function TopicStructurePage() {
  const { topicSlug = 'java', moduleSlug } = useParams();
  const { search, hash } = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [state, setState] = useState<StructureState>({ topicSlug, status: 'loading' });
  const [reload, setReload] = useState(0);
  const [activeTab, setActiveTab] = useState<ModuleTab>('knowledge');
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

  useEffect(() => setActiveTab('knowledge'), [topicSlug, moduleSlug]);

  const catalog = state.topicSlug === topicSlug && state.status === 'ready' ? state.catalog : null;
  const modules = useMemo(() => catalog ? collectRealModules(catalog.root) : [], [catalog]);
  const selected = useMemo(() => (
    catalog && moduleSlug ? findModuleByRouteId(catalog.root, moduleSlug) : undefined
  ), [catalog, moduleSlug]);

  useEffect(() => {
    if (catalog && !moduleSlug && modules[0]?.routeId) {
      navigate(`${topicKnowledgePath(topicSlug, modules[0].routeId)}${search}${hash}`, { replace: true });
    }
  }, [catalog, moduleSlug, modules, navigate, topicSlug, search, hash]);

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

  const name = selected ? formatCatalogName(selected.name) : '';
  const path = selected?.path?.split('/').filter(Boolean).slice(1, -1).map(formatCatalogName).join(' / ');
  const contentTitle = language === 'vi' ? 'Nội dung đang được đồng bộ lên cơ sở dữ liệu' : 'Content will be loaded from the database';
  const contentMessage = language === 'vi'
    ? 'Cấu trúc module đã lấy từ API. Tài liệu, bài tập và nội dung chi tiết chưa được đồng bộ sang database.'
    : 'The navigation structure comes from the API. Lessons, exercises and details have not yet been migrated to the database.';

  return (
    <main className={`learning-layout${sidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
      <ModuleSidebar
        key={topicSlug}
        nodes={catalog!.root.children}
        activeModuleId={selected?.routeId ?? ''}
        enableRealModulesFilter={false}
        knowledgeCounts={EMPTY_COUNTS}
        quizCounts={EMPTY_COUNTS}
        interviewCounts={EMPTY_COUNTS}
        caseStudyCounts={EMPTY_COUNTS}
        roadmapAvailability={EMPTY_ROADMAPS}
        contentCountsState="ready"
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

      <section className="learning-main">
        {selected ? (
          <>
            <div className="learning-main__topline">
              <div>
                {path && <span className="eyebrow">{path}</span>}
                <h1>{name}</h1>
                {selected.description && <p className="learning-main__module-description">{selected.description}</p>}
              </div>
              <span className="module-id-badge">{selected.slug}</span>
            </div>
            <div className="module-tab-wrapper">
              <ModuleTabs activeTab={activeTab} stats={EMPTY_STATS} referenceEnabled={false}
                executionEnabled={false} onChange={setActiveTab} />
            </div>
            <div className="learning-content">
              {activeTab === 'feedback' ? (
                <div className="learning-tab-panel" role="tabpanel" aria-label="Feedback">
                  <section className="feedback-panel">
                    <span className="feedback-panel__eyebrow">MODULE FEEDBACK</span>
                    <h2>Feedback</h2>
                    <p>{language === 'vi' ? 'Khu vực feedback dành riêng cho module hiện tại.' : 'Feedback area for the current module.'}</p>
                  </section>
                </div>
              ) : (
                <div className="learning-tab-panel" role="tabpanel" aria-label={activeTab}>
                  <div className="empty-state empty-state--large">
                    <strong>{contentTitle}</strong>
                    <span>{contentMessage}</span>
                  </div>
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
    </main>
  );
}
