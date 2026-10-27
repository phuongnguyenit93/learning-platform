import { useLanguage } from '../state/LanguageContext';

export function JavaOverviewPage() {
  const { language } = useLanguage();

  return (
    <main className="java-overview-page" aria-label="Java Overview">
      <section className="home-placeholder">
        <span className="home-placeholder__eyebrow">JAVA / SPRING</span>
        <h1>Overview</h1>
        <p>{language === 'vi' ? 'Roadmap của Java và Spring.' : 'Roadmaps for Java and Spring.'}</p>
      </section>
    </main>
  );
}
