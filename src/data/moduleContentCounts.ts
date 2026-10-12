import type { ModuleStats } from '../types/learning';

export type ContentCountSummary = {
  version: number;
  locales: Record<'vi' | 'en', Record<string, ModuleStats>>;
};

/** One small, derived metadata file replaces hundreds of eager document reads. */
export async function loadModuleContentCounts(): Promise<ContentCountSummary> {
  const response = await fetch('/module-content-counts.json', { cache: 'default', signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`Unable to load module content counts: ${response.status}`);
  const value = await response.json() as ContentCountSummary;
  if (value.version !== 1 || !value.locales?.vi || !value.locales?.en) {
    throw new Error('Invalid module content count summary.');
  }
  return value;
}
