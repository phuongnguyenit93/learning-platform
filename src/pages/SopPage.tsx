import { useLanguage } from '../state/LanguageContext';

export function SopPage() {
  const { language } = useLanguage();

  return (
    <main className="home-page" aria-label="SOP">
      <section className="home-placeholder">
        <span className="home-placeholder__eyebrow">PROJECT / TECHNICAL ANALYSIS</span>
        <h1>SOP</h1>
        <p>
          {language === 'vi'
            ? 'Đây là nơi tập hợp các bước phân tích kỹ thuật cần thiết khi bắt đầu một dự án.'
            : 'This is where the essential technical analysis steps for starting a project are collected.'}
        </p>
      </section>
    </main>
  );
}
