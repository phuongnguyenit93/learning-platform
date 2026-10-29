import { fetchJavaAsset } from './javaAsset';
import type { KnowledgeIndex } from '../types/learning';

export type QuestionKind = 'quiz' | 'interview' | 'casestudy';

export interface QuestionChapter {
  id: string;
  title: string;
  questionCount: number;
  path: string;
}

export interface QuestionChapterIndex {
  chapters: QuestionChapter[];
  totalQuestions: number;
  mode?: 'groups';
}

export interface ResolvedQuestionChapter extends QuestionChapter {
  documentPath: string;
}

export function questionIndexPath(path: string, kind: QuestionKind): string {
  const match = path.match(new RegExp(`^(/module/[A-Z0-9_-]+/${kind}/(?:vi|en)/)(?:question\\.yml|index\\.json)$`));
  if (!match) throw new Error(`Invalid ${kind} index path.`);
  return `${match[1]}index.json`;
}

/** Only allow one chapter below the index's own /menu/ directory. */
export function resolveQuestionChapterPath(indexPath: string, chapterPath: string): string {
  if (!/^(?:menu\/[a-zA-Z0-9][a-zA-Z0-9._-]*\/question\.yml|groups\/[1-9]\d*\.yml)$/.test(chapterPath)
    || chapterPath.split('/').some((segment) => segment === '..' || segment === '.')) {
    throw new Error(`Invalid question chapter path: ${chapterPath}`);
  }
  const base = new URL(indexPath, 'https://java-assets.invalid');
  const resolved = new URL(chapterPath, base);
  const allowedRoot = base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1);
  if (resolved.origin !== base.origin || !(resolved.pathname.startsWith(`${allowedRoot}menu/`)
    || resolved.pathname.startsWith(`${allowedRoot}groups/`))) {
    throw new Error(`Question chapter path escapes index directory: ${chapterPath}`);
  }
  return resolved.pathname;
}

export function parseQuestionChapterIndex(value: unknown, indexPath: string): {
  chapters: ResolvedQuestionChapter[];
  totalQuestions: number;
  mode: 'chapters' | 'groups';
} {
  if (!isRecord(value) || !Array.isArray(value.chapters)
    || !Number.isSafeInteger(value.totalQuestions) || (value.totalQuestions as number) < 0) {
    throw new Error('Invalid question index: chapters and totalQuestions are required.');
  }
  const chapters = value.chapters.map((chapter, index) => {
    if (!isRecord(chapter) || typeof chapter.id !== 'string' || !chapter.id.trim()
      || typeof chapter.title !== 'string' || !chapter.title.trim()
      || typeof chapter.path !== 'string'
      || !Number.isSafeInteger(chapter.questionCount) || (chapter.questionCount as number) < 0) {
      throw new Error(`Invalid question chapter at index ${index}.`);
    }
    return {
      id: chapter.id.trim(),
      title: chapter.title.trim(),
      questionCount: chapter.questionCount as number,
      path: chapter.path,
      documentPath: resolveQuestionChapterPath(indexPath, chapter.path),
    };
  });
  if (new Set(chapters.map((chapter) => chapter.id)).size !== chapters.length
    || new Set(chapters.map((chapter) => chapter.documentPath)).size !== chapters.length) {
    throw new Error('Invalid question index: chapter ids and paths must be unique.');
  }
  if (chapters.reduce((sum, chapter) => sum + chapter.questionCount, 0) !== value.totalQuestions) {
    throw new Error('Invalid question index: totalQuestions does not match chapter counts.');
  }
  if (value.mode !== undefined && value.mode !== 'groups') {
    throw new Error('Invalid question index mode.');
  }
  if (value.mode === 'groups' && chapters.some((chapter) => !chapter.path.startsWith('groups/'))) {
    throw new Error('Group index must reference group documents.');
  }
  return { chapters, totalQuestions: value.totalQuestions as number, mode: value.mode === 'groups' ? 'groups' : 'chapters' };
}

export async function loadQuestionChapterIndex(path: string, kind: QuestionKind) {
  const indexPath = questionIndexPath(path, kind);
  const response = await fetchJavaAsset(indexPath);
  if (!response.ok) {
    throw new Error(`Unable to load ${kind} index: ${response.status} ${response.statusText}`);
  }
  return parseQuestionChapterIndex(await response.json() as unknown, indexPath);
}

/** Keep published menu ordering, including chapters with zero questions. */
export function sortQuestionChapters(
  chapters: readonly ResolvedQuestionChapter[], knowledgeIndex: KnowledgeIndex | null,
): ResolvedQuestionChapter[] {
  if (!knowledgeIndex) return [...chapters];
  const order = new Map(knowledgeIndex.tree.map((chapter, index) => [chapter.id, index]));
  const menuPosition = (chapter: ResolvedQuestionChapter) =>
    order.get(chapter.id) ?? order.get(chapter.path.split('/')[1]) ?? Number.MAX_SAFE_INTEGER;
  return chapters.map((chapter, index) => ({ chapter, index }))
    .sort((left, right) => (
      menuPosition(left.chapter) - menuPosition(right.chapter)
      || left.index - right.index
    ))
    .map(({ chapter }) => chapter);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
