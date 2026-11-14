import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { KnowledgePanel } from '../components/KnowledgePanel';
import { InterviewPanel } from '../components/InterviewPanel';
import { CaseStudyPanel } from '../components/CaseStudyPanel';
import { LearningSearch } from '../components/LearningSearch';
import { LocalRunPanel } from '../components/LocalRunPanel';
import { ModuleSidebar } from '../components/ModuleSidebar';
import { ModuleTabs, type ModuleTab } from '../components/ModuleTabs';
import { OverviewPanel } from '../components/OverviewPanel';
import { QuizPanel } from '../components/QuizPanel';
import { getReadingScroller, ReadingFullscreenContext, useModuleReadingFullscreen } from '../components/ReadingFullscreen';
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
import { topicKnowledgePath } from '../data/topicRoutes';
import type { KnowledgeIndex, KnowledgeSectionRef, ModuleCatalog, ModuleCatalogNode } from '../types/learning';

const readingTabs = new Set<ModuleTab>(['knowledge', 'quiz', 'interview', 'casestudy']);
type AssessmentTab = 'quiz' | 'interview' | 'casestudy';
type AssessmentReturnPoint = {
  moduleId: string;
  tab: AssessmentTab;
  scrollTop: number;
  origin: HTMLButtonElement;
  originOffset: number;
};

export function LearningPage() {
  const { moduleId, topicSlug = 'java' } = useParams();
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
  const [caseStudyCounts, setCaseStudyCounts] = useState<Record<string, number>>({});
  const [countsLoad, setCountsLoad] = useState<{ language: string; status: 'loading' | 'ready' | 'error' } | null>(null);
  const [countsReload, setCountsReload] = useState(0);
  const contentCountsState = countsLoad?.language === language ? countsLoad.status : 'loading';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => window.matchMedia('(max-width: 820px)').matches,
  );
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);
  const [knowledgeError, setKnowledgeError] = useState<string | null>(null);
  const [activeKnowledgeCategory, setActiveKnowledgeCategory] = useState('all');
  const [selectedKnowledgeSection, setSelectedKnowledgeSection] = useState<string | null>(null);
  const [knowledgeNavigationRequest, setKnowledgeNavigationRequest] = useState(0);
  // Only populated by an assessment's “Related knowledge” link, never by
  // ordinary Knowledge navigation or browser history.
  const [assessmentReturn, setAssessmentReturn] = useState<AssessmentReturnPoint | null>(null);
  const pendingAssessmentRestore = useRef<AssessmentReturnPoint | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const readingFullscreen = useModuleReadingFullscreen(mainRef);
  const readingScrollPositions = useRef<Partial<Record<ModuleTab, number>>>({});
  const readingTabActive = readingTabs.has(activeTab);
  const routeSearchKey = routeSearchParams.toString();

  const navigateToRelatedKnowledge = (
    sourceTab: AssessmentTab, section: KnowledgeSectionRef, origin: HTMLButtonElement,
  ) => {
    const sourcePanel = origin.closest<HTMLElement>('.reading-fullscreen-surface');
    const scroller = getReadingScroller(sourcePanel) ?? mainRef.current;
    const scrollTop = scroller?.scrollTop ?? readingScrollPositions.current[sourceTab] ?? 0;
    readingScrollPositions.current[sourceTab] = scrollTop;
    setAssessmentReturn({
      tab: sourceTab,
      moduleId: moduleId ?? '',
      scrollTop,
      origin,
      originOffset: scroller
        ? origin.getBoundingClientRect().top - scroller.getBoundingClientRect().top
        : 0,
    });
    setSearchQuery('');
    setActiveKnowledgeCategory(section.categoryId);
    setSelectedKnowledgeSection(section.id);
    setKnowledgeNavigationRequest((current) => current + 1);
    setVisitedTabs((current) => current.has('knowledge') ? current : new Set([...current, 'knowledge']));
    setActiveTab('knowledge');
  };

  const returnToAssessment = () => {
    if (!assessmentReturn || assessmentReturn.moduleId !== (moduleId ?? '')) return;
    readingScrollPositions.current[assessmentReturn.tab] = assessmentReturn.scrollTop;
    pendingAssessmentRestore.current = assessmentReturn;
    setAssessmentReturn(null);
    setActiveTab(assessmentReturn.tab);
  };

  useLayoutEffect(() => {
    if (readingTabActive && mainRef.current) {
      const scroller = mainRef.current;
      scroller.scrollTop = readingScrollPositions.current[activeTab] ?? 0;
      const restore = pendingAssessmentRestore.current;
      if (restore?.tab === activeTab) {
        pendingAssessmentRestore.current = null;
        const sourcePanel = restore.origin.closest<HTMLElement>('.reading-fullscreen-surface');
        const sourceScroller = getReadingScroller(sourcePanel) ?? scroller;
        sourceScroller.scrollTop = restore.scrollTop;
        // The source tab stays mounted. Anchor to the exact clicked lesson
        // link even if expanding Knowledge changed the reading pane height.
        if (restore.origin.isConnected) {
          const offset = restore.origin.getBoundingClientRect().top
            - sourceScroller.getBoundingClientRect().top - restore.originOffset;
          if (Number.isFinite(offset)) sourceScroller.scrollTop += offset;
          restore.origin.focus({ preventScroll: true });
        }
        readingScrollPositions.current[activeTab] = sourceScroller.scrollTop;
      }
    }
  }, [activeTab, moduleId, readingTabActive]);

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
  const summaryPath = activeModule?.summary[language];
  const videoPath = activeModule?.video[language];
  const referencePath = activeModule?.reference?.[language];
  const quizPath = activeModule?.quiz[language];
  const interviewPath = activeModule?.interview[language];
  const caseStudyPath = activeModule?.casestudy[language];
  const displayedStats = useMemo(
    () => ({
      ...activeStats,
      knowledge: knowledgeIndex?.sectionCount ?? knowledgeCounts[activeModuleId] ?? 0,
      quiz: quizCounts[activeModuleId] ?? 0,
      interview: interviewCounts[activeModuleId] ?? 0,
      casestudy: caseStudyCounts[activeModuleId] ?? 0,
    }),
    [activeModuleId, activeStats, interviewCounts, caseStudyCounts, knowledgeCounts, knowledgeIndex, quizCounts],
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
    setCountsLoad({ language, status: 'loading' });

    // This verified 46 KB summary replaces more than 600 simultaneous
    // Knowledge/Quiz/Interview YAML/JSON requests on every Learning entry.
    loadModuleContentCounts()
      .then(({ locales }) => {
        if (!active) return;
        const entries = Object.entries(locales[language]);
        setKnowledgeCounts(Object.fromEntries(entries.map(([id, count]) => [id, count.knowledge])));
        setQuizCounts(Object.fromEntries(entries.map(([id, count]) => [id, count.quiz])));
        setInterviewCounts(Object.fromEntries(entries.map(([id, count]) => [id, count.interview])));
        setCaseStudyCounts(Object.fromEntries(entries.map(([id, count]) => [id, count.casestudy ?? 0])));
        setCountsLoad({ language, status: 'ready' });
      })
      .catch(() => {
        // The catalog has enough metadata for sidebar fallback even if
        // the optional derived summary is temporarily unavailable.
        if (active) {
          setKnowledgeCounts({});
          setQuizCounts({});
          setInterviewCounts({});
          setCaseStudyCounts({});
          setCountsLoad({ language, status: 'error' });
        }
      });
    return () => { active = false; };
  }, [catalog, language, countsReload]);

  useEffect(() => {
    if (!catalog || !activeModuleNode?.routeId) {
      return;
    }

    if (!moduleId || !requestedModule) {
      navigate(topicKnowledgePath(topicSlug, activeModuleNode.routeId), { replace: true });
    }
  }, [activeModuleNode, catalog, moduleId, navigate, requestedModule, topicSlug]);

  useEffect(() => {
    if (!activeModule) {
      return;
    }

    setSearchQuery('');
    setActiveKnowledgeCategory('all');
    setSelectedKnowledgeSection(null);
    setAssessmentReturn(null);
    pendingAssessmentRestore.current = null;
    readingScrollPositions.current = {};
    if (mainRef.current) mainRef.current.scrollTop = 0;
    setVisitedTabs(new Set<ModuleTab>([activeTab]));
  }, [activeModule?.id]);

  useEffect(() => {
    if (!activeModule || routeSearchParams.get('tab') !== 'knowledge') {
      return;
    }

    const categoryId = routeSearchParams.get('category')?.trim() || 'all';
    const sectionId = routeSearchParams.get('section')?.trim() || null;

    setAssessmentReturn(null);
    pendingAssessmentRestore.current = null;
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
        caseStudyCounts={caseStudyCounts}
        roadmapAvailability={roadmapAvailability}
        contentCountsState={contentCountsState}
        onRetryContentCounts={() => setCountsReload((value) => value + 1)}
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

      <ReadingFullscreenContext.Provider value={readingFullscreen}>
      <section ref={mainRef} className={`learning-main${readingTabActive ? ' learning-main--reading' : ''}${readingFullscreen.fullscreenMode ? ' learning-main--reading-fullscreen' : ''}${readingFullscreen.fullscreenMode === 'focus' ? ' learning-main--fullscreen-focus' : ''}`}
        onScroll={(event) => {
          if (readingTabActive) readingScrollPositions.current[activeTab] = event.currentTarget.scrollTop;
        }}>
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
              setAssessmentReturn(null);
              pendingAssessmentRestore.current = null;
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
          {activeTab === 'overview' && (
            <div className="learning-tab-panel" role="tabpanel" aria-label="Overview">
              <OverviewPanel module={activeModule} />
            </div>
          )}
          {visitedTabs.has('roadmap') && (
            <div className={`learning-tab-panel${activeTab !== 'roadmap' ? ' learning-tab-panel--inactive' : ''}`} role="tabpanel" aria-label="Roadmap" aria-hidden={activeTab !== 'roadmap'} inert={activeTab !== 'roadmap'}>
              <RoadmapPanel
                key={`${activeModule.id}:roadmap`}
                moduleId={activeModule.id}
                moduleName={activeModule.shortName}
                searchQuery={searchQuery}
              />
            </div>
          )}
          {visitedTabs.has('reference') && (
            <div className={`learning-tab-panel${activeTab !== 'reference' ? ' learning-tab-panel--inactive' : ''}`} role="tabpanel" aria-label="Reference" aria-hidden={activeTab !== 'reference'} inert={activeTab !== 'reference'}>
              <ReferencePanel
                key={`${activeModule.id}:reference`}
                path={referencePath}
                searchQuery={searchQuery}
              />
            </div>
          )}
          {visitedTabs.has('knowledge') && (
            <div className={`learning-tab-panel${activeTab !== 'knowledge' ? ' learning-tab-panel--inactive' : ''}`} role="tabpanel" aria-label="Knowledge" aria-hidden={activeTab !== 'knowledge'} inert={activeTab !== 'knowledge'}>
              <KnowledgePanel
                moduleName={activeModule.name[language]}
                key={`${activeModule.id}:knowledge`}
                index={knowledgeIndex}
                loading={knowledgeLoading}
                error={knowledgeError}
                searchQuery={searchQuery}
                activeCategoryId={activeKnowledgeCategory}
                selectedSectionId={selectedKnowledgeSection}
                navigationRequestKey={knowledgeNavigationRequest}
                videoIndexPath={videoPath}
                summaryIndexPath={summaryPath}
                onCategoryChange={(categoryId) => {
                  setActiveKnowledgeCategory(categoryId);
                  setSelectedKnowledgeSection(null);
                }}
                onSectionChange={setSelectedKnowledgeSection}
                onNavigateToSection={(categoryId, sectionId) => {
                  setSearchQuery('');
                  setActiveKnowledgeCategory(categoryId);
                  setSelectedKnowledgeSection(sectionId);
                }}
                returnToAssessment={assessmentReturn?.moduleId === (moduleId ?? '')
                  ? assessmentReturn.tab : null}
                onReturnToAssessment={returnToAssessment}
              />
            </div>
          )}
          {visitedTabs.has('quiz') && (
            <div className={`learning-tab-panel${activeTab !== 'quiz' ? ' learning-tab-panel--inactive' : ''}`} role="tabpanel" aria-label="Quiz" aria-hidden={activeTab !== 'quiz'} inert={activeTab !== 'quiz'}>
              <QuizPanel
                moduleName={activeModule.name[language]}
                key={`${activeModule.id}:quiz`}
                path={quizPath}
                knowledgeIndex={knowledgeIndex}
                onNavigateToKnowledge={(section, origin) => navigateToRelatedKnowledge('quiz', section, origin)}
              />
            </div>
          )}
          {visitedTabs.has('interview') && (
            <div className={`learning-tab-panel${activeTab !== 'interview' ? ' learning-tab-panel--inactive' : ''}`} role="tabpanel" aria-label="Interview" aria-hidden={activeTab !== 'interview'} inert={activeTab !== 'interview'}>
              <InterviewPanel
                moduleName={activeModule.name[language]}
                key={`${activeModule.id}:interview`}
                path={interviewPath}
                knowledgeIndex={knowledgeIndex}
                onNavigateToKnowledge={(section, origin) => navigateToRelatedKnowledge('interview', section, origin)}
              />
            </div>
          )}
          {visitedTabs.has('casestudy') && (
            <div className={`learning-tab-panel${activeTab !== 'casestudy' ? ' learning-tab-panel--inactive' : ''}`} role="tabpanel" aria-label="Case Study" aria-hidden={activeTab !== 'casestudy'} inert={activeTab !== 'casestudy'}>
              <CaseStudyPanel key={`${activeModule.id}:casestudy`}
                path={caseStudyPath} explorerUrl={readyDetails?.caseStudyExplorer}
                knowledgeIndex={knowledgeIndex}
                onNavigateToKnowledge={(section, origin) => navigateToRelatedKnowledge('casestudy', section, origin)} />
            </div>
          )}
          {activeTab === 'execution' && activeModule.capabilities.execution && (
            <div className="learning-tab-panel" role="tabpanel" aria-label="Local Run">
              <LocalRunPanel
                key={`${activeModule.id}:${activeModule.sourceFingerprint}`}
                moduleId={activeModule.id}
                moduleName={activeModule.shortName}
                sourceFingerprint={activeModule.sourceFingerprint}
                moduleType={activeModuleNode?.moduleType}
              />
            </div>
          )}
          {activeTab === 'feedback' && (
            <div className="learning-tab-panel" role="tabpanel" aria-label="Feedback">
              <section className="feedback-panel">
                <span className="feedback-panel__eyebrow">MODULE FEEDBACK</span>
                <h2>Feedback</h2>
                <p>
                  {language === 'vi'
                    ? 'Khu vực feedback dành riêng cho module hiện tại.'
                    : 'Feedback area for the current module.'}
                </p>
              </section>
            </div>
          )}
          </>
          )}
        </div>
      </section>
      </ReadingFullscreenContext.Provider>
    </main>
  );
}
