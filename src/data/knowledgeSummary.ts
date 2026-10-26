import { fetchJavaAsset } from './javaAsset';
import type { KnowledgeSummaryChapter, KnowledgeSummaryIndex } from '../types/learning';

const indexCache = new Map<string, Promise<KnowledgeSummaryIndex>>();
const chapterCache = new Map<string, Promise<KnowledgeSummaryChapter>>();

function validIndex(value: KnowledgeSummaryIndex): boolean {
  return value?.version === 1 && typeof value.moduleId === 'string'
    && Array.isArray(value.items)
    && value.items.every((item) => (
      typeof item.categoryId === 'string' && typeof item.content === 'string'
      && item.content.startsWith('/module/') && item.content.endsWith('/summary.json')
    ));
}

function validChapter(value: KnowledgeSummaryChapter): boolean {
  return value?.version === 1 && typeof value.categoryId === 'string'
    && typeof value.section === 'string' && Array.isArray(value.summaries)
    && value.summaries.every((item) => (
      typeof item.id === 'string' && typeof item.title === 'string'
      && typeof item.summary === 'string'
    ));
}

function loadCached<T>(
  path: string,
  cache: Map<string, Promise<T>>,
  validate: (value: T) => boolean,
): Promise<T> {
  const cached = cache.get(path);
  if (cached) return cached;
  const pending = fetchJavaAsset(path)
    .then(async (response) => {
      if (!response.ok) throw new Error(`Unable to load Summary: ${response.status}`);
      const value = await response.json() as T;
      if (!validate(value)) throw new Error('Invalid Summary data');
      return value;
    })
    .catch((error: unknown) => {
      cache.delete(path);
      throw error;
    });
  cache.set(path, pending);
  return pending;
}

export const loadKnowledgeSummaryIndex = (path: string): Promise<KnowledgeSummaryIndex> =>
  loadCached(path, indexCache, validIndex);

export const loadKnowledgeSummaryChapter = (path: string): Promise<KnowledgeSummaryChapter> =>
  loadCached(path, chapterCache, validChapter);
