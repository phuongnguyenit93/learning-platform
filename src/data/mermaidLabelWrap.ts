export interface WrappedMermaidLabel {
  lines: string[];
  fontSize: number;
  lineHeight: number;
}

// Mermaid measures flowchart nodes for wrapped HTML labels. When we replace
// their foreignObject with safe native SVG text, SVG no longer wraps for us.
// Respect the original label box before inserting <tspan> elements.
export function wrapMermaidLabel(
  sourceLines: string[],
  width: number,
  height: number,
  measure: (text: string, fontSize: number) => number,
): WrappedMermaidLabel {
  const contentWidth = width > 0 ? Math.max(24, width - 16) : 320;
  const contentHeight = height > 0 ? Math.max(14, height - 6) : Infinity;

  const wrapAtSize = (fontSize: number): string[] => {
    const output: string[] = [];
    for (const source of sourceLines) {
      let current = '';
      for (const word of source.trim().split(/\s+/u).filter(Boolean)) {
        const joined = current ? `${current} ${word}` : word;
        if (measure(joined, fontSize) <= contentWidth) {
          current = joined;
          continue;
        }
        if (current) output.push(current);
        current = '';
        // Very long identifiers/URLs can be wider than an entire node. Split
        // at Unicode code-point boundaries instead of overflowing the shape.
        for (const char of Array.from(word)) {
          if (current && measure(current + char, fontSize) > contentWidth) {
            output.push(current);
            current = '';
          }
          current += char;
        }
      }
      if (current) output.push(current);
    }
    return output;
  };

  let result: WrappedMermaidLabel = { lines: [], fontSize: 16, lineHeight: 19.2 };
  for (let fontSize = 16; fontSize >= 11; fontSize--) {
    const lines = wrapAtSize(fontSize);
    const lineHeight = fontSize * 1.2;
    result = { lines, fontSize, lineHeight };
    if (lines.length * lineHeight <= contentHeight) break;
  }
  return result;
}
