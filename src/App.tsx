import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { AiChatWidget } from './components/AiChatWidget';
import { PageMetadata } from './components/PageMetadata';
import { HomePage } from './pages/HomePage';
import { TopicStructurePage } from './pages/TopicStructurePage';
import { LearningLayout } from './pages/LearningLayout';
import { LearningTopicsPage } from './pages/LearningTopicsPage';
import { ProjectPage } from './pages/ProjectPage';
import { AboutMePage } from './pages/AboutMePage';
import { SopPage } from './pages/SopPage';
import { OverviewPage } from './pages/OverviewPage';
import { isTopicKnowledgePath } from './data/topicRoutes';
import { TopicIndexRedirect } from './pages/TopicIndexRedirect';

function LegacyMyCvRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={`/about-me${search}${hash}`} replace />;
}

function LegacyJavaProjectRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={`/project${search}${hash}`} replace />;
}

export function App() {
  const { pathname } = useLocation();
  const isModulePage = isTopicKnowledgePath(pathname);

  return (
    <div className={`app-shell${isModulePage ? ' app-shell--module-viewport' : ''}`}>
      <PageMetadata />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learning" element={<LearningTopicsPage />} />
        <Route path="/sop" element={<SopPage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/learning/java/project" element={<LegacyJavaProjectRedirect />} />
        <Route path="/learning/:topicSlug" element={<LearningLayout />}>
          <Route index element={<TopicIndexRedirect />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="knowledge" element={<TopicStructurePage />} />
          <Route path="knowledge/:moduleSlug" element={<TopicStructurePage />} />
        </Route>
        <Route path="/about-me" element={<AboutMePage />} />
        <Route path="/my-cv" element={<LegacyMyCvRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AiChatWidget />
    </div>
  );
}
