/** The current Java UI is shared by every topic until topic-specific data is available. */
export function topicBasePath(topicSlug: string | undefined): string {
  return `/learning/${encodeURIComponent(topicSlug || 'java')}`;
}

export function topicOverviewPath(topicSlug: string | undefined): string {
  return `${topicBasePath(topicSlug)}/overview`;
}

export function topicKnowledgePath(topicSlug: string | undefined, moduleSlug?: string): string {
  const base = `${topicBasePath(topicSlug)}/knowledge`;
  return moduleSlug ? `${base}/${encodeURIComponent(moduleSlug)}` : base;
}

/** Only the two topic sections use the module-style viewport. */
export function isTopicKnowledgePath(pathname: string): boolean {
  return /^\/learning\/[^/]+\/knowledge(?:\/|$)/.test(pathname);
}

export function topicFromPathname(pathname: string): string | null {
  const match = /^\/learning\/([^/]+)(?:\/(?:overview|knowledge)(?:\/|$)|\/?$)/.exec(pathname);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}
