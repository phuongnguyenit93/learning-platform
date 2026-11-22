import { useEffect, useRef, useState } from 'react';
import { fetchIncompleteModuleServiceNames, type IncompleteModuleStatus } from '../data/learningCatalog';

type DetailsState =
  | { status: 'loading' }
  | { status: 'ready'; serviceNames: string[] }
  | { status: 'error' };

export function TopicProgressDetailsDialog({
  topicId, topicName, progressStatus, language, onClose,
}: {
  topicId: number;
  topicName: string;
  progressStatus: IncompleteModuleStatus;
  language: 'vi' | 'en';
  onClose: () => void;
}) {
  const [state, setState] = useState<DetailsState>({ status: 'loading' });
  const [retry, setRetry] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const vi = language === 'vi';
  const title = progressStatus === 'PARTIAL'
    ? (vi ? 'Module đang dang dở' : 'Incomplete modules')
    : (vi ? 'Module chưa làm' : 'Not started modules');

  useEffect(() => {
    const abort = new AbortController();
    setState({ status: 'loading' });
    fetchIncompleteModuleServiceNames(topicId, progressStatus, abort.signal)
      .then((serviceNames) => {
        if (!abort.signal.aborted) setState({ status: 'ready', serviceNames });
      })
      .catch(() => {
        if (!abort.signal.aborted) setState({ status: 'error' });
      });
    return () => abort.abort();
  }, [topicId, progressStatus, retry]);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="topic-progress-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="topic-progress-dialog" role="dialog" aria-modal="true" aria-labelledby="topic-progress-dialog-title">
        <div className="topic-progress-dialog__header">
          <div>
            <span className="topic-progress-dialog__eyebrow">{topicName}</span>
            <h2 id="topic-progress-dialog-title">{title}</h2>
          </div>
          <button ref={closeButtonRef} type="button" className="topic-progress-dialog__close" onClick={onClose}
            aria-label={vi ? 'Đóng' : 'Close'}>×</button>
        </div>
        {state.status === 'loading' && <p role="status">{vi ? 'Đang tải danh sách...' : 'Loading modules...'}</p>}
        {state.status === 'error' && (
          <div role="alert">
            <p>{vi ? 'Không tải được danh sách Module.' : 'Could not load modules.'}</p>
            <button type="button" className="catalog-admin-btn catalog-admin-btn--ghost"
              onClick={() => setRetry((value) => value + 1)}>{vi ? 'Thử lại' : 'Retry'}</button>
          </div>
        )}
        {state.status === 'ready' && (
          <>
            <p className="topic-progress-dialog__count">
              {state.serviceNames.length} {vi ? 'Module' : 'modules'}
            </p>
            {state.serviceNames.length === 0
              ? <p>{vi ? 'Không có Module nào ở trạng thái này.' : 'No modules with this status.'}</p>
              : <ul className="topic-progress-dialog__list">
                {state.serviceNames.map((serviceName) => <li key={serviceName}><code>{serviceName}</code></li>)}
              </ul>}
          </>
        )}
      </section>
    </div>
  );
}
