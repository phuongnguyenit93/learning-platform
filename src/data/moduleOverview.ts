import { BACKEND_API_BASE_URL } from './backendHealth';
import type { Language } from '../types/learning';

export interface ModuleOverview {
  slug: string;
  languageCode: Language;
  markdownContent: string;
}

/**
 * Fetch only the selected module's localized Markdown. A missing translation
 * is not an error and never falls back silently to another language.
 */
export async function fetchModuleOverview(
  moduleSlug: string, language: Language, signal: AbortSignal,
): Promise<ModuleOverview | null> {
  const response = await fetch(
    `${BACKEND_API_BASE_URL}/modules/${encodeURIComponent(moduleSlug)}/overview?lang=${encodeURIComponent(language)}`,
    { signal, cache: 'no-store', headers: { Accept: 'application/json' } },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Module Overview returned HTTP ${response.status}`);

  const data: unknown = await response.json();
  if (typeof data !== 'object' || data === null || Array.isArray(data)
    || !('slug' in data) || data.slug !== moduleSlug
    || !('languageCode' in data) || data.languageCode !== language
    || !('markdownContent' in data) || typeof data.markdownContent !== 'string') {
    throw new Error('Invalid Module Overview response from backend.');
  }
  return data as ModuleOverview;
}
