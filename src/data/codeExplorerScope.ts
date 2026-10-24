import type { ExplorerTreeNode } from './codeExplorer';

export type ExplorerTreeScope = 'PACKAGE' | 'CONTROLLER' | 'MODULE';

// Use the API's actual published Controller file, never infer a package from an
// endpoint URL. The package before /controller/ normally contains its DTOs,
// Services and other classes belonging to the same learning chapter.
export function explorerChapterPath(controllerFile: string): string {
  const segments = controllerFile.split('/');
  const controllerFolder = segments.lastIndexOf('controller');
  return segments.slice(0, controllerFolder > 0 && controllerFolder < segments.length - 1
    ? controllerFolder : -1).join('/');
}

export function isExplorerPathVisible(path: string, controllerFile: string | undefined,
  scope: ExplorerTreeScope): boolean {
  if (scope === 'MODULE' || !controllerFile) return true;
  if (scope === 'CONTROLLER') return path === controllerFile;
  const chapter = explorerChapterPath(controllerFile);
  return chapter ? path.startsWith(chapter + '/') : path === controllerFile;
}

function findTreeNode(nodes: ExplorerTreeNode[], path: string): ExplorerTreeNode | undefined {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.type === 'DIRECTORY' && path.startsWith(node.path + '/')) {
      const child = findTreeNode(node.children, path);
      if (child) return child;
    }
  }
  return undefined;
}

export function scopeExplorerTree(nodes: ExplorerTreeNode[], controllerFile: string | undefined,
  scope: ExplorerTreeScope): ExplorerTreeNode[] {
  if (scope === 'MODULE' || !controllerFile) return nodes;
  const path = scope === 'CONTROLLER' ? controllerFile : explorerChapterPath(controllerFile);
  const found = findTreeNode(nodes, path);
  // Unknown layouts still remain browsable: never accidentally return an empty explorer.
  return found ? [found] : nodes;
}

export function countExplorerTreeFiles(nodes: ExplorerTreeNode[]): number {
  return nodes.reduce((total, node) => total + (node.type === 'FILE'
    ? 1 : countExplorerTreeFiles(node.children)), 0);
}
