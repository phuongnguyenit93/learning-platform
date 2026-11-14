import { BACKEND_API_BASE_URL } from './backendHealth';
import type { Language, RoadmapDocument, RoadmapMilestone } from '../types/learning';

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonBlank(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Invalid Module Roadmap response: ${field} must be a nonblank string.`);
  }
  return value.trim();
}

function parseMilestone(value: unknown, index: number): RoadmapMilestone & { sortOrder: number } {
  if (!isObject(value)
    || !Number.isSafeInteger(value.id) || (value.id as number) <= 0
    || !Number.isInteger(value.sortOrder) || (value.sortOrder as number) < 0
    || !Array.isArray(value.objectives)
    || !value.objectives.every((objective: unknown) => typeof objective === 'string' && !!objective.trim())) {
    throw new Error(`Invalid Module Roadmap response: roadmap[${index}].`);
  }
  // The Oracle table has no milestone business key or related-entity links.
  // Never invent links to Knowledge or other modules.
  return {
    id: `db-${value.id}`,
    title: nonBlank(value.title, `roadmap[${index}].title`),
    purpose: nonBlank(value.purpose, `roadmap[${index}].purpose`),
    objectives: (value.objectives as string[]).map((objective) => objective.trim()),
    dependsOn: [],
    relatedKnowledge: [],
    relatedModules: [],
    sortOrder: value.sortOrder as number,
  };
}

/** Database-backed milestone content for the active module and language only. */
export async function fetchModuleRoadmap(
  moduleSlug: string, language: Language, signal: AbortSignal,
): Promise<RoadmapDocument | null> {
  const response = await fetch(
    `${BACKEND_API_BASE_URL}/modules/${encodeURIComponent(moduleSlug)}/roadmap?lang=${encodeURIComponent(language)}`,
    { signal, cache: 'no-store', headers: { Accept: 'application/json' } },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Module Roadmap returned HTTP ${response.status}`);

  const data: unknown = await response.json();
  if (!isObject(data) || data.slug !== moduleSlug || data.languageCode !== language
    || !Array.isArray(data.roadmap)) {
    throw new Error('Invalid Module Roadmap response from backend.');
  }
  const milestones = data.roadmap.map(parseMilestone);
  milestones.sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id, undefined, { numeric: true }));
  return {
    roadmap: milestones.map(({ sortOrder: _sortOrder, ...milestone }) => milestone),
  };
}
