import { useEffect, useState } from 'react';
import { fetchLearningTopics } from './learningCatalog';
import { topicFromPathname } from './topicRoutes';
import { topicSvgImageSrc } from './topicSvg';

/**
 * Shared icon for the Header and favicon. Fetch the public Topic catalog only
 * once per App mount, and reuse sanitized SVG URLs across Module navigation.
 * Missing or invalid icons deliberately fall back to the existing site icons.
 */
export function useTopicBrandingIcon(pathname: string): string | null {
  const topicSlug = topicFromPathname(pathname);
  const [icons, setIcons] = useState<Record<string, string | null> | null>(null);

  useEffect(() => {
    if (!topicSlug || icons !== null) return;

    const controller = new AbortController();
    fetchLearningTopics(controller.signal)
      .then((topics) => {
        if (controller.signal.aborted) return;
        const next = Object.create(null) as Record<string, string | null>;
        for (const topic of topics) {
          next[topic.slug] = topicSvgImageSrc(topic.iconSvg);
        }
        setIcons(next);
      })
      .catch(() => {
        // Network errors should not block navigation or replace the fallback.
      });

    return () => controller.abort();
  }, [topicSlug, icons]);

  return topicSlug ? icons?.[topicSlug] ?? null : null;
}
