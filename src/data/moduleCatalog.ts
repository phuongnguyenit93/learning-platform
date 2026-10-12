import type { LearningModule, ModuleCatalog, ModuleCatalogNode, ModuleStats } from '../types/learning';
import { fetchJavaAsset } from './javaAsset';

const acronymLabels: Record<string, string> = {
  aop: 'AOP',
  api: 'API',
  ci: 'CI',
  cd: 'CD',
  db: 'DB',
  elk: 'ELK',
  grpc: 'gRPC',
  iam: 'IAM',
  jvm: 'JVM',
  k8s: 'K8s',
  mq: 'MQ',
  nosql: 'NoSQL',
  oop: 'OOP',
  rdbms: 'RDBMS',
  sse: 'SSE',
  sql: 'SQL',
  ssl: 'SSL',
  tcp: 'TCP',
  tls: 'TLS',
  udp: 'UDP',
};

export async function loadModuleCatalog(): Promise<ModuleCatalog> {
  // An edge-cache miss can return a transient 500/timeout even though the
  // verified static catalog exists. Limit retries; never spin forever.
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetchJavaAsset('/module-catalog.json', {
        cache: 'default',
        signal: AbortSignal.timeout(12_000),
      });
      if (!response.ok) {
        const error = new Error(`Unable to load module catalog: ${response.status} ${response.statusText}`);
        if (response.status < 500 && response.status !== 429) throw error;
        lastError = error;
      } else {
        const catalog = await response.json() as ModuleCatalog;
        if (catalog.version !== 1 || !catalog.root || !Array.isArray(catalog.root.children)) {
          throw new Error('Invalid Java module catalog.');
        }
        return catalog;
      }
    } catch (error) {
      if (error instanceof Error && /Invalid Java module catalog/.test(error.message)) throw error;
      if (error instanceof Error && /catalog: 4\d\d/.test(error.message) && !/catalog: 429/.test(error.message)) throw error;
      lastError = error;
    }
    if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 600));
  }
  throw lastError instanceof Error ? lastError : new Error('Unable to load module catalog after retries.');
}

export function formatCatalogName(name: string): string {
  return name
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => acronymLabels[part.toLowerCase()] ?? `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

export function findModuleByRouteId(
  node: ModuleCatalogNode,
  routeId: string,
): ModuleCatalogNode | undefined {
  if (node.kind === 'MODULE' && node.routeId === routeId) {
    return node;
  }

  for (const child of node.children) {
    const match = findModuleByRouteId(child, routeId);

    if (match) {
      return match;
    }
  }

  return undefined;
}

export function collectRealModules(node: ModuleCatalogNode): ModuleCatalogNode[] {
  const result: ModuleCatalogNode[] = node.kind === 'MODULE' ? [node] : [];

  for (const child of node.children) {
    result.push(...collectRealModules(child));
  }

  return result;
}

export function toLearningModule(node: ModuleCatalogNode, stats: ModuleStats): LearningModule {
  const displayName = formatCatalogName(node.name);
  const pathParts = node.path.split('/').filter(Boolean);
  const hierarchy = pathParts.slice(1, -1).map(formatCatalogName);
  const description = node.description?.trim() || 'No module description has been provided yet.';

  return {
    id: node.routeId ?? node.serviceName ?? node.name,
    sourceFingerprint: node.sourceFingerprint ?? '',
    shortName: displayName,
    name: { vi: displayName, en: displayName },
    description: { vi: description, en: description },
    path: hierarchy,
    questionCount: stats.knowledge,
    overview: node.overview ?? {},
    knowledge: node.knowledge ?? {},
    video: node.video ?? {},
    reference: node.reference,
    quiz: node.quiz ?? {},
    interview: node.interview ?? {},
    api: node.api ?? {},
    capabilities: {
      knowledge: true,
      quiz: true,
      interview: true,
      apiDocs: true,
      // Local Run is served by this site's Cloudflare Worker/DO backend.
      // Keep hidden until production API secrets and build switches are enabled.
      execution: import.meta.env.VITE_ENABLE_LOCAL_RUN === 'true'
        && (node.moduleType === 'SERVLET' || node.moduleType === 'REACTIVE'),
      download: true,
    },
  };
}
