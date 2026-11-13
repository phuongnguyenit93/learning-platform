import { useEffect, useState } from 'react';
import { fetchModuleOverview } from '../data/moduleOverview';
import { useLanguage } from '../state/LanguageContext';
import type { Language } from '../types/learning';
import { MermaidMarkdown } from './MermaidMarkdown';

interface Props {
  moduleSlug: string;
}

type OverviewState =
  | { slug: string; language: Language; status: 'loading' }
  | { slug: string; language: Language; status: 'ready'; content: string | null }
  | { slug: string; language: Language; status: 'error'; message: string };

export function DatabaseOverviewPanel({ moduleSlug }: Props) {
  const { language } = useLanguage();
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState<OverviewState>({ slug: moduleSlug, language, status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ slug: moduleSlug, language, status: 'loading' });

    fetchModuleOverview(moduleSlug, language, controller.signal)
      .then((overview) => {
        if (!controller.signal.aborted) setState({
          slug: moduleSlug, language, status: 'ready', content: overview?.markdownContent ?? null,
        });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setState({
          slug: moduleSlug, language, status: 'error',
          message: error instanceof Error ? error.message : 'Unable to load Overview.',
        });
      });
    return () => controller.abort();
  }, [moduleSlug, language, retry]);

  // Prevent the previous module/language from flashing during navigation or
  // locale switch, before the new effect runs.
  const current = state.slug === moduleSlug && state.language === language ? state : null;

  if (!current || current.status === 'loading') {
    return <div className="empty-state empty-state--large" role="status">
      <strong>{language === 'vi' ? 'Đang tải Overview...' : 'Loading Overview...'}</strong>
    </div>;
  }

  if (current.status === 'error') {
    return <div className="empty-state empty-state--large" role="alert">
      <strong>{language === 'vi' ? 'Không thể tải Overview' : 'Unable to load Overview'}</strong>
      <span>{current.message}</span>
      <button type="button" onClick={() => setRetry((value) => value + 1)}>
        {language === 'vi' ? 'Thử lại' : 'Retry'}
      </button>
    </div>;
  }

  if (!current.content?.trim()) {
    return <div className="empty-state empty-state--large" role="status">
      <strong>{language === 'vi' ? 'Chưa có nội dung Overview' : 'No Overview content yet'}</strong>
      <span>{language === 'vi'
        ? 'Module này chưa có Overview tiếng Việt trong cơ sở dữ liệu.'
        : 'This module does not have an English Overview in the database.'}</span>
    </div>;
  }

  return <section className="overview-panel markdown-content">
    <MermaidMarkdown>{current.content}</MermaidMarkdown>
  </section>;
}
