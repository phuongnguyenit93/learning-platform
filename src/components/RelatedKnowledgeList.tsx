import { useMemo } from 'react';
import { formatKnowledgeDisplayTitle, resolveAssessmentKnowledgeLinks } from '../data/knowledge';
import { useLanguage } from '../state/LanguageContext';
import type { KnowledgeIndex, KnowledgeSectionRef, QuizReadmeRelated } from '../types/learning';

export interface RelatedKnowledgeListProps {
  related?: QuizReadmeRelated;
  knowledgeIndex: KnowledgeIndex | null;
  onNavigateToKnowledge: (section: KnowledgeSectionRef) => void;
}

/** Only the link list is shared. Quiz, Interview and Case Study own their
 * accordion/inline presentation and its position relative to the answer. */
export function RelatedKnowledgeList({ related, knowledgeIndex, onNavigateToKnowledge }: RelatedKnowledgeListProps) {
  const { language } = useLanguage();
  const sections = useMemo(
    () => resolveAssessmentKnowledgeLinks(knowledgeIndex, related),
    [knowledgeIndex, related],
  );

  if (sections.length === 0) {
    const hasAnchors = Boolean(related?.anchorList?.length || related?.anchor);
    return (
      <p className="related-knowledge-list__empty" role="status">
        {hasAnchors && !knowledgeIndex
          ? (language === 'vi' ? 'Đang tải danh sách bài học...' : 'Loading lessons...')
          : hasAnchors
            ? (language === 'vi' ? 'Không tìm thấy bài học liên quan trong module.' : 'Related lessons were not found in this module.')
            : (language === 'vi' ? 'Chưa có bài học được liên kết.' : 'No lessons linked yet.')}
      </p>
    );
  }

  return (
    <ul className="related-knowledge-list">
      {sections.map((section) => (
        <li key={`${section.sourcePath}#${section.id}`}>
          <button type="button" className="related-knowledge-list__link"
            onClick={() => onNavigateToKnowledge(section)}
            title={language === 'vi' ? 'Mở bài học trong Knowledge' : 'Open lesson in Knowledge'}>
            <span className="related-knowledge-list__title">
              <span className="related-knowledge-list__chapter">{section.categoryTitle}</span>
              <span className="related-knowledge-list__separator" aria-hidden="true"> — </span>
              <span>{formatKnowledgeDisplayTitle(section.title)}</span>
            </span>
            <span aria-hidden="true" className="related-knowledge-list__arrow">↗</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
