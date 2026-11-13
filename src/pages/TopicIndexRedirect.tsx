import { Navigate, useLocation, useParams } from 'react-router-dom';
import { topicKnowledgePath } from '../data/topicRoutes';

export function TopicIndexRedirect() {
  const { topicSlug = 'java' } = useParams();
  const { search, hash } = useLocation();

  // The legacy /learning/MODULE_ROUTE_ID links predate topic slugs.
  // Producer module IDs are uppercase; database topic slugs use lowercase.
  const legacyModuleId = /^[A-Z][A-Z0-9_-]*$/.test(topicSlug) ? topicSlug : null;
  return <Navigate to={`${legacyModuleId
    ? topicKnowledgePath('java', legacyModuleId)
    : topicKnowledgePath(topicSlug)}${search}${hash}`} replace />;
}
