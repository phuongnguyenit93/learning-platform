import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ApiDocsPanel } from '../components/ApiDocsPanel';
import { KnowledgePanel } from '../components/KnowledgePanel';
import { InterviewPanel } from '../components/InterviewPanel';
import { LearningSearch } from '../components/LearningSearch';
import { LocalRunPanel } from '../components/LocalRunPanel';
import { MenuPanel } from '../components/MenuPanel';
import { ModuleSidebar } from '../components/ModuleSidebar';
import { ModuleTabs, type ModuleTab } from '../components/ModuleTabs';
import { OverviewPanel } from '../components/OverviewPanel';
import { QuizPanel } from '../components/QuizPanel';
import { ReferencePanel } from '../components/ReferencePanel';
import { RoadmapPanel } from '../components/RoadmapPanel';
import {
  collectRealModules,
  findModuleByRouteId,
  loadModuleCatalog,
  loadModuleDetails,
  toLearningModule,
} from '../data/moduleCatalog';
import { loadModuleContentCounts } from '../data/moduleContentCounts';
import { loadKnowledgeIndex } from '../data/knowledge';
import { resolveModuleStats } from '../data/moduleStats';
import { useLanguage } from '../state/LanguageContext';
import type { KnowledgeIndex, ModuleCatalog, ModuleCatalogNode } from '../types/learning';

export function LearningPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [routeSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const [catalog, setCatalog] = useState<ModuleCatalog | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogReload, setCatalogReload] = useState(0);
  const [moduleDetails, setModuleDetails] = useState<ModuleCatalogNode | null>(null);
  const [moduleDetailError, setModuleDetailError] = useState<string | null>(null);
  const [moduleDetailReload, setModuleDetailReload] = useState(0);
  // Keep Local Run visible after a page reload, so the panel immediately
  // reconnects to the Durable Object job instead of requiring another click.
  const [activeTab, setActiveTab] = useState<ModuleTab>(
    () => routeSearchParams.get('tab') === 'execution' ? 'execution' : 'knowledge',
  );
  const [visitedTabs, setVisitedTabs] = useState<Set<ModuleTab>>(
    () => new Set<ModuleTab>([routeSearchParams.get('tab') === 'execution' ? 'execution' : 'knowledge']),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [knowledgeIndex, setKnowledgeIndex] = useState<KnowledgeIndex | null>(null);
  const [knowledgeCounts, setKnowledgeCounts] = useState<Record<string, number>>({});
  const [quizCounts, setQuizCounts] = useState<Record<string, number>>({});
  const [interviewCounts, setInterviewCounts] = useState<Record<string, number>>({});
  const [apiCounts, setApiCounts] = useState<Record<string, number>>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);
  const [knowledgeError, setKnowledgeError] = useState<string | null>(null);
  const [activeKnowledgeCategory, setActiveKnowledgeCategory] = useState('all');
  const [selectedKnowledgeSection, setSelectedKnowledgeSection] = useState<string | null>(null);
  const routeSearchKey = routeSearchParams.toString();

  useEffect(() => {
    let active = true;
    setCatalogError(null);

    loadModuleCatalog()
      .then((result) => {
        if (active) {
          setCatalog(result);
          setCatalogError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setCatalogError(error instanceof Error ? error.message : 'Unable to load module catalog.');
        }
      });

    return () => {
      active = false;
    };
  }, [catalogReload]);

  const realModules = useMemo(
    () => (catalog ? collectRealModules(catalog.root) : []),
    [catalog],
  );

  const requestedModule = useMemo(
    () => (catalog && moduleId ? findModuleByRouteId(catalog.root, moduleId) : undefined),
    [catalog, moduleId],
  );

  const activeModuleNode = requestedModule ?? realModules[0];
  const activeModuleId = activeModuleNode?.routeId ?? activeModuleNode?.serviceName ?? activeModuleNode?.name ?? '';
  const readyDetails = moduleDetails?.routeId === activeModuleId ? moduleDetails : null;
  const detailsPending = Boolean(activeModuleId && !readyDetails);
  useEffect(() => {
    let active = true;
    if (!activeModuleId) return () => { active = false; };
    setModuleDetailError(null);
    loadModuleDetails(activeModuleId)
      .then((result) => {
        if (active) {
          setModuleDetails(result);
          setModuleDetailError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) setModuleDetailError(error instanceof Error ? error.message : 'Unable to load module details.');
      });
    return () => { active = false; };
  }, [activeModuleId, moduleDetailReload]);
  const roadmapAvailability = useMemo(
    () => (catalog
      ? Object.fromEntries(
        collectRealModules(catalog.root)
          .filter((node): node is typeof node & { routeId: string } => Boolean(node.routeId && node.roadmap?.[language]))
          .map((node) => [node.routeId, true]),
      )
      : {}),
    [catalog, language],
  );
  const activeStats = useMemo(
    () => resolveModuleStats(activeModuleId),
    [activeModuleId],
  );
  const activeModule = useMemo(
    () => (activeModuleNode
      ? toLearningModule(readyDetails ?? activeModuleNode, activeStats)
      : null),
    [activeModuleNode, activeStats, readyDetails],
  );
  const knowledgePath = activeModule?.knowledge[language];
  const videoPath = activeModule?.video[language];
  const referencePath = activeModule?.reference;
  const quizPath = activeModule?.quiz[language];
  const interviewPath = activeModule?.interview[language];
  const apiPath = activeModule?.api[language];
  const displayedStats = useMemo(
    () => ({
      ...activeStats,
      knowledge: knowledgeIndex?.sectionCount ?? knowledgeCounts[activeModuleId] ?? 0,
      quiz: quizCounts[activeModuleId] ?? 0,
      interview: interviewCounts[activeModuleId] ?? 0,
      apiDocs: apiCounts[activeModuleId] ?? 0,
    }),
    [activeModuleId, activeStats, apiCounts, interviewCounts, knowledgeCounts, knowledgeIndex, quizCounts],
  );

  useEffect(() => {
    if (activeTab === 'execution' && activeModule && !activeModule.capabilities.execution) {
      setActiveTab('knowledge');
      setVisitedTabs((current) => {
        const next = new Set(current);
        next.add('knowledge');
        return next;
      });
    }
  }, [activeModule, activeTab]);

  useEffect(() => {
    if (activeTab === 'reference' && !referencePath) {
      setActiveTab('knowledge');
      setVisitedTabs((current) => {
        const next = new Set(current);
        next.add('knowledge');
        return next;
      });
    }
  }, [activeTab, referencePath]);

  useEffect(() => {
    let active = true;
    if (!catalog) return () => { active = false; };

    // This verified 46 KB summary replaces more than 600 simultaneous
    // Knowledge/Quiz/Interview YAML/JSON requests on every Learning entry.
    loadModuleContentCounts()
      .then(({ locales }) => {
        if (!active) return;
        const entries = Object.entries(locales[language]);
        setKnowledgeCounts(Object.fromEntries(entries.map(([id, count]) => [id, count.knowledge])));
        setQuizCounts(Object.fromEntries(entries.map(([id, count]) => [id, count.quiz])));
        setInterviewCounts(Object.fromEntries(entries.map(([id, count]) => [id, count.interview])));
        setApiCounts(Object.fromEntries(entries.map(([id, count]) => [id, count.apiDocs])));
      })
      .catch(() => {
        // The catalog has enough metadata for sidebar fallback even if
        // the optional derived summary is temporarily unavailable.
        if (active) {
          setKnowledgeCounts({});
          setQuizCounts({});
          setInterviewCounts({});
          setApiCounts({});
        }
      });
    return () => { active = false; };
  }, [catalog, language]);

  useEffect(() => {
    if (!catalog || !activeModuleNode?.routeId) {
      return;
    }

    if (!moduleId || !requestedModule) {
      navigate(`/learning/java/knowledge/${activeModuleNode.routeId}`, { replace: true });
    }
  }, [activeModuleNode, catalog, moduleId, navigate, requestedModule]);

  useEffect(() => {
    if (!activeModule) {
      return;
    }

    setSearchQuery('');
    setActiveKnowledgeCategory('all');
    setSelectedKnowledgeSection(null);
    setVisitedTabs(new Set<ModuleTab>([activeTab]));
  }, [activeModule?.id]);

  useEffect(() => {
    if (!activeModule || routeSearchParams.get('tab') !== 'knowledge') {
      return;
    }

    const categoryId = routeSearchParams.get('category')?.trim() || 'all';
    const sectionId = routeSearchParams.get('section')?.trim() || null;

    setSearchQuery('');
    setActiveKnowledgeCategory(categoryId);
    setSelectedKnowledgeSection(sectionId);
    setVisitedTabs((current) => {
      if (current.has('knowledge')) {
        return current;
      }

      const next = new Set(current);
      next.add('knowledge');
      return next;
    });
    setActiveTab('knowledge');
  }, [activeModule?.id, routeSearchKey]);

  useEffect(() => {
    let active = true;

    if (!knowledgePath) {
      setKnowledgeIndex(null);
      setKnowledgeLoading(false);
      setKnowledgeError(null);
      return () => {
        active = false;
      };
    }

    setKnowledgeLoading(true);
    setKnowledgeError(null);

    loadKnowledgeIndex(knowledgePath)
      .then((result) => {
        if (!active) {
          return;
        }

        setKnowledgeIndex(result);
        setKnowledgeLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setKnowledgeIndex(null);
        setKnowledgeLoading(false);
        setKnowledgeError(error instanceof Error ? error.message : 'Unable to load Knowledge.');
      });

    return () => {
      active = false;
    };
  }, [knowledgePath]);

  if (catalogError) {
    return (
      <main className="learning-layout learning-layout--status">
        <div className="empty-state empty-state--large">
          <strong>{language === 'vi' ? 'Không thể tải cấu trúc module' : 'Unable to load module structure'}</strong>
          <span>{catalogError}</span>
          <button type="button" onClick={() => setCatalogReload((value) => value + 1)}>
            {language === 'vi' ? 'Thử tải lại' : 'Retry loading'}
          </button>
        </div>
      </main>
    );
  }

  if (!catalog || !activeModule) {
    return (
      <main className="learning-layout learning-layout--status">
        <div className="empty-state empty-state--large">
          <strong>{language === 'vi' ? 'Đang tải cấu trúc module...' : 'Loading module structure...'}</strong>
        </div>
      </main>
    );
  }

  return (
    <main className={`learning-layout${sidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
      <ModuleSidebar
        nodes={catalog.root.children}
        activeModuleId={activeModule.id}
        knowledgeCounts={knowledgeCounts}
        quizCounts={quizCounts}
        interviewCounts={interviewCounts}
        apiCounts={apiCounts}
        roadmapAvailability={roadmapAvailability}
      />

      {!sidebarCollapsed && (
        <button
          type="button"
          className="learning-sidebar-collapse-control"
          onClick={() => setSidebarCollapsed(true)}
          aria-label={language === 'vi' ? 'Thu gọn thanh menu' : 'Collapse sidebar'}
          title={language === 'vi' ? 'Thu gọn thanh menu' : 'Collapse sidebar'}
        >
          ‹
        </button>
      )}

      {sidebarCollapsed && (
        <button
          type="button"
          className="learning-sidebar-reveal"
          onClick={() => setSidebarCollapsed(false)}
          aria-label={language === 'vi' ? 'Mở thanh menu' : 'Open sidebar'}
          title={language === 'vi' ? 'Mở thanh menu' : 'Open sidebar'}
        >
          ›
        </button>
      )}

      <section className="learning-main">
        <div className="learning-main__topline">
          <div>
            <span className="eyebrow">{activeModule.path.join(' / ')}</span>
            <h1>{activeModule.name[language]}</h1>
            <p className="learning-main__module-description">{activeModule.description[language]}</p>
          </div>
          <span className="module-id-badge">{activeModule.id}</span>
        </div>

        <LearningSearch value={searchQuery} onChange={setSearchQuery} />

        <div className="module-tab-wrapper">
          <ModuleTabs
            activeTab={activeTab}
            stats={displayedStats}
            referenceEnabled={Boolean(referencePath)}
            executionEnabled={activeModule.capabilities.execution}
            onChange={(tab) => {
              setActiveTab(tab);
              if (tab === 'execution' || routeSearchParams.get('tab') === 'execution') {
                const next = new URLSearchParams(routeSearchParams);
                if (tab === 'execution') next.set('tab', 'execution');
                else next.delete('tab');
                navigate({ search: next.toString() ? `?${next}` : '' }, { replace: true });
              }
              setVisitedTabs((current) => {
                if (current.has(tab)) {
                  return current;
                }

                const next = new Set(current);
                next.add(tab);
                return next;
              });
            }}
          />
        </div>

        <div className="learning-content">
          {detailsPending ? (
            <div className="empty-state empty-state--large">
              <strong>
                {moduleDetailError
                  ? (language === 'vi' ? 'Không thể tải chi tiết module' : 'Unable to load module details')
                  : (language === 'vi' ? 'Đang tải nội dung module...' : 'Loading module content...')}
              </strong>
              {moduleDetailError && (
                <>
                  <span>{moduleDetailError}</span>
                  <button type="button" onClick={() => setModuleDetailReload((value) => value + 1)}>
                    {language === 'vi' ? 'Thử tải lại' : 'Retry loading'}
                  </button>
                </>
              )}
            </div>
          ) : (
          <>
          {activeTab === 'overview' && <OverviewPanel module={activeModule} />}
          {visitedTabs.has('menu') && (
            <div hidden={activeTab !== 'menu'}>
              <MenuPanel
                key={`${activeModule.id}:menu`}
                index={knowledgeIndex}
                loading={knowledgeLoading}
                error={knowledgeError}
                searchQuery={searchQuery}
                selectedSectionId={selectedKnowledgeSection}
                onSelectSection={(categoryId, sectionId) => {
                  setSearchQuery('');
                  setActiveKnowledgeCategory(categoryId);
                  setSelectedKnowledgeSection(sectionId);
                  setVisitedTabs((current) => {
                    const next = new Set(current);
                    next.add('knowledge');
                    return next;
                  });
                  setActiveTab('knowledge');
                }}
              />
            </div>
          )}
          {visitedTabs.has('roadmap') && (
            <div hidden={activeTab !== 'roadmap'}>
              <RoadmapPanel
                key={`${activeModule.id}:roadmap`}
                moduleId={activeModule.id}
                moduleName={activeModule.shortName}
                modules={realModules}
                knowledgeIndex={knowledgeIndex}
                searchQuery={searchQuery}
                onSelectKnowledge={(categoryId) => {
                  setSearchQuery('');
                  setActiveKnowledgeCategory(categoryId);
                  setSelectedKnowledgeSection(null);
                  setVisitedTabs((current) => {
                    const next = new Set(current);
                    next.add('knowledge');
                    return next;
                  });
                  setActiveTab('knowledge');
                }}
              />
            </div>
          )}
          {visitedTabs.has('reference') && (
            <div hidden={activeTab !== 'reference'}>
              <ReferencePanel
                key={`${activeModule.id}:reference`}
                path={referencePath}
                searchQuery={searchQuery}
              />
            </div>
          )}
          {visitedTabs.has('knowledge') && (
            <div hidden={activeTab !== 'knowledge'}>
              <KnowledgePanel
                key={`${activeModule.id}:knowledge`}
                index={knowledgeIndex}
                loading={knowledgeLoading}
                error={knowledgeError}
                searchQuery={searchQuery}
                activeCategoryId={activeKnowledgeCategory}
                selectedSectionId={selectedKnowledgeSection}
                apiBasePath={apiPath}
                videoIndexPath={videoPath}
                onCategoryChange={(categoryId) => {
                  setActiveKnowledgeCategory(categoryId);
                  setSelectedKnowledgeSection(null);
                }}
                onSectionChange={setSelectedKnowledgeSection}
              />
            </div>
          )}
          {visitedTabs.has('quiz') && (
            <div hidden={activeTab !== 'quiz'}>
              <QuizPanel
                key={`${activeModule.id}:quiz`}
                path={quizPath}
                knowledgeIndex={knowledgeIndex}
                apiBasePath={apiPath}
              />
            </div>
          )}
          {visitedTabs.has('interview') && (
            <div hidden={activeTab !== 'interview'}>
              <InterviewPanel
                key={`${activeModule.id}:interview`}
                path={interviewPath}
                knowledgeIndex={knowledgeIndex}
                apiBasePath={apiPath}
              />
            </div>
          )}
          {visitedTabs.has('api') && (
            <div hidden={activeTab !== 'api'}>
              <ApiDocsPanel
                key={`${activeModule.id}:api`}
                basePath={apiPath}
                knowledgeIndex={knowledgeIndex}
                searchQuery={searchQuery}
                onDownload={() => {
                  if (!activeModule.capabilities.execution) {
                    return;
                  }

                  setVisitedTabs((current) => {
                    const next = new Set(current);
                    next.add('execution');
                    return next;
                  });
                  setActiveTab('execution');
                  const next = new URLSearchParams(routeSearchParams);
                  next.set('tab', 'execution');
                  navigate({ search: `?${next}` }, { replace: true });
                }}
              />
            </div>
          )}
          {activeTab === 'execution' && activeModule.capabilities.execution && (
            <LocalRunPanel
              key={`${activeModule.id}:${activeModule.sourceFingerprint}`}
              moduleId={activeModule.id}
              moduleName={activeModule.shortName}
              sourceFingerprint={activeModule.sourceFingerprint}
            />
          )}
          {activeTab === 'feedback' && (
            <section className="feedback-panel">
              <span className="feedback-panel__eyebrow">MODULE FEEDBACK</span>
              <h2>Feedback</h2>
              <p>
                {language === 'vi'
                  ? 'Khu vực feedback dành riêng cho module hiện tại.'
                  : 'Feedback area for the current module.'}
              </p>
            </section>
          )}
          </>
          )}
        </div>
      </section>
    </main>
  );
}
