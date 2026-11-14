import { useEffect, useMemo, useState } from 'react';
import { loadReferenceDocument } from '../data/reference';
import { fetchModuleReferences } from '../data/moduleReferences';
import { useLanguage } from '../state/LanguageContext';
import type { ReferenceDocument } from '../types/learning';

interface ReferencePanelProps {
  /** Legacy Java release reference path (retained for migration compatibility). */
  path?: string;
  /** Database SLUG. When present, fetch Oracle-backed Reference instead of YAML. */
  moduleSlug?: string;
  searchQuery: string;
}

export function ReferencePanel({ path, moduleSlug, searchQuery }: ReferencePanelProps) {
  const { language } = useLanguage();
  const [retry, setRetry] = useState(0);
  const sourceKey = moduleSlug
    ? `db:${moduleSlug}:${language}`
    : path ? `yaml:${path}` : '';
  const [loaded, setLoaded] = useState<{
    sourceKey: string;
    document?: ReferenceDocument | null;
    error?: string;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    if (!sourceKey) return () => controller.abort();

    const request = moduleSlug
      ? fetchModuleReferences(moduleSlug, language, controller.signal)
      : loadReferenceDocument(path!);

    request
      .then((document) => {
        if (!controller.signal.aborted) setLoaded({ sourceKey, document });
      })
      .catch((caught: unknown) => {
        if (!controller.signal.aborted) setLoaded({
          sourceKey,
          error: caught instanceof Error ? caught.message : 'Unable to load Reference.',
        });
      });

    return () => controller.abort();
  }, [sourceKey, moduleSlug, language, path, retry]);

  // Do not show the previous module or language while an API call is pending.
  // Legacy single-path YAML is still shared across languages during rollout.
  const current = loaded?.sourceKey === sourceKey ? loaded : null;
  const document = current?.document ?? null;
  const error = current?.error ?? null;
  const loading = Boolean(sourceKey && !current);

  const references = useMemo(() => {
    const items = document?.references ?? [];
    const query = searchQuery.trim().toLocaleLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) => (
      `${item.title} ${item.description} ${item.url}`
        .toLocaleLowerCase()
        .includes(query)
    ));
  }, [document, searchQuery]);

  if (loading) {
    return (
      <div className="empty-state">
        <strong>{language === 'vi' ? 'Đang tải tài liệu tham khảo...' : 'Loading references...'}</strong>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <strong>{language === 'vi' ? 'Không thể tải tài liệu tham khảo' : 'Unable to load references'}</strong>
        <span>{error}</span>
        {moduleSlug && <button type="button" onClick={() => { setLoaded(null); setRetry((value) => value + 1); }}>
          {language === 'vi' ? 'Thử lại' : 'Retry'}
        </button>}
      </div>
    );
  }

  if (!sourceKey || !document) {
    return (
      <div className="empty-state">
        <strong>{language === 'vi' ? 'Module chưa có tài liệu tham khảo.' : 'This module has no references yet.'}</strong>
      </div>
    );
  }

  if (references.length === 0) {
    return (
      <div className="empty-state">
        <strong>{language === 'vi' ? 'Không có tài liệu phù hợp với tìm kiếm.' : 'No references match your search.'}</strong>
      </div>
    );
  }

  return (
    <section className="reference-panel">
      <div className="reference-panel__header">
        <span className="eyebrow">REFERENCE</span>
        <h2>{language === 'vi' ? 'Tài liệu tham khảo' : 'References'}</h2>
        <p>
          {language === 'vi'
            ? 'Các nguồn được chọn lọc để học và kiểm chứng nội dung của module.'
            : 'Curated sources for studying and verifying this module.'}
        </p>
      </div>

      <div className="reference-list">
        {references.map((item, index) => (
          <article className="reference-card" key={`${item.url}:${index}`}>
            <div className="reference-card__number">{String(index + 1).padStart(2, '0')}</div>
            <div className="reference-card__content">
              <h3>{item.title}</h3>
              {item.description && <p>{item.description}</p>}
              <a href={item.url} target="_blank" rel="noreferrer">
                {language === 'vi' ? 'Mở tài liệu ↗' : 'Open reference ↗'}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
