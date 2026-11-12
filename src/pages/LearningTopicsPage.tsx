import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLearningCatalog, type LearningTopic, type LearningTopicGroup } from '../data/learningCatalog';
import { topicSvgImageSrc } from '../data/topicSvg';
import { useLanguage } from '../state/LanguageContext';

type CatalogState =
  | { status: 'loading' }
  | { status: 'ready'; groups: LearningTopicGroup[] }
  | { status: 'error' };

function TopicCard({
  topic,
  index,
  language,
  onComingSoon,
}: {
  topic: LearningTopic;
  index: number;
  language: 'vi' | 'en';
  onComingSoon: (name: string, trigger: HTMLButtonElement) => void;
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
      <span className={`learning-topic-card__status${available ? ' is-available' : ''}`}>
        <span className="learning-topic-card__status-dot" aria-hidden="true" />
        {available
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
  const [catalog, setCatalog] = useState<CatalogState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);
  const [unavailableTopic, setUnavailableTopic] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setCatalog({ status: 'loading' });
    fetchLearningCatalog(controller.signal)
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
  }, [reloadKey]);

  useEffect(() => {
    if (unavailableTopic) dialogRef.current?.showModal?.();
  }, [unavailableTopic]);

  const closeDialog = () => {
    dialogRef.current?.close?.();
    setUnavailableTopic(null);
    triggerRef.current?.focus();
  };

  return (
    <main className="learning-topics-page">
      <div className="learning-topics-page__intro">
        <span className="learning-topics-page__eyebrow">LEARNING PATHS</span>
        <h1>{language === 'vi' ? 'Bạn muốn học gì hôm nay?' : 'What would you like to learn?'}</h1>
        <p>
          {language === 'vi'
            ? 'Chọn một chủ đề để bắt đầu khám phá kiến thức và dự án thực hành.'
            : 'Choose a topic to explore knowledge and hands-on projects.'}
        </p>
      </div>

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
      {catalog.status === 'ready' && catalog.groups.length === 0 && (
        <div className="learning-topics-state" role="status">
          {language === 'vi' ? 'Chưa có chủ đề nào để hiển thị.' : 'No topics are available yet.'}
        </div>
      )}
      {catalog.status === 'ready' && catalog.groups.length > 0 && (
        <div className="learning-topics-categories">
          {catalog.groups.map(({ category, topics }, categoryIndex) => (
            <section className="learning-topic-category" key={category.id} aria-labelledby={`topic-category-${category.id}`}>
              <div className="learning-topic-category__header">
                <div>
                  <span className="learning-topic-category__eyebrow">
                    {String(categoryIndex + 1).padStart(2, '0')} / CATEGORY
                  </span>
                  <h2 id={`topic-category-${category.id}`}>{category.name}</h2>
                </div>
                <span className="learning-topic-category__count">
                  {topics.length} {topics.length === 1 ? 'TOPIC' : 'TOPICS'}
                </span>
              </div>
              <div className="learning-topics-grid">
                {topics.map((topic, index) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    index={index}
                    language={language}
                    onComingSoon={(name, trigger) => {
                      triggerRef.current = trigger;
                      setUnavailableTopic(name);
                    }}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
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
