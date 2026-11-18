import { BACKEND_API_BASE_URL } from './backendHealth';

export interface ModuleCore {
  id: number;
  serviceName: string;
  slug: string;
  name: string;
  description: string | null;
  specialNote: string | null;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Fetch canonical Module metadata by its public SLUG, not NODE_KEY/SERVICE_NAME. */
export async function fetchModuleCore(
  moduleSlug: string,
  signal: AbortSignal,
): Promise<ModuleCore | null> {
  const response = await fetch(
    `${BACKEND_API_BASE_URL}/modules/${encodeURIComponent(moduleSlug)}`,
    { signal, cache: 'no-store', headers: { Accept: 'application/json' } },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Module Core returned HTTP ${response.status}`);

  const data: unknown = await response.json();
  if (!isObject(data)
    || !Number.isSafeInteger(data.id) || (data.id as number) <= 0
    || typeof data.serviceName !== 'string' || !data.serviceName.trim()
    || data.slug !== moduleSlug
    || typeof data.name !== 'string' || !data.name.trim()
    || !(data.description === null || typeof data.description === 'string')
    || !(data.specialNote === null || typeof data.specialNote === 'string')) {
    throw new Error('Invalid Module Core response from backend.');
  }
  return {
    id: data.id as number,
    serviceName: data.serviceName as string,
    slug: data.slug as string,
    name: data.name as string,
    description: data.description as string | null,
    specialNote: data.specialNote as string | null,
  };
}
