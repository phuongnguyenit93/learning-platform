import type { LearningModule, ModuleCatalog, ModuleCatalogNode, ModuleStats } from '../types/learning';

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
  // Fetch only the lightweight navigation tree. The large producer catalog
  // remains available to the Worker and integrity checks, not page startup.
  return loadJsonWithRetry<ModuleCatalog>('/module-navigation.json', 'module navigation', (value) =>
    value.version === 1 && !!value.root && Array.isArray(value.root.children));
}

const moduleDetailCache = new Map<string, Promise<ModuleCatalogNode>>();

export function loadModuleDetails(routeId: string): Promise<ModuleCatalogNode> {
  if (!/^[A-Z0-9][A-Z0-9_-]{0,127}$/.test(routeId)) {
    return Promise.reject(new Error('Invalid module routeId.'));
  }
  const cached = moduleDetailCache.get(routeId);
  if (cached) return cached;
  const pending = loadJsonWithRetry<ModuleCatalogNode>(
    `/module-details/${routeId}.json`, `module details ${routeId}`,
    (value) => value.kind === 'MODULE' && value.routeId === routeId,
  ).catch((error: unknown) => {
    moduleDetailCache.delete(routeId);
    throw error;
  });
  moduleDetailCache.set(routeId, pending);
  return pending;
}

async function loadJsonWithRetry<T>(
  url: string,
  label: string,
  validate: (value: T) => boolean,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        cache: 'default',
        signal: AbortSignal.timeout(12_000),
      });
      if (!response.ok) {
        const error = new Error(`Unable to load ${label}: ${response.status} ${response.statusText}`);
        if (response.status < 500 && response.status !== 429) throw error;
        lastError = error;
      } else {
        const data = await response.json() as T;
        if (!validate(data)) throw new Error(`Invalid ${label}.`);
        return data;
      }
    } catch (error) {
      if (error instanceof Error && error.message === `Invalid ${label}.`) throw error;
      if (error instanceof Error && /^Unable to load .*: 4\d\d/.test(error.message) && !error.message.includes(': 429')) throw error;
      lastError = error;
    }
    if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 600));
  }
  throw lastError instanceof Error ? lastError : new Error(`Unable to load ${label} after retries.`);
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
  const pathParts = (node.path ?? '').split('/').filter(Boolean);
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
      // Only runnable module types offer Local Run; the Worker validates again.
      execution: node.moduleType === 'SERVLET' || node.moduleType === 'REACTIVE',
      download: true,
    },
  };
}
