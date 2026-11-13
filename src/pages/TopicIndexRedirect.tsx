import { Navigate, useLocation, useParams } from 'react-router-dom';
import { topicKnowledgePath } from '../data/topicRoutes';

export function TopicIndexRedirect() {
  const { topicSlug = 'java' } = useParams();
  const { search, hash } = useLocation();

  // Legacy /learning/NODE_KEY links have no reliable mapping to the new DB SLUG.
  // Send them to Java's topic entry, where the API selects the first module.
  const legacyModuleId = /^[A-Z][A-Z0-9_-]*$/.test(topicSlug) ? topicSlug : null;
  return <Navigate to={`${legacyModuleId
    ? topicKnowledgePath('java')
    : topicKnowledgePath(topicSlug)}${search}${hash}`} replace />;
}
