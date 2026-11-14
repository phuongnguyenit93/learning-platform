import { useEffect, useMemo, useState } from 'react';
import { loadRoadmapDocument } from '../data/roadmap';
import { fetchModuleRoadmap } from '../data/moduleRoadmap';
import { useLanguage } from '../state/LanguageContext';
import type { RoadmapDocument } from '../types/learning';

interface RoadmapPanelProps {
  moduleId: string;
  /** When supplied, fetch from Oracle using the module's public SLUG. */
  moduleSlug?: string;
  moduleName: string;
  searchQuery: string;
}

/** An ordered timeline of milestones without dependency or related-entity links. */
export function RoadmapPanel({
  moduleId,
  moduleSlug,
  moduleName,
  searchQuery,
}: RoadmapPanelProps) {
  const { language } = useLanguage();
  const [retry, setRetry] = useState(0);
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

  // When switching module or locale, never flash the previous timeline.
  const current = loaded?.sourceKey === sourceKey ? loaded : null;
  const document = current?.document ?? null;
  const error = current?.error ?? null;
  const loading = !current;

  const milestones = useMemo(() => {
    const items = document?.roadmap ?? [];
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return items;

    return items.filter((milestone) => (
      [milestone.title, milestone.purpose, ...milestone.objectives]
        .join(' ')
        .toLocaleLowerCase()
        .includes(query)
    ));
  }, [document, searchQuery]);

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
            ? 'Module chưa có milestone để hiển thị.'
            : 'This module does not have milestones to display yet.'}
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
          {language === 'vi'
            ? 'Đi theo các milestone từ trên xuống dưới theo thứ tự học.'
            : 'Follow the milestones from top to bottom in learning order.'}
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
            return (
              <article
                key={milestone.id}
                className={`roadmap-step roadmap-step--${side} roadmap-step--tone-${(index % 10) + 1}`}
              >
                <div className={`roadmap-step__side roadmap-step__side--${side}`}>
                  <MilestoneCard
                    title={milestone.title}
                    purpose={milestone.purpose}
                    objectives={milestone.objectives}
                  />
                </div>
                <div className="roadmap-step__marker-control">
                  <div className="roadmap-step__marker" aria-label={`Milestone ${index + 1}`}>
                    <span>{index + 1}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
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
