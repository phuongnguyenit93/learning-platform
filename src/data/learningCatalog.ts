import { BACKEND_API_BASE_URL } from './backendHealth';
import { getAuthCsrf } from './auth';

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
  iconSvg: string | null;
  status: 'AVAILABLE' | 'COMING_SOON' | 'HIDDEN';
  sortOrder: number;
  category: LearningCategory;
}

export interface LearningTopicGroup {
  category: LearningCategory;
  topics: LearningTopic[];
}

export interface AdminLearningCategory extends LearningCategory {
  active: boolean;
}

export interface CategoryMutation {
  code: string;
  name: string;
}

export interface TopicMutation {
  code: string;
  slug: string;
  name: string;
  description: string;
  /** Optional for existing API consumers; newly created topics start COMING_SOON. */
  status?: LearningTopic['status'];
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
    && (typeof value.iconSvg === 'string' || value.iconSvg === null)
    && ['AVAILABLE', 'COMING_SOON', 'HIDDEN'].includes(String(value.status))
    && typeof value.sortOrder === 'number'
    && isCategory(value.category);
}

async function fetchList<T>(
  endpoint: string,
  signal: AbortSignal,
  isItem: (value: unknown) => value is T,
  admin = false,
): Promise<T[]> {
  const apiRoot = admin ? `${new URL(BACKEND_API_BASE_URL).origin}/api/admin` : BACKEND_API_BASE_URL;
  const response = await fetch(`${apiRoot}/${endpoint}`, {
    signal,
    cache: 'no-store',
    headers: { Accept: 'application/json' },
    ...(admin ? { credentials: 'include' as const } : {}),
  });
  if (!response.ok) throw new Error(`Catalog ${endpoint} returned HTTP ${response.status}`);
  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isItem)) {
    throw new Error(`Invalid catalog ${endpoint} response`);
  }
  return data;
}

export async function fetchLearningCatalog(signal: AbortSignal, admin = false): Promise<LearningTopicGroup[]> {
  const [categories, topics] = await Promise.all([
    fetchList('categories', signal, admin
      ? (value): value is LearningCategory => isCategory(value) && isRecord(value) && typeof value.active === 'boolean'
      : isCategory, admin),
    fetchList('topics', signal, isTopic, admin),
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
        .filter((topic) => topic.category.id === category.id && (admin || topic.status !== 'HIDDEN'))
        .sort(orderBySortAndId),
    }))
    .filter((group) => admin || group.topics.length > 0);
}

async function adminMutation<T>(endpoint: string, method: 'POST' | 'PUT', body: object): Promise<T> {
  const csrf = await getAuthCsrf();
  const response = await fetch(`${new URL(BACKEND_API_BASE_URL).origin}/api/admin/${endpoint}`, {
    method,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      [csrf.headerName]: csrf.token,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    if (response.status === 403 || response.status === 401) {
      throw new Error('Bạn không còn quyền ADMIN hoặc phiên đăng nhập đã hết hạn.');
    }
    if (response.status === 409) {
      throw new Error('CODE hoặc SLUG đã tồn tại. Hãy chọn giá trị khác.');
    }
    if (response.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Kiểm tra lại CODE, SLUG và độ dài các trường.');
    }
    throw new Error(`Không lưu được dữ liệu (HTTP ${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export const createCategory = (payload: CategoryMutation) =>
  adminMutation<AdminLearningCategory>('categories', 'POST', payload);

export const updateCategory = (id: number, payload: CategoryMutation) =>
  adminMutation<AdminLearningCategory>(`categories/${id}`, 'PUT', payload);

export const createTopic = (categoryId: number, payload: TopicMutation) =>
  adminMutation<LearningTopic>(`categories/${categoryId}/topics`, 'POST', payload);

export const updateTopic = (id: number, payload: TopicMutation) =>
  adminMutation<LearningTopic>(`topics/${id}`, 'PUT', payload);

/** Resolve a topic slug to its database ID without fetching category metadata. */
export function fetchLearningTopics(signal: AbortSignal): Promise<LearningTopic[]> {
  return fetchList('topics', signal, isTopic);
}
