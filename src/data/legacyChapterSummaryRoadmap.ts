import type { KnowledgeChapterRoadmap, KnowledgeSummaryLesson } from '../types/learning';

/** Compatibility for older Java Data Releases whose chapter section is Markdown. */
export function legacyChapterSummaryRoadmap(
  markdown: string,
  summaries: KnowledgeSummaryLesson[],
): KnowledgeChapterRoadmap | null {
  const title = /^#\s+(.+)\s*$/m.exec(markdown);
  const flow = /^##\s+1\.\s+(.+)\s*$/m.exec(markdown);
  const comparison = /^##\s+2\.\s+.+\s*$/m.exec(markdown);
  if (!title || !flow || !comparison || title.index !== 0 ||
    flow.index <= title.index || comparison.index <= flow.index) return null;

  const body = markdown.slice(flow.index + flow[0].length, comparison.index);
  const matches = [...body.matchAll(/^###\s+(?:Bài|Lesson)\s+(\d+)\s*[—–-]\s*(.+?)\s*$/gim)];
  if (matches.length !== summaries.length || !matches.length ||
    body.slice(0, matches[0].index).trim()) return null;

  const roadmap = matches.map((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? body.length) : body.length;
    const lines = body.slice(start, end).trim().split(/\r?\n/);
    const arrow = lines.findIndex((line) => /^\s*↓\s*\S/.test(line));
    const description = (arrow < 0 ? lines : lines.slice(0, arrow)).join('\n').trim();
    const connector = arrow < 0 ? null
      : lines.slice(arrow).join('\n').replace(/^\s*↓\s*/, '').trim();
    return {
      id: summaries[index]?.id ?? '',
      order: Number(match[1]),
      title: match[2].trim(),
      description,
      transition: connector && summaries[index + 1]
        ? { to: summaries[index + 1].id, description: connector } : null,
    };
  });
  if (roadmap.some((step, index) => !step.id || step.order !== index + 1 ||
    !step.title || !step.description ||
    (index < roadmap.length - 1 && !step.transition) ||
    (index === roadmap.length - 1 && step.transition))) return null;

  return {
    version: 1, type: 'LEARNING_ROADMAP', title: title[1].trim(),
    roadmapHeading: flow[1].trim(), roadmap,
    comparisonMarkdown: markdown.slice(comparison.index).trim(),
  };
}
