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
  const section = value?.section;
  const sectionValid = typeof section === 'string' ? !!section.trim()
    : section?.version === 1 && section?.type === 'LEARNING_ROADMAP'
      && typeof section?.title === 'string' && typeof section?.roadmapHeading === 'string'
      && typeof section?.comparisonMarkdown === 'string' && Array.isArray(section?.roadmap)
      && section.roadmap.length > 0 && section.roadmap.every((step, index) => (
        typeof step?.id === 'string' && step.id === value.summaries?.[index]?.id
        && step.order === index + 1
        && typeof step.title === 'string' && typeof step.description === 'string'
        && (index === section.roadmap.length - 1 ? step.transition === null
          : step.transition?.to === section.roadmap[index + 1]?.id
            && typeof step.transition?.description === 'string')
      ));
  return value?.version === 1 && typeof value.categoryId === 'string'
    && sectionValid && Array.isArray(value.summaries)
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
