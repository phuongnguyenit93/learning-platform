import { BACKEND_API_BASE_URL } from './backendHealth';
import { fetchLearningTopics } from './learningCatalog';
import type { ModuleCatalog, ModuleCatalogNode } from '../types/learning';

type JsonObject = Record<string, unknown>;

function object(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Convert a backend tree into the navigation model the existing Sidebar understands.
 * Do not use backend routeId here: it is NODE_KEY, whereas web routes use SLUG.
 * Static document paths are deliberately not carried forward.
 */
function projectNode(source: unknown, seenSlugs: Set<string>, depth = 0): ModuleCatalogNode {
  if (!object(source) || depth > 64
    || !['GROUP', 'MODULE'].includes(String(source.kind))
    || typeof source.nodeKey !== 'string' || !source.nodeKey
    || typeof source.name !== 'string'
    || typeof source.slug !== 'string' || !source.slug
    || source.slug.includes('/')
    || !Array.isArray(source.children)) {
    throw new Error('Invalid topic structure node from backend.');
  }
  if (seenSlugs.has(source.slug)) throw new Error(`Duplicate module slug: ${source.slug}`);
  seenSlugs.add(source.slug);

  const children = source.children.map((child: unknown) => projectNode(child, seenSlugs, depth + 1));
  return {
    id: source.nodeKey,
    nodeKey: source.nodeKey,
    slug: source.slug,
    name: source.name,
    kind: source.kind as 'GROUP' | 'MODULE',
    ...(source.kind === 'MODULE' ? { routeId: source.slug } : {}),
    ...(typeof source.path === 'string' ? { path: source.path } : {}),
    ...(typeof source.description === 'string' ? { description: source.description } : {}),
    children,
  };
}

export async function fetchTopicStructure(topicSlug: string, signal: AbortSignal): Promise<ModuleCatalog> {
  const topics = await fetchLearningTopics(signal);
  const topic = topics.find((candidate) => candidate.slug === topicSlug);
  if (!topic) throw new Error(`Topic not found: ${topicSlug}`);

  const response = await fetch(`${BACKEND_API_BASE_URL}/topics/${topic.id}/structure`, {
    signal,
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Topic structure returned HTTP ${response.status}`);
  const data: unknown = await response.json();
  if (!object(data) || data.version !== 1 || !object(data.root)
    || data.root.kind !== 'GROUP' || !Array.isArray(data.root.children)) {
    throw new Error('Invalid topic structure response from backend.');
  }

  const seen = new Set<string>();
  return {
    version: 1,
    root: {
      id: `topic:${topic.id}`,
      name: topic.name,
      kind: 'GROUP',
      slug: topic.slug,
      description: topic.description ?? undefined,
      children: data.root.children.map((node: unknown) => projectNode(node, seen)),
    },
  };
}
