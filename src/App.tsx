import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Header } from './components/Header';
import { PageMetadata } from './components/PageMetadata';
import { HomePage } from './pages/HomePage';
import { LearningPage } from './pages/LearningPage';
import { JavaLearningLayout } from './pages/JavaLearningLayout';
import { LearningTopicsPage } from './pages/LearningTopicsPage';
import { ProjectPage } from './pages/ProjectPage';
import { AboutMePage } from './pages/AboutMePage';
import { SopPage } from './pages/SopPage';
import { JavaOverviewPage } from './pages/JavaOverviewPage';

function LegacyLearningRedirect() {
  const { moduleId } = useParams();
  const { search, hash } = useLocation();

  return <Navigate to={`/learning/java/knowledge/${encodeURIComponent(moduleId ?? '')}${search}${hash}`} replace />;
}

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
  const isModulePage = pathname === '/learning/java/knowledge'
    || pathname.startsWith('/learning/java/knowledge/');

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
        <Route path="/learning/java" element={<JavaLearningLayout />}>
          <Route index element={<Navigate to="knowledge" replace />} />
          <Route path="overview" element={<JavaOverviewPage />} />
          <Route path="knowledge" element={<LearningPage />} />
          <Route path="knowledge/:moduleId" element={<LearningPage />} />
        </Route>
        <Route path="/learning/:moduleId" element={<LegacyLearningRedirect />} />
        <Route path="/about-me" element={<AboutMePage />} />
        <Route path="/my-cv" element={<LegacyMyCvRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
