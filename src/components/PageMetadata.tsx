import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { topicFromPathname } from '../data/topicRoutes';

const defaultFavicon = new URL('../assets/favicon.svg', import.meta.url).href;
const javaFavicon = new URL('../assets/logos/java.svg', import.meta.url).href;

/**
 * The Portal is one SPA document, so route changes must also update the
 * browser-tab metadata. Keep this separate from the visible Header.
 */
export function PageMetadata({ topicIconSrc = null }: { topicIconSrc?: string | null }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const topicSlug = topicFromPathname(pathname);
    const isJavaLearning = topicSlug === 'java';
    const topicLabel = topicSlug === null ? null : topicSlug === 'java' ? 'Java' : topicSlug.charAt(0).toUpperCase() + topicSlug.slice(1);
    const isMyCv = pathname === '/about-me' || pathname === '/about-me/';

    const title = isMyCv
      ? 'Nguyen Do Dinh Phuong'
      : pathname === '/sop' || pathname === '/sop/'
        ? 'SOP - Learning Platform'
        : pathname === '/project' || pathname === '/project/'
          ? 'Project - Learning Platform'
          : topicLabel
            ? `${topicLabel} Learning - ${pathname.endsWith('/overview') ? 'Overview' : 'Knowledge'}`
              : 'Learning Platform';

    const favicon = topicIconSrc ?? (isJavaLearning ? javaFavicon : defaultFavicon);

    document.title = title;

    let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!icon) {
      icon = document.createElement('link');
      icon.rel = 'icon';
      document.head.appendChild(icon);
    }

    icon.type = 'image/svg+xml';
    icon.href = favicon;
  }, [pathname, topicIconSrc]);

  return null;
}
