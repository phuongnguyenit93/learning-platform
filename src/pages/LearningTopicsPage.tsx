import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchLearningCatalog, fetchTopicModuleProgress,
  type IncompleteModuleStatus, type LearningTopic, type LearningTopicGroup, type TopicModuleProgress,
} from '../data/learningCatalog';
import { CatalogEditor, type CatalogEditorTarget } from '../components/CatalogEditor';
import { TopicProgressDetailsDialog } from '../components/TopicProgressDetailsDialog';
import { topicSvgImageSrc } from '../data/topicSvg';
import { useAuth } from '../state/useAuth';
import { useLanguage } from '../state/LanguageContext';

type CatalogState =
  | { status: 'loading' }
  | { status: 'ready'; groups: LearningTopicGroup[] }
  | { status: 'error' };

type ProgressState =
  | { status: 'loading' }
  | { status: 'ready'; byTopic: Map<number, TopicModuleProgress> }
  | { status: 'error' };

type ProgressDetails = {
  topicId: number;
  topicName: string;
  status: IncompleteModuleStatus;
};

function TopicCard({
  topic,
  index,
  language,
  onComingSoon,
  progress,
  progressFailed,
}: {
  topic: LearningTopic;
  index: number;
  language: 'vi' | 'en';
  onComingSoon: (name: string, trigger: HTMLButtonElement) => void;
  progress?: TopicModuleProgress;
  progressFailed: boolean;
}) {
  const logoSrc = useMemo(() => topicSvgImageSrc(topic.iconSvg), [topic.iconSvg]);
  const available = topic.status === 'AVAILABLE';
  const content = (
    <>
      <span className="learning-topic-card__topline">
        <span className="learning-topic-card__index">{String(index + 1).padStart(2, '0')} / TOPIC</span>
        <span className="learning-topic-card__arrow" aria-hidden="true">↗</span>
      </span>
      <span className="learning-topic-card__emblem" aria-hidden="true">
        {logoSrc
          ? <img className="learning-topic-card__logo" src={logoSrc} alt="" draggable={false} />
          : <span className="learning-topic-card__logo-fallback">{topic.name.slice(0, 1)}</span>}
      </span>
      <span className="learning-topic-card__name">{topic.name}</span>
      {topic.description && <span className="learning-topic-card__detail">{topic.description}</span>}
      {progress ? (
        <span className="learning-topic-card__progress">
          <span className="learning-topic-card__progress-item">
            <span>{language === 'vi' ? 'Tổng Module' : 'Total modules'}</span>
            <strong>{progress.totalModules}</strong>
          </span>
          <span className="learning-topic-card__progress-item">
            <span>{language === 'vi' ? 'Hoàn thành' : 'Completed'}</span>
            <strong className="is-complete">{progress.completedModules}</strong>
          </span>
        </span>
      ) : (
        <span className="learning-topic-card__progress-note">
          {progressFailed
            ? (language === 'vi' ? 'Chưa tải được thống kê' : 'Statistics unavailable')
            : (language === 'vi' ? 'Đang tải thống kê...' : 'Loading statistics...')}
        </span>
      )}
      <span className={`learning-topic-card__status${available ? ' is-available' : ''}`}>
        <span className="learning-topic-card__status-dot" aria-hidden="true" />
        {topic.status === 'HIDDEN'
          ? (language === 'vi' ? 'Đang ẩn' : 'Hidden')
          : available
          ? (language === 'vi' ? 'Bắt đầu học' : 'Start learning')
          : (language === 'vi' ? 'Sắp cập nhật' : 'Coming soon')}
      </span>
    </>
  );

  if (available) {
    return (
      <Link className="learning-topic-card" to={`/learning/${encodeURIComponent(topic.slug)}/knowledge`}>
        {content}
      </Link>
    );
  }
  return (
    <button
      className="learning-topic-card"
      type="button"
      onClick={(event) => onComingSoon(topic.name, event.currentTarget)}
    >
      {content}
    </button>
  );
}

export function LearningTopicsPage() {
  const { language } = useLanguage();
  const { status: authStatus, user } = useAuth();
  const authPending = authStatus === 'loading';
  const isAdmin = authStatus === 'authenticated' && Boolean(user?.roles.includes('ADMIN'));
  const [catalog, setCatalog] = useState<CatalogState>({ status: 'loading' });
  const [progress, setProgress] = useState<ProgressState>({ status: 'loading' });
  const [progressRetry, setProgressRetry] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [editor, setEditor] = useState<CatalogEditorTarget | null>(null);
  const [details, setDetails] = useState<ProgressDetails | null>(null);
  const detailsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [unavailableTopic, setUnavailableTopic] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const topicsScrollRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (authPending) return;
    const controller = new AbortController();
    setCatalog({ status: 'loading' });
    fetchLearningCatalog(controller.signal, isAdmin)
      .then((groups) => {
        if (!controller.signal.aborted) setCatalog({ status: 'ready', groups });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          console.error('[learning-platform] Unable to load topics:', error);
          setCatalog({ status: 'error' });
        }
      });
    return () => controller.abort();
  }, [reloadKey, isAdmin, authPending]);

  useEffect(() => {
    if (authPending) return;
    const controller = new AbortController();
    setProgress({ status: 'loading' });
    fetchTopicModuleProgress(controller.signal, isAdmin)
      .then((rows) => {
        if (!controller.signal.aborted) {
          setProgress({ status: 'ready', byTopic: new Map(rows.map((row) => [row.topicId, row])) });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setProgress({ status: 'error' });
      });
    return () => controller.abort();
  }, [reloadKey, progressRetry, isAdmin, authPending]);

  useEffect(() => {
    if (unavailableTopic) dialogRef.current?.showModal?.();
  }, [unavailableTopic]);

  const closeDialog = () => {
    dialogRef.current?.close?.();
    setUnavailableTopic(null);
    triggerRef.current?.focus();
  };

  const selectedGroup = catalog.status === 'ready'
    ? catalog.groups.find(({ category }) => category.id === selectedCategoryId) ?? catalog.groups[0]
    : undefined;

  return (
    <main className="learning-topics-page">
      <aside className="learning-topics-sidebar" aria-label={language === 'vi' ? 'Danh mục học tập' : 'Learning categories'}>
        <div className="learning-topics-sidebar__header">
          <div>
            <span className="learning-topics-sidebar__eyebrow">CATEGORY</span>
            <h1>{language === 'vi' ? 'Danh mục' : 'Categories'}</h1>
          </div>
          {isAdmin && (
            <button type="button" className="catalog-admin-btn" onClick={() => setEditor({ kind: 'category' })}>
              + {language === 'vi' ? 'Tạo Category' : 'Create Category'}
            </button>
          )}
        </div>
        <nav className="learning-topics-sidebar__list" aria-label={language === 'vi' ? 'Chọn danh mục' : 'Select category'}>
          {catalog.status === 'ready' && catalog.groups.map(({ category, topics }, categoryIndex) => (
            <button
              type="button"
              key={category.id}
              className={`learning-topics-sidebar__item${selectedGroup?.category.id === category.id ? ' is-selected' : ''}`}
              aria-pressed={selectedGroup?.category.id === category.id}
              aria-controls="learning-topic-category-panel"
              onClick={() => {
                setSelectedCategoryId(category.id);
                if (topicsScrollRef.current) topicsScrollRef.current.scrollTop = 0;
              }}
            >
              <span className="learning-topics-sidebar__number">{String(categoryIndex + 1).padStart(2, '0')}</span>
              <span className="learning-topics-sidebar__item-name">
                {category.name}
                {isAdmin && 'active' in category && category.active === false && (
                  <span className="catalog-admin-inactive">INACTIVE</span>
                )}
              </span>
              <span className="learning-topics-sidebar__item-count">{topics.length}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="learning-topics-categories">
        {catalog.status === 'loading' && (
          <div className="learning-topics-state" role="status">
            {language === 'vi' ? 'Đang tải danh sách chủ đề...' : 'Loading learning topics...'}
          </div>
        )}
        {catalog.status === 'error' && (
          <div className="learning-topics-state" role="alert">
            <p>{language === 'vi'
              ? 'Không thể tải danh sách chủ đề. Vui lòng thử lại.'
              : 'Unable to load topics. Please try again.'}</p>
            <button className="learning-topics-retry" type="button" onClick={() => setReloadKey((key) => key + 1)}>
              {language === 'vi' ? 'Thử lại' : 'Retry'}
            </button>
          </div>
        )}
        {catalog.status === 'ready' && !selectedGroup && (
          <div className="learning-topics-state" role="status">
            {language === 'vi' ? 'Chưa có chủ đề nào để hiển thị.' : 'No topics are available yet.'}
          </div>
        )}
        {selectedGroup && (
          <section
            id="learning-topic-category-panel"
            className="learning-topic-category"
            aria-labelledby={`topic-category-${selectedGroup.category.id}`}
          >
            <div className="learning-topic-category__header">
              <div>
                <span className="learning-topic-category__eyebrow">
                  {language === 'vi' ? 'CHỦ ĐỀ THEO DANH MỤC' : 'TOPICS BY CATEGORY'}
                </span>
                <h2 id={`topic-category-${selectedGroup.category.id}`}>{selectedGroup.category.name}</h2>
              </div>
              <div className="learning-topic-category__header-actions">
                <span className="learning-topic-category__count">
                  {selectedGroup.topics.length} {selectedGroup.topics.length === 1 ? 'TOPIC' : 'TOPICS'}
                </span>
                {isAdmin && (
                  <>
                    <button type="button" className="catalog-admin-btn catalog-admin-btn--ghost"
                      onClick={() => setEditor({ kind: 'category', category: selectedGroup.category })}>
                      {language === 'vi' ? 'Sửa Category' : 'Edit Category'}
                    </button>
                    <button type="button" className="catalog-admin-btn"
                      onClick={() => setEditor({ kind: 'topic', category: selectedGroup.category })}>
                      + {language === 'vi' ? 'Tạo Topic' : 'Create Topic'}
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="learning-topic-category__scroll" ref={topicsScrollRef}>
              {progress.status === 'error' && (
                <div className="learning-topic-progress-error" role="alert">
                  <span>{language === 'vi' ? 'Không tải được thống kê Module.' : 'Could not load Module statistics.'}</span>
                  <button type="button" onClick={() => setProgressRetry((value) => value + 1)}>
                    {language === 'vi' ? 'Thử lại' : 'Retry'}
                  </button>
                </div>
              )}
              {isAdmin && selectedGroup.topics.length === 0 && (
                <p className="learning-topic-category__empty">
                  {language === 'vi' ? 'Category chưa có Topic. Chọn “Tạo Topic” để bắt đầu.' : 'No topics yet. Use “Create Topic” to add one.'}
                </p>
              )}
              <div className="learning-topics-grid">
                {selectedGroup.topics.map((topic, index) => {
                  const stats = progress.status === 'ready' ? progress.byTopic.get(topic.id) : undefined;
                  const hasAdminProgress = isAdmin && stats?.partialModules !== undefined
                    && stats.notStartedModules !== undefined;
                  return (
                    <div className={`learning-topic-card-shell${isAdmin ? ' learning-topic-card-shell--admin' : ''}${hasAdminProgress ? ' learning-topic-card-shell--with-progress' : ''}`} key={topic.id}>
                      {isAdmin && (
                        <button type="button" className="catalog-admin-topic-edit"
                          onClick={() => setEditor({ kind: 'topic', category: selectedGroup.category, topic })}>
                          {language === 'vi' ? 'Sửa Topic' : 'Edit Topic'}
                        </button>
                      )}
                      <TopicCard
                        topic={topic}
                        index={index}
                        language={language}
                        progress={stats}
                        progressFailed={progress.status === 'error'}
                        onComingSoon={(name, trigger) => {
                          triggerRef.current = trigger;
                          setUnavailableTopic(name);
                        }}
                      />
                      {hasAdminProgress && (
                        <div className="topic-progress-admin">
                          {([
                            ['PARTIAL', stats.partialModules!, language === 'vi' ? 'Đang dang dở' : 'Incomplete'],
                            ['NOT_STARTED', stats.notStartedModules!, language === 'vi' ? 'Chưa làm' : 'Not started'],
                          ] as const).map(([status, count, label]) => (
                            <div className="topic-progress-admin__row" key={status}>
                              <span className={`topic-progress-admin__label is-${status.toLowerCase()}`}>{label}</span>
                              <strong>{count}</strong>
                              {count > 0 && <button type="button" onClick={(event) => {
                                detailsTriggerRef.current = event.currentTarget;
                                setDetails({ topicId: topic.id, topicName: topic.name, status });
                              }}>{language === 'vi' ? 'Chi tiết' : 'Details'}</button>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>

      {isAdmin && editor && (
        <CatalogEditor
          key={editor.kind === 'category' ? `category:${editor.category?.id ?? 'new'}` : `topic:${editor.topic?.id ?? `new:${editor.category.id}`}`}
          target={editor}
          language={language}
          onClose={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            setReloadKey((key) => key + 1);
          }}
        />
      )}

      {isAdmin && details && (
        <TopicProgressDetailsDialog
          key={`${details.topicId}:${details.status}`}
          topicId={details.topicId}
          topicName={details.topicName}
          progressStatus={details.status}
          language={language}
          onClose={() => {
            setDetails(null);
            detailsTriggerRef.current?.focus();
          }}
        />
      )}

      {unavailableTopic && (
        <dialog
          className="learning-coming-soon"
          ref={dialogRef}
          aria-labelledby="learning-coming-soon-title"
          aria-describedby="learning-coming-soon-description"
          onClose={() => {
            setUnavailableTopic(null);
            triggerRef.current?.focus();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <button className="learning-coming-soon__close" type="button" onClick={closeDialog} aria-label={language === 'vi' ? 'Đóng' : 'Close'}>
            ×
          </button>
          <span className="learning-coming-soon__icon" aria-hidden="true">✧</span>
          <span className="learning-coming-soon__eyebrow">{unavailableTopic}</span>
          <h2 id="learning-coming-soon-title">
            {language === 'vi' ? 'Nội dung chưa được cập nhật' : 'Content has not been updated yet'}
          </h2>
          <p id="learning-coming-soon-description">
            {language === 'vi'
              ? 'Chủ đề này đang được chuẩn bị. Hãy quay lại sau nhé!'
              : 'This topic is being prepared. Please check back later!'}
          </p>
        </dialog>
      )}
    </main>
  );
}
