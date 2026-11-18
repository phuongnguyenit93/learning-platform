import { BACKEND_API_BASE_URL } from './backendHealth';
import type { Language } from '../types/learning';

export type KnowledgeDifficulty = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';

export interface DatabaseMenuSection {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  sortOrder: number;
  knowledgeId: number | null;
  difficulty: KnowledgeDifficulty | null;
  available: boolean;
  hasSummary: boolean;
}

export interface DatabaseMenuChapter {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  sortOrder: number;
  lessonCount: number;
  sections: DatabaseMenuSection[];
}

export interface DatabaseModuleMenu {
  slug: string;
  languageCode: Language;
  chapters: DatabaseMenuChapter[];
  chapterCount: number;
  lessonCount: number;
}

export interface DatabaseKnowledgeLesson {
  moduleSlug: string;
  languageCode: Language;
  chapter: { id: number; slug: string; title: string; description: string | null };
  section: { id: number; slug: string; title: string; description: string | null };
  knowledgeId: number;
  difficulty: KnowledgeDifficulty;
  markdownContent: string;
  summary: string | null;
  focus: string | null;
  problemSolved: string | null;
  mechanism: string | null;
  applicationValue: string | null;
}

export interface DatabaseChapterInsightLesson {
  id: number;
  slug: string;
  title: string;
  sortOrder: number;
  knowledgeId: number;
  difficulty: KnowledgeDifficulty;
  focus: string | null;
  problemSolved: string | null;
  mechanism: string | null;
  applicationValue: string | null;
}

export interface DatabaseChapterInsights {
  moduleSlug: string;
  languageCode: Language;
  chapter: DatabaseKnowledgeLesson['chapter'];
  lessons: DatabaseChapterInsightLesson[];
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function id(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

function order(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value);
}

function text(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function nullableText(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function difficulty(value: unknown): value is KnowledgeDifficulty {
  return value === 'BASIC' || value === 'INTERMEDIATE' || value === 'ADVANCED';
}

function identity(value: unknown): value is DatabaseKnowledgeLesson['section'] {
  return object(value) && id(value.id) && text(value.slug) && text(value.title)
    && nullableText(value.description);
}

function validSection(value: unknown): value is DatabaseMenuSection {
  return object(value) && id(value.id) && text(value.slug) && text(value.title)
    && nullableText(value.description) && order(value.sortOrder)
    && (value.knowledgeId === null || id(value.knowledgeId))
    && (value.difficulty === null || difficulty(value.difficulty))
    && typeof value.available === 'boolean' && typeof value.hasSummary === 'boolean'
    && (!value.available || (id(value.knowledgeId) && difficulty(value.difficulty)));
}

function validChapter(value: unknown): value is DatabaseMenuChapter {
  return object(value) && id(value.id) && text(value.slug) && text(value.title)
    && nullableText(value.description) && order(value.sortOrder)
    && Array.isArray(value.sections) && value.sections.every(validSection)
    && (value.lessonCount === undefined || (order(value.lessonCount) && (value.lessonCount as number) >= 0));
}

function sorted<T extends { id: number; sortOrder: number }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}

/** Metadata only: never request lesson CLOBs while rendering module navigation. */
export async function fetchModuleMenu(
  moduleSlug: string, language: Language, signal: AbortSignal,
): Promise<DatabaseModuleMenu | null> {
  const response = await fetch(
    `${BACKEND_API_BASE_URL}/modules/${encodeURIComponent(moduleSlug)}/menu?lang=${encodeURIComponent(language)}`,
    { signal, cache: 'no-store', headers: { Accept: 'application/json' } },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Module Menu returned HTTP ${response.status}`);
  const value: unknown = await response.json();
  if (!object(value) || value.slug !== moduleSlug || value.languageCode !== language
    || !Array.isArray(value.chapters) || !value.chapters.every(validChapter)) {
    throw new Error('Invalid Module Menu response from backend.');
  }

  const chapters = sorted(value.chapters as DatabaseMenuChapter[]).map((chapter) => ({
    ...chapter,
    sections: sorted(chapter.sections),
    lessonCount: chapter.lessonCount ?? chapter.sections.filter((section) => section.available).length,
  }));
  // Chapter slug uniqueness is module-scoped; section slugs are scoped to a chapter.
  const chapterSlugs = new Set<string>();
  for (const chapter of chapters) {
    const key = chapter.slug.toLowerCase();
    if (chapterSlugs.has(key)) throw new Error('Invalid Module Menu: duplicate chapter slug.');
    chapterSlugs.add(key);
    const sectionSlugs = new Set<string>();
    for (const section of chapter.sections) {
      const sectionKey = section.slug.toLowerCase();
      if (sectionSlugs.has(sectionKey)) throw new Error('Invalid Module Menu: duplicate section slug.');
      sectionSlugs.add(sectionKey);
    }
  }
  const lessonCount = chapters.reduce((sum, chapter) =>
    sum + chapter.sections.filter((section) => section.available).length, 0);
  return {
    slug: moduleSlug,
    languageCode: language,
    chapters,
    chapterCount: chapters.length,
    lessonCount,
  };
}

/** One selected lesson only. Publication depends on Markdown + difficulty, not optional metadata. */
export async function fetchModuleKnowledgeLesson(
  moduleSlug: string,
  chapterSlug: string,
  sectionSlug: string,
  language: Language,
  signal: AbortSignal,
): Promise<DatabaseKnowledgeLesson | null> {
  const response = await fetch(
    `${BACKEND_API_BASE_URL}/modules/${encodeURIComponent(moduleSlug)}/knowledge/${encodeURIComponent(chapterSlug)}/${encodeURIComponent(sectionSlug)}?lang=${encodeURIComponent(language)}`,
    { signal, cache: 'no-store', headers: { Accept: 'application/json' } },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Module Knowledge returned HTTP ${response.status}`);
  const value: unknown = await response.json();
  if (!object(value) || value.moduleSlug !== moduleSlug || value.languageCode !== language
    || !identity(value.chapter) || value.chapter.slug !== chapterSlug
    || !identity(value.section) || value.section.slug !== sectionSlug
    || !id(value.knowledgeId) || !difficulty(value.difficulty)
    || !text(value.markdownContent) || !nullableText(value.summary)
    || !nullableText(value.focus) || !nullableText(value.problemSolved)
    || !nullableText(value.mechanism) || !nullableText(value.applicationValue)) {
    throw new Error('Invalid Module Knowledge response from backend.');
  }
  return value as unknown as DatabaseKnowledgeLesson;
}

/** Fetch comparison metadata for one chapter only. No Markdown/summary CLOBs. */
export async function fetchModuleChapterInsights(
  moduleSlug: string, chapterSlug: string, language: Language, signal: AbortSignal,
): Promise<DatabaseChapterInsights | null> {
  const response = await fetch(
    `${BACKEND_API_BASE_URL}/modules/${encodeURIComponent(moduleSlug)}/chapters/${encodeURIComponent(chapterSlug)}/insights?lang=${encodeURIComponent(language)}`,
    { signal, cache: 'no-store', headers: { Accept: 'application/json' } },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Chapter Insights returned HTTP ${response.status}`);
  const value: unknown = await response.json();
  if (!object(value) || value.moduleSlug !== moduleSlug || value.languageCode !== language
    || !identity(value.chapter) || value.chapter.slug !== chapterSlug
    || !Array.isArray(value.lessons) || !value.lessons.every((lesson: unknown) =>
      object(lesson) && id(lesson.id) && text(lesson.slug) && text(lesson.title)
      && order(lesson.sortOrder) && id(lesson.knowledgeId)
      && difficulty(lesson.difficulty) && nullableText(lesson.focus)
      && nullableText(lesson.problemSolved) && nullableText(lesson.mechanism)
      && nullableText(lesson.applicationValue))) {
    throw new Error('Invalid Chapter Insights response from backend.');
  }
  const seen = new Set<string>();
  const lessons = sorted(value.lessons as DatabaseChapterInsightLesson[]);
  if (lessons.some((lesson) => {
    const slug = lesson.slug.toLowerCase();
    if (seen.has(slug)) return true;
    seen.add(slug);
    return false;
  })) throw new Error('Invalid Chapter Insights: duplicate section slug.');
  return { moduleSlug, languageCode: language,
    chapter: value.chapter, lessons };
}
