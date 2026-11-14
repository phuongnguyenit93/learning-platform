import { BACKEND_API_BASE_URL } from './backendHealth';
import type { Language, ReferenceDocument, ReferenceItem } from '../types/learning';

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseReference(value: unknown, index: number): ReferenceItem & { id: number; sortOrder: number } {
  if (!isObject(value)
    || !Number.isSafeInteger(value.id) || (value.id as number) <= 0
    || !Number.isInteger(value.sortOrder) || (value.sortOrder as number) < 0
    || typeof value.title !== 'string' || !value.title.trim()
    || typeof value.url !== 'string' || !value.url.trim()
    || !(value.description === null || typeof value.description === 'string')) {
    throw new Error(`Invalid Module Reference response: references[${index}].`);
  }

  // Keep the same HTTPS-only trust boundary as the Oracle YAML importer.
  let url: URL;
  try {
    url = new URL(value.url);
  } catch {
    throw new Error(`Invalid Module Reference URL at references[${index}].`);
  }
  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) {
    throw new Error(`Invalid Module Reference URL at references[${index}].`);
  }

  return {
    id: value.id as number,
    title: value.title.trim(),
    url: value.url.trim(),
    description: value.description?.trim() ?? '',
    sortOrder: value.sortOrder as number,
  };
}

/** Database-backed curated links; missing locale is 404, never YAML fallback. */
export async function fetchModuleReferences(
  moduleSlug: string, language: Language, signal: AbortSignal,
): Promise<ReferenceDocument | null> {
  const response = await fetch(
    `${BACKEND_API_BASE_URL}/modules/${encodeURIComponent(moduleSlug)}/reference?lang=${encodeURIComponent(language)}`,
    { signal, cache: 'no-store', headers: { Accept: 'application/json' } },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Module Reference returned HTTP ${response.status}`);

  const data: unknown = await response.json();
  if (!isObject(data) || data.slug !== moduleSlug || data.languageCode !== language
    || !Array.isArray(data.references)) {
    throw new Error('Invalid Module Reference response from backend.');
  }
  const references = data.references.map(parseReference);
  references.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  return {
    references: references.map(({ id: _id, sortOrder: _sortOrder, ...reference }) => reference),
  };
}
