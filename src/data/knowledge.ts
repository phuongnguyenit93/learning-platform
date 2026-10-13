import type {
  KnowledgeCategoryNode,
  KnowledgeIndex,
  KnowledgeSectionRef,
  KnowledgeTreeNode,
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

export function collectKnowledgeSections(nodes: KnowledgeTreeNode[]): KnowledgeSectionRef[] {
  return collectKnowledgeCategories(nodes).flatMap((category) =>
    category.sections.map((section) => ({
      ...section,
      categoryId: category.id,
      categoryTitle: category.title,
      sourcePath: category.sourcePath,
    })),
  );
}
