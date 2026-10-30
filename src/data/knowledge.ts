import type {
  KnowledgeCategoryNode,
  KnowledgeIndex,
  KnowledgeSection,
  KnowledgeSectionRef,
  KnowledgeTreeNode,
  QuizReadmeRelated,
} from '../types/learning';
import { fetchJavaAsset } from './javaAsset';

const knowledgeIndexCache = new Map<string, Promise<KnowledgeIndex>>();

export async function loadKnowledgeIndex(path: string): Promise<KnowledgeIndex> {
  const cached = knowledgeIndexCache.get(path);

  if (cached) {
    return cached;
  }

  const request = fetchJavaAsset(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load knowledge index: ${response.status} ${response.statusText}`);
      }

      return response.json() as Promise<KnowledgeIndex>;
    })
    .catch((error: unknown) => {
      knowledgeIndexCache.delete(path);
      throw error;
    });

  knowledgeIndexCache.set(path, request);

  return request;
}

export function formatKnowledgeDisplayTitle(title: string): string {
  // Numbered headings such as "1.1 OOP" must lose the whole 1.1,
  // not just "1.", which previously left a stray "1" in lesson titles.
  return title.replace(/^\s*\d+(?:\.\d+)*[.)]?\s+/, '').trim();
}

const difficultyOrder: Record<KnowledgeSection['difficulty'], number> = {
  BASIC: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
};

/** Group by learning level, preserving the original order within each level. */
export function sortKnowledgeSectionsByDifficulty<T extends KnowledgeSection>(sections: readonly T[]): T[] {
  return sections
    .map((section, originalIndex) => ({ section, originalIndex }))
    .sort((left, right) => (
      (difficultyOrder[left.section.difficulty] ?? 3) - (difficultyOrder[right.section.difficulty] ?? 3)
      || left.originalIndex - right.originalIndex
    ))
    .map(({ section }) => section);
}

export function collectKnowledgeCategories(nodes: KnowledgeTreeNode[]): KnowledgeCategoryNode[] {
  const result: KnowledgeCategoryNode[] = [];

  nodes.forEach((node) => {
    if (node.kind === 'CATEGORY') {
      result.push(node);
      return;
    }

    result.push(...collectKnowledgeCategories(node.children));
  });

  return result;
}

export function collectKnowledgeSections(
  nodes: KnowledgeTreeNode[],
  options: { sortByDifficulty?: boolean } = {},
): KnowledgeSectionRef[] {
  return collectKnowledgeCategories(nodes).flatMap((category) =>
    (options.sortByDifficulty ? sortKnowledgeSectionsByDifficulty(category.sections) : category.sections)
      .map((section) => ({
        id: section.id,
        title: section.title,
        content: section.content,
        difficulty: section.difficulty,
        categoryId: category.id,
        categoryTitle: category.title,
        sourcePath: category.sourcePath,
      })),
  );
}

/** New chapter question files only need an anchor; legacy file+anchor links still work. */
export function buildQuestionKnowledgeResolver(index: KnowledgeIndex | null, chapterId?: string) {
  if (!index) return (_related: QuizReadmeRelated): KnowledgeSectionRef | undefined => undefined;
  const chapter = index.tree.find((node) => node.id === chapterId);
  const refs = collectKnowledgeSections(chapter ? [chapter] : index.tree);
  const byKey = new Map(collectKnowledgeSections(index.tree).map((section) => [`${section.sourcePath}#${section.id}`, section]));
  const byAnchor = new Map<string, KnowledgeSectionRef | null>();
  for (const section of refs) {
    // Multiple sections can share an anchor. Never guess which article was meant.
    byAnchor.set(section.id, byAnchor.has(section.id) ? null : section);
  }
  return (related: QuizReadmeRelated): KnowledgeSectionRef | undefined => {
    if (!related.anchor) return undefined;
    if (related.file) {
      const exact = byKey.get(`${related.file}#${related.anchor}`);
      if (exact) return exact;
    }
    return byAnchor.get(related.anchor) ?? undefined;
  };
}
