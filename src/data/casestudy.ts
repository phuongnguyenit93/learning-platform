import { parse } from 'yaml';
import { fetchJavaAsset } from './javaAsset';

/** Optional authored execution metadata. No runtime API requests are needed. */
export type CaseStudyDetailValue =
  | string | number | boolean
  | CaseStudyDetailValue[]
  | { [key: string]: CaseStudyDetailValue };

export interface CaseStudyObservation {
  type?: CaseStudyDetailValue;
  source?: CaseStudyDetailValue;
  program?: CaseStudyDetailValue;
  expect?: {
    keyword?: CaseStudyDetailValue;
    results?: CaseStudyDetailValue;
    conclusion?: CaseStudyDetailValue;
  };
}

export interface CaseStudyScenario {
  id: string;
  title: string;
  description?: string;
  detailDescription?: string;
  input?: CaseStudyDetailValue;
  status?: CaseStudyDetailValue;
  response?: CaseStudyDetailValue;
  observations?: CaseStudyObservation[];
}

export interface CaseStudyCodeExplanation {
  howItWorksHtml?: string;
  situations?: CaseStudyScenario[];
}

export interface CaseStudyItem {
  situation: string;
  resolve: string;
  knowledge: string;
  code: string;
  codeExplanation?: CaseStudyCodeExplanation;
}

function nonEmpty(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Invalid Case Study: ${field} must be a non-empty string.`);
  }
  return value;
}

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function optionalText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function meaningfulHtml(value: unknown): string | undefined {
  const html = optionalText(value);
  if (!html) return undefined;
  const text = html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|#0*160|#x0*a0);/gi, ' ')
    .trim();
  if (!text || /^(?:todo|tbd|n\/?a|none|placeholder)$/i.test(text)) return undefined;
  return html;
}

function detailValue(value: unknown, depth = 0): CaseStudyDetailValue | undefined {
  if (depth > 8 || value === null || value === undefined) return undefined;
  if (typeof value === 'string') return optionalText(value);
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'boolean') return value;
  if (Array.isArray(value)) {
    const items = value.map((item) => detailValue(item, depth + 1))
      .filter((item): item is CaseStudyDetailValue => item !== undefined);
    return items.length ? items : undefined;
  }
  const object = record(value);
  if (!object) return undefined;
  const entries = Object.entries(object).flatMap(([key, item]) => {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') return [];
    const parsed = detailValue(item, depth + 1);
    return parsed === undefined ? [] : [[key, parsed] as const];
  });
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function parseObservation(value: unknown): CaseStudyObservation | undefined {
  const raw = record(value);
  if (!raw) return undefined;
  const expected = record(raw.expect);
  const expect = expected && {
    keyword: detailValue(expected.keyword),
    results: detailValue(expected.results),
    conclusion: detailValue(expected.conclusion),
  };
  const observation: CaseStudyObservation = {
    type: detailValue(raw.type),
    source: detailValue(raw.source),
    program: detailValue(raw.program),
    ...(expect && Object.values(expect).some((item) => item !== undefined) ? { expect } : {}),
  };
  return observation.type !== undefined || observation.source !== undefined
    || observation.program !== undefined || observation.expect ? observation : undefined;
}

function parseCodeExplanation(value: unknown): CaseStudyCodeExplanation | undefined {
  const raw = record(value);
  if (!raw) return undefined;
  const howItWorksHtml = meaningfulHtml(raw.howItWorksHtml);
  const usedIds = new Set<string>();
  const situations: CaseStudyScenario[] = (Array.isArray(raw.situations) ? raw.situations : [])
    .flatMap((value): CaseStudyScenario[] => {
      const item = record(value);
      const id = optionalText(item?.id);
      const title = optionalText(item?.title);
      if (!item || !id || !title || usedIds.has(id)) return [];
      const observations = (Array.isArray(item.observations) ? item.observations : [])
        .map(parseObservation)
        .filter((observation): observation is CaseStudyObservation => observation !== undefined);
      const scenario: CaseStudyScenario = {
        id,
        title,
        description: meaningfulHtml(item.description),
        detailDescription: meaningfulHtml(item.detailDescription),
        input: detailValue(item.input),
        status: detailValue(item.status),
        response: detailValue(item.response),
        ...(observations.length ? { observations } : {}),
      };
      if (scenario.description === undefined && scenario.detailDescription === undefined
        && scenario.input === undefined && scenario.status === undefined
        && scenario.response === undefined && !scenario.observations) return [];
      usedIds.add(id);
      return [scenario];
    });
  if (!howItWorksHtml && !situations.length) return undefined;
  return {
    ...(howItWorksHtml ? { howItWorksHtml } : {}),
    ...(situations.length ? { situations } : {}),
  };
}

export function parseCaseStudyDocument(value: unknown): CaseStudyItem[] {
  if (!value || typeof value !== 'object' || !('cases' in value) || !Array.isArray(value.cases)) {
    throw new Error('Invalid Case Study document: cases must be an array.');
  }
  return value.cases.map((item: unknown, index: number) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid Case Study item ${index + 1}.`);
    }
    const caseItem = item as Record<string, unknown>;
    const codeExplanation = parseCodeExplanation(caseItem.codeExplanation);
    return {
      situation: nonEmpty(caseItem.situation, `cases[${index}].situation`),
      resolve: nonEmpty(caseItem.resolve, `cases[${index}].resolve`),
      knowledge: nonEmpty(caseItem.knowledge, `cases[${index}].knowledge`),
      code: nonEmpty(caseItem.code, `cases[${index}].code`),
      ...(codeExplanation ? { codeExplanation } : {}),
    };
  });
}

export async function loadCaseStudyDocument(path: string): Promise<CaseStudyItem[]> {
  const response = await fetchJavaAsset(path);
  if (!response.ok) throw new Error(`Unable to load Case Study: ${response.status} ${response.statusText}`);
  return parseCaseStudyDocument(parse(await response.text()) as unknown);
}
