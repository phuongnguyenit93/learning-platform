import DOMPurify from 'dompurify';

/**
 * DB-controlled SVG is untrusted markup. Sanitize it, then load as an image
 * resource (rather than inserting SVG into the page's live DOM).
 */
export function topicSvgImageSrc(rawSvg: string): string | null {
  // Require a complete SVG document; fragments without viewBox information
  // cannot reliably be displayed as standalone image resources.
  if (!/^\s*<svg(?:\s|>)/i.test(rawSvg)) return null;

  const purifier = typeof DOMPurify.sanitize === 'function' ? DOMPurify : DOMPurify(window);
  const sanitized = purifier.sanitize(rawSvg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['foreignObject', 'script', 'style', 'image', 'use', 'a', 'animate', 'set'],
    FORBID_ATTR: ['href', 'xlink:href', 'style'],
    ALLOW_DATA_ATTR: false,
  }).trim();

  if (!sanitized) return null;

  // Some DOM implementations (notably happy-dom) omit the outer SVG element
  // during sanitation while retaining its safe shape children. Reconstruct
  // only the wrapper, never the original unsanitized markup or attributes.
  let safeSvg = sanitized;
  if (!/^<svg(?:\s|>)/i.test(safeSvg)) {
    const rawViewBox = rawSvg.match(/^\s*<svg\b[^>]*\bviewBox\s*=\s*(["'])(.*?)\1/i)?.[2];
    const dimensions = rawViewBox?.trim().split(/[\s,]+/).map(Number);
    const safeViewBox = dimensions?.length === 4
      && dimensions.every(Number.isFinite)
      && dimensions[2] > 0 && dimensions[3] > 0
      ? ` viewBox="${dimensions.join(' ')}"`
      : '';
    safeSvg = `<svg xmlns="http://www.w3.org/2000/svg"${safeViewBox}>${sanitized}</svg>`;
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(safeSvg)}`;
}
