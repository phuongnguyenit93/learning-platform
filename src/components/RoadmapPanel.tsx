import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { topicKnowledgePath } from '../data/topicRoutes';
import { formatCatalogName } from '../data/moduleCatalog';
import { loadRoadmapDocument } from '../data/roadmap';
import { fetchModuleRoadmap } from '../data/moduleRoadmap';
import { useLanguage } from '../state/LanguageContext';
import type {
  KnowledgeCategoryNode,
  KnowledgeIndex,
  KnowledgeTreeNode,
  ModuleCatalogNode,
  RoadmapDocument,
  RoadmapRelatedModule,
} from '../types/learning';

interface RoadmapPanelProps {
  moduleId: string;
  /** When supplied, fetch data from Oracle using the public module SLUG. */
  moduleSlug?: string;
  moduleName: string;
  modules: ModuleCatalogNode[];
  knowledgeIndex: KnowledgeIndex | null;
  searchQuery: string;
  onSelectKnowledge: (categoryId: string) => void;
}

export function RoadmapPanel({
  moduleId,
  moduleSlug,
  moduleName,
  modules,
  knowledgeIndex,
  searchQuery,
  onSelectKnowledge,
}: RoadmapPanelProps) {
  const navigate = useNavigate();
  const { topicSlug = 'java' } = useParams();
  const { language } = useLanguage();
  const [retry, setRetry] = useState(0);
  // Include both source and locale so previous-module/locale content cannot
  // briefly appear while a new request is pending.
  const sourceKey = moduleSlug
    ? `db:${moduleSlug}:${language}`
    : `yaml:${moduleId}:${language}`;
  const [loaded, setLoaded] = useState<{
    sourceKey: string;
    document?: RoadmapDocument | null;
    error?: string;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const request = moduleSlug
      ? fetchModuleRoadmap(moduleSlug, language, controller.signal)
      : loadRoadmapDocument(moduleId, language);

    request
      .then((document) => {
        if (!controller.signal.aborted) setLoaded({ sourceKey, document });
      })
      .catch((caught: unknown) => {
        if (!controller.signal.aborted) setLoaded({
          sourceKey,
          error: caught instanceof Error ? caught.message : 'Unable to load Roadmap.',
        });
      });

    return () => controller.abort();
  }, [language, moduleId, moduleSlug, sourceKey, retry]);

  const current = loaded?.sourceKey === sourceKey ? loaded : null;
  const document = current?.document ?? null;
  const error = current?.error ?? null;
  const loading = !current;

  const moduleByRouteId = useMemo(
    () => new Map(
      modules
        .filter((module): module is ModuleCatalogNode & { routeId: string } => Boolean(module.routeId))
        .map((module) => [module.routeId, module]),
    ),
    [modules],
  );

  const knowledgeById = useMemo(() => {
    const result = new Map<string, KnowledgeCategoryNode>();

    const visit = (node: KnowledgeTreeNode) => {
      if (node.kind === 'CATEGORY') {
        result.set(node.id, node);
        return;
      }

      node.children.forEach(visit);
    };

    knowledgeIndex?.tree.forEach(visit);
    return result;
  }, [knowledgeIndex]);

  const milestones = useMemo(() => {
    const items = document?.roadmap ?? [];
    const query = searchQuery.trim().toLocaleLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((milestone) => {
      const relatedText = milestone.relatedModules
        .map((related) => {
          const module = moduleByRouteId.get(related.routeId);
          return `${related.label ?? ''} ${related.note ?? ''} ${module?.name ?? ''} ${module?.description ?? ''}`;
        })
        .join(' ');
      const relatedKnowledgeText = milestone.relatedKnowledge
        .map((categoryId) => `${categoryId} ${knowledgeById.get(categoryId)?.title ?? ''}`)
        .join(' ');

      return [milestone.title, milestone.purpose, ...milestone.objectives, relatedText, relatedKnowledgeText]
        .join(' ')
        .toLocaleLowerCase()
        .includes(query);
    });
  }, [document, knowledgeById, moduleByRouteId, searchQuery]);

  if (loading) {
    return (
      <div className="empty-state empty-state--large">
        <strong>{language === 'vi' ? 'Đang tải Roadmap...' : 'Loading Roadmap...'}</strong>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state empty-state--large">
        <strong>{language === 'vi' ? 'Không thể tải Roadmap' : 'Unable to load Roadmap'}</strong>
        <span>{error}</span>
        {moduleSlug && <button type="button" onClick={() => { setLoaded(null); setRetry((value) => value + 1); }}>
          {language === 'vi' ? 'Thử lại' : 'Retry'}
        </button>}
      </div>
    );
  }

  if (!document || document.roadmap.length === 0) {
    return (
      <div className="empty-state empty-state--large">
        <strong>{language === 'vi' ? 'Roadmap chưa có nội dung' : 'Roadmap content is not available yet'}</strong>
        <span>
          {language === 'vi'
            ? 'Module đã có Roadmap capability nhưng chưa có milestone để hiển thị.'
            : 'This module has Roadmap capability but does not have milestones to display yet.'}
        </span>
      </div>
    );
  }

  return (
    <section className="roadmap-panel">
      <header className="roadmap-panel__hero">
        <span className="roadmap-panel__eyebrow">
          {language === 'vi' ? 'Lộ trình học theo milestone' : 'Milestone learning journey'}
        </span>
        <h2>{moduleName} Roadmap</h2>
        <p>
          {moduleSlug
            ? (language === 'vi'
              ? 'Lộ trình học theo thứ tự milestone từ cơ sở dữ liệu.'
              : 'Follow the milestone sequence loaded from the database.')
            : (language === 'vi'
              ? 'Đi theo trục chính từ trên xuống dưới. Các card ngoài cùng là module liên quan và có thể mở trực tiếp.'
              : 'Follow the main spine from top to bottom. Outer cards are related modules and can be opened directly.')}
        </p>
      </header>

      {searchQuery.trim() && milestones.length === 0 ? (
        <div className="empty-state empty-state--large">
          <strong>{language === 'vi' ? 'Không tìm thấy milestone phù hợp' : 'No matching roadmap milestone'}</strong>
        </div>
      ) : (
        <div className="roadmap-timeline">
          {milestones.map((milestone, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';
            const relatedModules = milestone.relatedModules
              .map((related) => ({
                related,
                module: moduleByRouteId.get(related.routeId),
              }));
            const relatedKnowledge = milestone.relatedKnowledge.map((categoryId) => ({
              categoryId,
              category: knowledgeById.get(categoryId),
            }));
            const knowledgeSide = side === 'left' ? 'right' : 'left';

            return (
              <article
                key={milestone.id}
                className={`roadmap-step roadmap-step--${side} roadmap-step--tone-${(index % 10) + 1}${relatedKnowledge.length > 0 ? ' has-related-knowledge' : ''}`}
              >
                <div className={`roadmap-step__side roadmap-step__side--${side}`}>
                  {side === 'left' && relatedModules.length > 0 && (
                    <RelatedModules
                      items={relatedModules}
                      language={language}
                      onNavigate={(routeId) => navigate(topicKnowledgePath(topicSlug, routeId))}
                    />
                  )}

                  <MilestoneCard
                    title={milestone.title}
                    purpose={milestone.purpose}
                    objectives={milestone.objectives}
                  />

                  {side === 'right' && relatedModules.length > 0 && (
                    <RelatedModules
                      items={relatedModules}
                      language={language}
                      onNavigate={(routeId) => navigate(topicKnowledgePath(topicSlug, routeId))}
                    />
                  )}
                </div>

                <div className="roadmap-step__marker-control">
                  <div
                    className={`roadmap-step__marker${relatedKnowledge.length > 0 ? ' has-related-knowledge' : ''}`}
                    aria-label={`Milestone ${index + 1}`}
                  >
                    <span>{index + 1}</span>
                  </div>
                </div>

                {relatedKnowledge.length > 0 && (
                  <div className={`roadmap-step__knowledge roadmap-step__knowledge--${knowledgeSide}`}>
                    <RelatedKnowledge
                      items={relatedKnowledge}
                      language={language}
                      onSelectKnowledge={onSelectKnowledge}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function RelatedKnowledge({
  items,
  language,
  onSelectKnowledge,
}: {
  items: Array<{ categoryId: string; category?: KnowledgeCategoryNode }>;
  language: 'vi' | 'en';
  onSelectKnowledge: (categoryId: string) => void;
}) {
  return (
    <section
      className="roadmap-knowledge-inline"
      aria-label={language === 'vi' ? 'Knowledge liên quan' : 'Related Knowledge'}
    >
      <div className="roadmap-knowledge-inline__header">
        <span>{language === 'vi' ? 'Knowledge liên quan' : 'Related Knowledge'}</span>
        <small>{items.length}</small>
      </div>

      <div className="roadmap-knowledge-inline__list">
        {items.map(({ categoryId, category }) => (
          <button
            key={categoryId}
            type="button"
            className="roadmap-knowledge-inline__item"
            disabled={!category}
            onClick={() => category && onSelectKnowledge(categoryId)}
          >
            <span>
              <strong>{category?.title ?? categoryId}</strong>
              {!category && (
                <small>{language === 'vi' ? 'Chưa tìm thấy Knowledge category' : 'Knowledge category not found'}</small>
              )}
            </span>
            <span className="roadmap-knowledge-inline__count">{category?.sections.length ?? 0}</span>
            {category && <span className="roadmap-knowledge-inline__arrow">→</span>}
          </button>
        ))}
      </div>
    </section>
  );
}

function MilestoneCard({
  title,
  purpose,
  objectives,
}: {
  title: string;
  purpose: string;
  objectives: string[];
}) {
  return (
    <div className="roadmap-milestone">
      <div className="roadmap-milestone__title">{title}</div>
      <div className="roadmap-milestone__body">
        <p>{purpose}</p>
        {objectives.length > 0 && (
          <ul>
            {objectives.slice(0, 3).map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function RelatedModules({
  items,
  language,
  onNavigate,
}: {
  items: Array<{ related: RoadmapRelatedModule; module?: ModuleCatalogNode }>;
  language: 'vi' | 'en';
  onNavigate: (routeId: string) => void;
}) {
  return (
    <div className="roadmap-related" aria-label={language === 'vi' ? 'Module liên quan' : 'Related modules'}>
      {items.map(({ related, module }) => {
        const title = related.label ?? (module ? formatCatalogName(module.name) : related.routeId);
        const note = related.note ?? module?.description;
        const available = Boolean(module?.routeId);

        return (
          <button
            key={related.routeId}
            type="button"
            className="roadmap-related__card"
            disabled={!available}
            onClick={() => available && onNavigate(related.routeId)}
          >
            <span className="roadmap-related__label">
              {language === 'vi' ? 'Module liên quan' : 'Related module'}
            </span>
            <strong>{title}</strong>
            {note && <small>{note}</small>}
            {available && <span className="roadmap-related__action">{language === 'vi' ? 'Mở module →' : 'Open module →'}</span>}
          </button>
        );
      })}
    </div>
  );
}
