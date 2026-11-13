import { BACKEND_API_BASE_URL } from './backendHealth';

export interface LearningCategory {
  id: number;
  code: string;
  name: string;
  sortOrder: number;
}

export interface LearningTopic {
  id: number;
  code: string;
  slug: string;
  name: string;
  description: string | null;
  iconSvg: string;
  status: 'AVAILABLE' | 'COMING_SOON' | 'HIDDEN';
  sortOrder: number;
  category: LearningCategory;
}

export interface LearningTopicGroup {
  category: LearningCategory;
  topics: LearningTopic[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function isCategory(value: unknown): value is LearningCategory {
  if (!isRecord(value)) return false;
  return typeof value.id === 'number'
    && typeof value.code === 'string'
    && typeof value.name === 'string'
    && typeof value.sortOrder === 'number';
}

function isTopic(value: unknown): value is LearningTopic {
  if (!isRecord(value)) return false;
  return typeof value.id === 'number'
    && typeof value.code === 'string'
    && typeof value.slug === 'string'
    && typeof value.name === 'string'
    && (typeof value.description === 'string' || value.description === null)
    && typeof value.iconSvg === 'string'
    && ['AVAILABLE', 'COMING_SOON', 'HIDDEN'].includes(String(value.status))
    && typeof value.sortOrder === 'number'
    && isCategory(value.category);
}

async function fetchList<T>(
  endpoint: string,
  signal: AbortSignal,
  isItem: (value: unknown) => value is T,
): Promise<T[]> {
  const response = await fetch(`${BACKEND_API_BASE_URL}/${endpoint}`, {
    signal,
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Catalog ${endpoint} returned HTTP ${response.status}`);
  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isItem)) {
    throw new Error(`Invalid catalog ${endpoint} response`);
  }
  return data;
}

export async function fetchLearningCatalog(signal: AbortSignal): Promise<LearningTopicGroup[]> {
  const [categories, topics] = await Promise.all([
    fetchList('categories', signal, isCategory),
    fetchList('topics', signal, isTopic),
  ]);

  const orderBySortAndId = <T extends { sortOrder: number; id: number }>(a: T, b: T) =>
    a.sortOrder - b.sortOrder || a.id - b.id;

  // Category API is authoritative for active groups. A hidden/inactive topic
  // never creates an extra section even if its embedded category is present.
  return [...categories]
    .sort(orderBySortAndId)
    .map((category) => ({
      category,
      topics: topics
        .filter((topic) => topic.category.id === category.id && topic.status !== 'HIDDEN')
        .sort(orderBySortAndId),
    }))
    .filter((group) => group.topics.length > 0);
}

/** Resolve a topic slug to its database ID without fetching category metadata. */
export function fetchLearningTopics(signal: AbortSignal): Promise<LearningTopic[]> {
  return fetchList('topics', signal, isTopic);
}
