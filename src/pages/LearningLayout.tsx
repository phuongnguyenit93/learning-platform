import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { topicKnowledgePath, topicOverviewPath } from '../data/topicRoutes';
import { useLanguage } from '../state/LanguageContext';

export function LearningLayout() {
  const { language } = useLanguage();
  const { topicSlug = 'java' } = useParams();
  const location = useLocation();
  const [lastKnowledgePath, setLastKnowledgePath] = useState(() => topicKnowledgePath(topicSlug));
  const topicKnowledge = topicKnowledgePath(topicSlug);
  const knowledgePath = lastKnowledgePath.startsWith(`${topicKnowledge}/`)
    || lastKnowledgePath.startsWith(`${topicKnowledge}?`)
    || lastKnowledgePath.startsWith(`${topicKnowledge}#`)
    || lastKnowledgePath === topicKnowledge
    ? lastKnowledgePath
    : topicKnowledge;

  useEffect(() => {
    if (location.pathname === topicKnowledge || location.pathname.startsWith(`${topicKnowledge}/`)) {
      setLastKnowledgePath(`${location.pathname}${location.search}${location.hash}`);
    }
  }, [location.hash, location.pathname, location.search, topicKnowledge]);

  return (
    <div className="java-learning">
      <nav className="java-section-nav" aria-label={language === 'vi' ? `Điều hướng ${topicSlug}` : `${topicSlug} navigation`}>
        <NavLink className="java-section-nav__back" to="/learning">
          <span aria-hidden="true">←</span>
          {language === 'vi' ? 'Các chủ đề' : 'All topics'}
        </NavLink>

        <div className="java-section-nav__tabs">
          <NavLink
            to={topicOverviewPath(topicSlug)}
            className={({ isActive }) => `java-section-nav__tab${isActive ? ' is-active' : ''}`}
          >
            Overview
          </NavLink>
          <NavLink
            to={knowledgePath}
            className={({ isActive }) => `java-section-nav__tab${isActive ? ' is-active' : ''}`}
          >
            Knowledge
          </NavLink>
        </div>

        <span className="java-section-nav__context" aria-hidden="true">{topicSlug.toUpperCase()}</span>
      </nav>
      <Outlet />
    </div>
  );
}
