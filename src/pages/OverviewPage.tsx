import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchLearningTopics, type LearningTopic } from '../data/learningCatalog';
import { useLanguage } from '../state/LanguageContext';

type TopicState =
  | { slug: string; status: 'loading' }
  | { slug: string; status: 'ready'; topic: LearningTopic }
  | { slug: string; status: 'error'; message: string };

export function OverviewPage() {
  const { language } = useLanguage();
  const { topicSlug = 'java' } = useParams();
  const [state, setState] = useState<TopicState>({ slug: topicSlug, status: 'loading' });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ slug: topicSlug, status: 'loading' });
    fetchLearningTopics(controller.signal)
      .then((topics) => {
        if (controller.signal.aborted) return;
        const topic = topics.find((item) => item.slug === topicSlug);
        if (topic) setState({ slug: topicSlug, status: 'ready', topic });
        else setState({ slug: topicSlug, status: 'error', message: `Topic not found: ${topicSlug}` });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setState({
          slug: topicSlug,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unable to load Topic.',
        });
      });
    return () => controller.abort();
  }, [topicSlug, retry]);

  const topic = state.slug === topicSlug && state.status === 'ready' ? state.topic : null;
  const error = state.slug === topicSlug && state.status === 'error' ? state.message : null;

  return (
    <main className="java-overview-page" aria-label={`${topic?.name ?? topicSlug} Overview`}>
      <section className="home-placeholder">
        <span className="home-placeholder__eyebrow">{topic?.name ?? topicSlug} / OVERVIEW</span>
        {topic ? (
          <>
            <h1>{topic.name}</h1>
            {topic.description && <p>{topic.description}</p>}
            <p>{language === 'vi'
              ? 'Roadmap và nội dung tổng quan sẽ được đồng bộ từ database.'
              : 'Roadmaps and overview content will be loaded from the database.'}</p>
          </>
        ) : error ? (
          <>
            <h1>{language === 'vi' ? 'Không thể tải chủ đề' : 'Unable to load topic'}</h1>
            <p>{error}</p>
            <button type="button" onClick={() => setRetry((value) => value + 1)}>
              {language === 'vi' ? 'Thử lại' : 'Retry'}
            </button>
          </>
        ) : <h1>{language === 'vi' ? 'Đang tải chủ đề...' : 'Loading topic...'}</h1>}
      </section>
    </main>
  );
}
