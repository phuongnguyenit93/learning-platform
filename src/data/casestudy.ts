import { parse } from 'yaml';
import { fetchJavaAsset } from './javaAsset';

export interface CaseStudyItem {
  situation: string;
  resolve: string;
  knowledge: string;
  code: string;
}

function nonEmpty(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Invalid Case Study: ${field} must be a non-empty string.`);
  }
  return value;
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
    return {
      situation: nonEmpty(caseItem.situation, `cases[${index}].situation`),
      resolve: nonEmpty(caseItem.resolve, `cases[${index}].resolve`),
      knowledge: nonEmpty(caseItem.knowledge, `cases[${index}].knowledge`),
      code: nonEmpty(caseItem.code, `cases[${index}].code`),
    };
  });
}

export async function loadCaseStudyDocument(path: string): Promise<CaseStudyItem[]> {
  const response = await fetchJavaAsset(path);
  if (!response.ok) throw new Error(`Unable to load Case Study: ${response.status} ${response.statusText}`);
  return parseCaseStudyDocument(parse(await response.text()) as unknown);
}
