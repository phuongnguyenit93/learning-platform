import type { ModuleCatalogNode } from '../types/learning';

export interface ModuleContentCounts {
  knowledge: Record<string, number>;
  quiz: Record<string, number>;
  interview: Record<string, number>;
  casestudy?: Record<string, number>;
  api: Record<string, number>;
}

/** Real modules contain at least one counted item in the selected language. */
export function isCountedRealModule(node: ModuleCatalogNode, counts: ModuleContentCounts): boolean {
  if (node.kind !== 'MODULE' || !node.routeId) return false;
  const id = node.routeId;
  return (counts.knowledge[id] ?? 0) > 0
    || (counts.quiz[id] ?? 0) > 0
    || (counts.interview[id] ?? 0) > 0
    || (counts.casestudy?.[id] ?? 0) > 0
    || (counts.api[id] ?? 0) > 0;
}

/** Keep catalog ordering and GROUP ancestors of qualified modules. */
export function projectCountedRealModules(
  nodes: ModuleCatalogNode[],
  counts: ModuleContentCounts,
): ModuleCatalogNode[] {
  return nodes.flatMap((node) => {
    const children = projectCountedRealModules(node.children, counts);
    return isCountedRealModule(node, counts) || children.length > 0
      ? [{ ...node, children }] : [];
  });
}
