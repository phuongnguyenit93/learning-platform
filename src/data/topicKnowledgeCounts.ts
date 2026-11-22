import { BACKEND_API_BASE_URL } from './backendHealth';
import type { Language } from '../types/learning';

/** Published, localized lesson counts for all visible Modules of a Topic. */
export async function fetchTopicKnowledgeCounts(
  topicId: number, language: Language, signal: AbortSignal,
): Promise<Record<string, number>> {
  const response = await fetch(
    BACKEND_API_BASE_URL + '/topics/' + topicId + '/knowledge-counts?lang=' + encodeURIComponent(language),
    { signal, cache: 'no-store', headers: { Accept: 'application/json' } },
  );
  if (!response.ok) throw new Error('Topic Knowledge counts returned HTTP ' + response.status);
  const value: unknown = await response.json();
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid topic Knowledge count response.');
  }
  const data = value as Record<string, unknown>;
  if (data.languageCode !== language || !data.counts || typeof data.counts !== 'object'
    || Array.isArray(data.counts)) {
    throw new Error('Invalid topic Knowledge count response.');
  }
  const counts = Object.create(null) as Record<string, number>;
  for (const [slug, count] of Object.entries(data.counts)) {
    if (!slug || typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0) {
      throw new Error('Invalid Knowledge count for Module.');
    }
    counts[slug] = count;
  }
  return counts;
}
