/**
 * The authored chapter summary remains Markdown. The STEP 5 chapter outline
 * has a predictable shape (one ### Bài N heading and a ↓ transition per step),
 * so it can be presented as a roadmap without changing its source or its
 * published JSON format.
 */
export interface ChapterRoadmapStep {
  number: number;
  title: string;
  description: string;
  transition: string | null;
}

export interface ChapterSummaryRoadmap {
  heading: string;
  introduction: string;
  steps: ChapterRoadmapStep[];
  comparisonMarkdown: string;
}

export function parseChapterSummaryRoadmap(markdown: string): ChapterSummaryRoadmap | null {
  const outline = /^##\s+1\.\s+(.+)\s*$/m.exec(markdown);
  const comparison = /^##\s+2\.\s+.+\s*$/m.exec(markdown);
  if (!outline || !comparison || comparison.index <= outline.index) return null;

  const outlineEnd = outline.index + outline[0].length;
  const outlineText = markdown.slice(outlineEnd, comparison.index);
  const stepPattern = /^###\s+(?:Bài|Lesson)\s+(\d+)\s*[—–-]\s*(.+?)\s*$/gim;
  const matches = [...outlineText.matchAll(stepPattern)];
  if (matches.length < 2) return null;

  const steps = matches.map((match, index): ChapterRoadmapStep => {
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index ?? outlineText.length : outlineText.length;
    const lines = outlineText.slice(start, end).trim().split(/\r?\n/);
    const arrowLine = lines.findIndex((line) => /^\s*↓\s*\S/.test(line));
    const description = (arrowLine < 0 ? lines : lines.slice(0, arrowLine)).join('\n').trim();
    return {
      number: Number(match[1]),
      title: match[2].trim(),
      description,
      transition: arrowLine < 0 ? null : lines.slice(arrowLine).join('\n').replace(/^\s*↓\s*/, '').trim(),
    };
  });

  // If the format differs, retain the full original Markdown instead of
  // silently omitting details that the roadmap does not understand.
  if (steps.some((step, index) => !step.description || !Number.isSafeInteger(step.number)
    || (index < steps.length - 1 && !step.transition)
    || (index === steps.length - 1 && step.transition))) return null;
  if (outlineText.slice(0, matches[0].index ?? 0).trim()) return null;

  const introduction = markdown.slice(0, outline.index)
    .replace(/^#\s+[^\r\n]+(?:\r?\n|$)/, '').trim();
  return {
    heading: outline[1].trim(),
    introduction,
    steps,
    comparisonMarkdown: markdown.slice(comparison.index).trim(),
  };
}
