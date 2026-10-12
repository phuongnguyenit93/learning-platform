import type { WorkerEnv } from '../types';
import { LocalRunError } from './types';

interface CatalogNode {
  kind?: string;
  routeId?: string;
  serviceName?: string;
  moduleType?: string;
  sourceFingerprint?: string;
  children?: CatalogNode[];
}

function findModule(node: CatalogNode, moduleId: string): CatalogNode | undefined {
  if (node.kind === 'MODULE' && (node.routeId === moduleId || node.serviceName === moduleId)) {
    return node;
  }
  for (const child of node.children ?? []) {
    const match = findModule(child, moduleId);
    if (match) return match;
  }
  return undefined;
}

export async function validatePublishedModule(
  env: Pick<WorkerEnv, 'ASSETS'>,
  requestUrl: string,
  moduleId: string,
  fingerprint: string,
): Promise<void> {
  const url = new URL('/language/java/module-catalog.json', requestUrl);
  const response = await env.ASSETS.fetch(new Request(url, { headers: { accept: 'application/json' } }));
  if (!response.ok || !response.headers.get('content-type')?.includes('json')) {
    throw new LocalRunError(503, 'Published module catalog is currently unavailable.');
  }
  let catalog: { root?: CatalogNode };
  try {
    catalog = await response.json() as { root?: CatalogNode };
  } catch {
    throw new LocalRunError(503, 'Published module catalog is invalid.');
  }
  if (!catalog?.root) throw new LocalRunError(503, 'Published module catalog is incomplete.');

  const module = findModule(catalog.root, moduleId);
  if (!module || !['SERVLET', 'REACTIVE'].includes(module.moduleType ?? '')) {
    throw new LocalRunError(404, 'Runnable module was not found in the published catalog.');
  }
  if (module.sourceFingerprint !== fingerprint) {
    throw new LocalRunError(409, 'Module source version has changed; refresh the page before building.');
  }
}
