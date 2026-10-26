import { useEffect, useMemo, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { MermaidMarkdown } from './MermaidMarkdown';
import { collectApiKnowledgeRelations, loadApiDocs } from '../data/apiDocs';
import { fetchJavaAsset } from '../data/javaAsset';
import {
  collectKnowledgeCategories,
  collectKnowledgeSections,
  formatKnowledgeDisplayTitle,
  sortKnowledgeSectionsByDifficulty,
} from '../data/knowledge';
import { loadVideoIndex } from '../data/video';
import { loadKnowledgeSummaryChapter, loadKnowledgeSummaryIndex } from '../data/knowledgeSummary';
import { legacyChapterSummaryRoadmap } from '../data/legacyChapterSummaryRoadmap';
import { useLanguage } from '../state/LanguageContext';
import type {
  ApiDocsDocument,
  ApiKnowledgeRelation,
  KnowledgeDifficulty,
  KnowledgeIndex,
  KnowledgeSectionRef,
  KnowledgeSummaryChapter,
  KnowledgeSummaryIndex,
  VideoIndex,
} from '../types/learning';
import { CustomTooltip } from './CustomTooltip';
import { KnowledgeVideoPanel } from './KnowledgeVideoPanel';

function resolveDifficultyLabel(difficulty: KnowledgeDifficulty, language: 'vi' | 'en'): string {
  if (difficulty === 'INTERMEDIATE') {
    return language === 'vi' ? 'TRUNG BÌNH' : 'INTERMEDIATE';
  }

  if (difficulty === 'ADVANCED') {
    return language === 'vi' ? 'NÂNG CAO' : 'ADVANCED';
  }

  return language === 'vi' ? 'CƠ BẢN' : 'BASIC';
}

interface KnowledgePanelProps {
  index: KnowledgeIndex | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  activeCategoryId: string;
  selectedSectionId: string | null;
  apiBasePath?: string;
  videoIndexPath?: string;
  summaryIndexPath?: string;
  onCategoryChange: (categoryId: string) => void;
  onSectionChange: (sectionId: string | null) => void;
  onNavigateToSection: (categoryId: string, sectionId: string) => void;
}

export function KnowledgePanel({
  index,
  loading,
  error,
  searchQuery,
  activeCategoryId,
  selectedSectionId,
  apiBasePath,
  videoIndexPath,
  summaryIndexPath,
  onCategoryChange,
  onSectionChange,
  onNavigateToSection,
}: KnowledgePanelProps) {
  const { language } = useLanguage();
  const [contentCache, setContentCache] = useState<Record<string, string>>({});
  const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(() => new Set());
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(() => new Set());
  const [expandedLessonGroupIds, setExpandedLessonGroupIds] = useState<Set<string>>(() => new Set());
  const [expandedChapterSummaryIds, setExpandedChapterSummaryIds] = useState<Set<string>>(() => new Set());
  const [loadingSectionIds, setLoadingSectionIds] = useState<Set<string>>(() => new Set());
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({});
  const [apiDocument, setApiDocument] = useState<ApiDocsDocument | null>(null);
  const [videoIndex, setVideoIndex] = useState<VideoIndex | null>(null);
  const [summaryIndex, setSummaryIndex] = useState<KnowledgeSummaryIndex | null>(null);
  const [summaryChapters, setSummaryChapters] = useState<Record<string, KnowledgeSummaryChapter>>({});
  const [summaryErrors, setSummaryErrors] = useState<Set<string>>(() => new Set());
  const [openSummaryId, setOpenSummaryId] = useState<string | null>(null);
  const [previewOperationId, setPreviewOperationId] = useState<string | null>(null);
  const [canScrollTopicsLeft, setCanScrollTopicsLeft] = useState(false);
  const [canScrollTopicsRight, setCanScrollTopicsRight] = useState(false);
  const [draggingTopics, setDraggingTopics] = useState(false);
  const [navigationSerial, setNavigationSerial] = useState(0);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const [hoverMenuLeft, setHoverMenuLeft] = useState(8);
  const manuallyExpandedSectionRef = useRef<string | null>(null);
  const lastNavigationKeyRef = useRef<string | null>(null);
  const autoScrollCancelledRef = useRef(false);
  const topicNavRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const summaryEnteredStickyRef = useRef(false);
  const topicStripRef = useRef<HTMLDivElement>(null);
  const topicButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const topicDragRef = useRef({
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    dragged: false,
    active: false,
  });
  const suppressTopicClickRef = useRef(false);

  const categories = useMemo(() => (index ? collectKnowledgeCategories(index.tree) : []), [index]);
  const allSections = useMemo(() => (
    index ? collectKnowledgeSections(index.tree, { sortByDifficulty: true }) : []
  ), [index]);
  const hoveredCategory = categories.find((category) => category.id === hoveredCategoryId);
  const selectedSectionExpanded = selectedSectionId !== null && expandedSectionIds.has(selectedSectionId);
  const selectedSection = allSections.find((section) => section.id === selectedSectionId);
  const selectedSectionSettled = selectedSection === undefined
    || ((contentCache[selectedSection.content] !== undefined
      || (selectedSectionId !== null && sectionErrors[selectedSectionId] !== undefined))
      && (selectedSectionId === null || !loadingSectionIds.has(selectedSectionId)));

  const visibleSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allSections.filter((section) => {
      if (activeCategoryId !== 'all' && section.categoryId !== activeCategoryId) {
        return false;
      }

      if (!query) {
        return true;
      }

      return `${section.title} ${section.id} ${section.categoryTitle}`.toLowerCase().includes(query);
    });
  }, [activeCategoryId, allSections, searchQuery]);

  const visibleSectionGroups = useMemo(() => {
    if (activeCategoryId !== 'all') {
      return [];
    }

    const visibleSectionIds = new Set(visibleSections.map((section) => section.id));

    return categories
      .map((category) => ({
        category,
        sections: allSections.filter((section) => (
          section.categoryId === category.id
          && visibleSectionIds.has(section.id)
        )),
      }))
      .filter((group) => group.sections.length > 0);
  }, [activeCategoryId, allSections, categories, visibleSections]);

  useEffect(() => {
    // A search reveals matching chapters/lessons, while allowing the user
    // to collapse them again even if the query remains active.
    if (!searchQuery.trim()) return;
    const matchingCategoryIds = activeCategoryId === 'all'
      ? visibleSectionGroups.map(({ category }) => category.id)
      : visibleSections.length > 0 ? [activeCategoryId] : [];
    setExpandedCategoryIds((current) => {
      if (matchingCategoryIds.every((id) => current.has(id))) return current;
      return new Set([...current, ...matchingCategoryIds]);
    });
    setExpandedLessonGroupIds((current) => {
      if (matchingCategoryIds.every((id) => current.has(id))) return current;
      return new Set([...current, ...matchingCategoryIds]);
    });
  }, [searchQuery, activeCategoryId, visibleSectionGroups, visibleSections.length]);

  const visibleSectionNumberById = useMemo(() => new Map(
    visibleSections.map((section, indexInList) => [section.id, indexInList + 1]),
  ), [visibleSections]);

  const videoByCategoryId = useMemo(() => new Map(
    (videoIndex?.items ?? []).map((item) => [item.categoryId, item]),
  ), [videoIndex]);
  const relatedApisByKnowledgeKey = useMemo(() => {
    const result = new Map<string, ApiKnowledgeRelation[]>();

    if (!apiDocument) {
      return result;
    }

    collectApiKnowledgeRelations(apiDocument).forEach((relation) => {
      const key = `${relation.sourcePath}#${relation.anchor}`;
      const current = result.get(key) ?? [];
      current.push(relation);
      result.set(key, current);
    });

    return result;
  }, [apiDocument]);

  useEffect(() => {
    setContentCache({});
    setLoadingSectionIds(new Set());
    setSectionErrors({});
    setOpenSummaryId(null);
    setExpandedSectionIds(new Set());
    setExpandedCategoryIds(new Set());
    setExpandedLessonGroupIds(new Set());
    setExpandedChapterSummaryIds(new Set());
  }, [index?.moduleId, index?.language]);

  useEffect(() => {
    setOpenSummaryId(null);
  }, [activeCategoryId]);

  useEffect(() => {
    let active = true;
    setSummaryIndex(null);
    setSummaryChapters({});
    setSummaryErrors(new Set());
    if (summaryIndexPath) {
      loadKnowledgeSummaryIndex(summaryIndexPath)
        .then((value) => { if (active) setSummaryIndex(value); })
        .catch(() => { if (active) setSummaryIndex(null); });
    }
    return () => { active = false; };
  }, [summaryIndexPath]);

  useEffect(() => {
    if (!summaryIndex || !index || summaryIndex.moduleId !== index.moduleId
      || summaryIndex.language !== index.language) return;
    let active = true;
    const items = summaryIndex.items.filter((item) => (
      (activeCategoryId === 'all' || activeCategoryId === item.categoryId)
      && !summaryChapters[item.categoryId] && !summaryErrors.has(item.categoryId)
    ));
    items.forEach((item) => {
      loadKnowledgeSummaryChapter(item.content)
        .then((chapter) => {
          if (active && chapter.moduleId === summaryIndex.moduleId
            && chapter.language === summaryIndex.language && chapter.categoryId === item.categoryId) {
            setSummaryChapters((current) => ({ ...current, [item.categoryId]: chapter }));
          }
        })
        .catch(() => {
          if (active) setSummaryErrors((current) => new Set(current).add(item.categoryId));
        });
    });
    return () => { active = false; };
  // Each visible chapter is requested once per index/category selection. Changes
  // to the result map must not cancel requests for sibling chapters.
  }, [summaryIndex, index?.moduleId, index?.language, activeCategoryId]);

  useEffect(() => {
    let active = true;

    setApiDocument(null);

    if (!apiBasePath || !index) {
      return () => {
        active = false;
      };
    }

    loadApiDocs(apiBasePath, index)
      .then((result) => {
        if (active) {
          setApiDocument(result);
        }
      })
      .catch(() => {
        if (active) {
          setApiDocument(null);
        }
      });

    return () => {
      active = false;
    };
  }, [apiBasePath, index]);

  useEffect(() => {
    let active = true;

    setVideoIndex(null);

    if (!videoIndexPath) {
      return () => {
        active = false;
      };
    }

    loadVideoIndex(videoIndexPath)
      .then((result) => {
        if (active) {
          setVideoIndex(result);
        }
      })
      .catch(() => {
        if (active) {
          setVideoIndex(null);
        }
      });

    return () => {
      active = false;
    };
  }, [videoIndexPath]);

  useEffect(() => {
    if (!previewOperationId) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('[data-related-api-control]')) {
        return;
      }
      setPreviewOperationId(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreviewOperationId(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [previewOperationId]);

  useEffect(() => {
    if (!selectedSectionId) {
      manuallyExpandedSectionRef.current = null;
      return;
    }
    const categoryId = allSections.find((section) => section.id === selectedSectionId)?.categoryId;
    if (categoryId) {
      setExpandedCategoryIds((current) => current.has(categoryId)
        ? current : new Set(current).add(categoryId));
      setExpandedLessonGroupIds((current) => current.has(categoryId)
        ? current : new Set(current).add(categoryId));
    }

    if (manuallyExpandedSectionRef.current !== selectedSectionId) {
      manuallyExpandedSectionRef.current = null;
    }

    setExpandedSectionIds((current) => {
      if (current.has(selectedSectionId)) {
        return current;
      }

      const next = new Set(current);
      next.add(selectedSectionId);
      return next;
    });
  }, [selectedSectionId, allSections]);

  useEffect(() => {
    const sectionsToLoad = allSections.filter((section) => (
      expandedSectionIds.has(section.id)
      && contentCache[section.content] === undefined
      && !loadingSectionIds.has(section.id)
      && sectionErrors[section.id] === undefined
    ));

    sectionsToLoad.forEach((section) => {
      setLoadingSectionIds((current) => {
        const next = new Set(current);
        next.add(section.id);
        return next;
      });

      fetchJavaAsset(section.content)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Unable to load section: ${response.status} ${response.statusText}`);
          }

          return response.text();
        })
        .then((markdown) => {
          setContentCache((current) => ({ ...current, [section.content]: markdown }));
          setLoadingSectionIds((current) => {
            const next = new Set(current);
            next.delete(section.id);
            return next;
          });
        })
        .catch((cause: unknown) => {
          setSectionErrors((current) => ({
            ...current,
            [section.id]: cause instanceof Error ? cause.message : 'Unable to load section.',
          }));
          setLoadingSectionIds((current) => {
            const next = new Set(current);
            next.delete(section.id);
            return next;
          });
        });
    });
  }, [allSections, contentCache, expandedSectionIds, loadingSectionIds, sectionErrors]);

  useEffect(() => {
    if (!selectedSectionId) {
      return;
    }

    // Clicking an accordion header is not a navigation request: keep the user's
    // scroll position instead of jumping to the beginning of that same lesson.
    if (!selectedSectionExpanded || manuallyExpandedSectionRef.current === selectedSectionId) {
      return;
    }

    const navigationKey = `${selectedSectionId}:${navigationSerial}`;
    if (lastNavigationKeyRef.current !== navigationKey) {
      lastNavigationKeyRef.current = navigationKey;
      autoScrollCancelledRef.current = false;
    }

    const frame = window.requestAnimationFrame(() => {
      if (autoScrollCancelledRef.current) return;
      const section = document.getElementById(`knowledge-section-${selectedSectionId}`);
      const topicNav = topicNavRef.current;
      if (!section || !topicNav) return;

      const headerHeight = document.querySelector<HTMLElement>('.topbar')?.getBoundingClientRect().height ?? 0;
      const moduleTabsHeight = document.querySelector<HTMLElement>('.module-tab-wrapper')?.getBoundingClientRect().height ?? 0;
      const topicNavHeight = topicNav.getBoundingClientRect().height;
      const visibleTop = headerHeight + moduleTabsHeight + topicNavHeight + 12;

      // Resolve the real DOM target by section id. Only the clearance above
      // that target is measured; no fixed pixel position or chapter index.
      window.scrollTo({
        top: Math.max(0, window.scrollY + section.getBoundingClientRect().top - visibleTop),
        // An immediate position is deterministic even if Markdown expands
        // asynchronously; this effect runs again once content is rendered.
        behavior: 'instant',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selectedSectionId, activeCategoryId, selectedSectionExpanded, selectedSectionSettled, navigationSerial]);

  useEffect(() => {
    if (!selectedSectionId || !selectedSectionExpanded || selectedSectionSettled
      || manuallyExpandedSectionRef.current === selectedSectionId) return;

    // Do not snap back after someone starts reading/scrolling during the fetch.
    const cancel = () => { autoScrollCancelledRef.current = true; };
    const cancelOnKey = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) cancel();
    };
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchmove', cancel, { passive: true });
    window.addEventListener('keydown', cancelOnKey);
    return () => {
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchmove', cancel);
      window.removeEventListener('keydown', cancelOnKey);
    };
  }, [selectedSectionId, selectedSectionExpanded, selectedSectionSettled]);

  useEffect(() => {
    const topicNav = topicNavRef.current;
    const header = document.querySelector<HTMLElement>('.topbar');
    const moduleTabs = document.querySelector<HTMLElement>('.module-tab-wrapper');
    if (!topicNav || !moduleTabs) return;

    const updateStickyPositions = () => {
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      const tabsHeight = moduleTabs.getBoundingClientRect().height;
      moduleTabs.style.top = `${headerHeight}px`;
      topicNav.style.top = `${headerHeight + tabsHeight}px`;
      panelRef.current?.style.setProperty(
        '--knowledge-lesson-top',
        `${headerHeight + tabsHeight + topicNav.getBoundingClientRect().height}px`,
      );
    };

    updateStickyPositions();
    const resizeObserver = new ResizeObserver(updateStickyPositions);
    if (header) resizeObserver.observe(header);
    resizeObserver.observe(moduleTabs);
    resizeObserver.observe(topicNav);
    window.addEventListener('resize', updateStickyPositions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateStickyPositions);
      moduleTabs.style.removeProperty('top');
      topicNav.style.removeProperty('top');
      panelRef.current?.style.removeProperty('--knowledge-lesson-top');
    };
  }, []);

  useEffect(() => {
    if (!openSummaryId) return;
    let frame = 0;
    summaryEnteredStickyRef.current = false;
    const checkOwner = () => {
      frame = 0;
      const card = document.getElementById(`knowledge-section-${openSummaryId}`);
      const sticky = card?.querySelector<HTMLElement>('.knowledge-card__sticky');
      const top = panelRef.current
        ? Number.parseFloat(panelRef.current.style.getPropertyValue('--knowledge-lesson-top')) || 0
        : 0;
      if (!card || !sticky) {
        setOpenSummaryId(null);
        return;
      }
      const rect = card.getBoundingClientRect();
      const stickyHeight = sticky.getBoundingClientRect().height;
      if (rect.top <= top + 2 && rect.bottom > top + stickyHeight) {
        summaryEnteredStickyRef.current = true;
      }
      if (rect.bottom <= top + stickyHeight + 2
        || (summaryEnteredStickyRef.current && rect.top > top + 2)) {
        setOpenSummaryId(null);
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(checkOwner);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [openSummaryId]);

  useEffect(() => {
    const strip = topicStripRef.current;

    if (!strip) {
      return;
    }

    const updateScrollState = () => {
      const remaining = strip.scrollWidth - strip.clientWidth - strip.scrollLeft;
      setCanScrollTopicsLeft(strip.scrollLeft > 2);
      setCanScrollTopicsRight(remaining > 2);
    };

    updateScrollState();
    strip.addEventListener('scroll', updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(strip);

    return () => {
      strip.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [categories.length, index?.language, index?.moduleId]);

  useEffect(() => {
    const strip = topicStripRef.current;
    const key = activeCategoryId === 'all' ? 'all' : activeCategoryId;
    const activeButton = topicButtonRefs.current[key];

    if (!strip || !activeButton) {
      return;
    }

    // Center the active category horizontally without scrolling the window.
    strip.scrollTo({
      left: strip.scrollLeft + activeButton.getBoundingClientRect().left
        - strip.getBoundingClientRect().left
        - (strip.clientWidth - activeButton.getBoundingClientRect().width) / 2,
      behavior: 'smooth',
    });
  }, [activeCategoryId, index?.language, index?.moduleId]);

  const showCategoryMenu = (categoryId: string, button: HTMLButtonElement) => {
    if (draggingTopics) return;
    const bounds = topicNavRef.current?.getBoundingClientRect();
    if (!bounds) return;

    // The tab strip scrolls horizontally. Keep its dropdown outside that
    // overflow container and clamp the dropdown within the Knowledge width.
    const menuWidth = Math.min(420, bounds.width - 16);
    const left = Math.max(8, Math.min(button.getBoundingClientRect().left - bounds.left, bounds.width - menuWidth - 8));
    setHoverMenuLeft(left);
    setHoveredCategoryId(categoryId);
  };

  const scrollTopics = (direction: -1 | 1) => {
    setHoveredCategoryId(null);
    const strip = topicStripRef.current;

    if (!strip) {
      return;
    }

    strip.scrollBy({
      left: direction * 180,
      behavior: 'smooth',
    });
  };

  const handleTopicPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    const strip = topicStripRef.current;
    if (!strip) {
      return;
    }

    topicDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: strip.scrollLeft,
      dragged: false,
      active: true,
    };
  };

  const handleTopicPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const strip = topicStripRef.current;
    const drag = topicDragRef.current;

    if (!strip || !drag.active || drag.pointerId !== event.pointerId) {
      return;
    }

    const delta = event.clientX - drag.startX;
    if (!drag.dragged && Math.abs(delta) > 5) {
      drag.dragged = true;
      setDraggingTopics(true);
      setHoveredCategoryId(null);

      if (!strip.hasPointerCapture(event.pointerId)) {
        strip.setPointerCapture(event.pointerId);
      }
    }

    if (!drag.dragged) {
      return;
    }

    event.preventDefault();
    strip.scrollLeft = drag.startScrollLeft - delta;
  };

  const finishTopicDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const strip = topicStripRef.current;
    const drag = topicDragRef.current;

    if (!drag.active || drag.pointerId !== event.pointerId) {
      return;
    }

    suppressTopicClickRef.current = drag.dragged;
    window.setTimeout(() => {
      suppressTopicClickRef.current = false;
    }, 0);
    topicDragRef.current = {
      pointerId: -1,
      startX: 0,
      startScrollLeft: 0,
      dragged: false,
      active: false,
    };
    setDraggingTopics(false);

    if (strip?.hasPointerCapture(event.pointerId)) {
      strip.releasePointerCapture(event.pointerId);
    }
  };

  const toggleSection = (sectionId: string) => {
    const willExpand = !expandedSectionIds.has(sectionId);

    manuallyExpandedSectionRef.current = willExpand ? sectionId : null;
    setOpenSummaryId((current) => current === sectionId && willExpand ? current : null);

    setExpandedSectionIds((current) => {
      const next = new Set(current);

      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }

      return next;
    });

    if (willExpand) {
      setSectionErrors((current) => {
        if (current[sectionId] === undefined) {
          return current;
        }

        const next = { ...current };
        delete next[sectionId];
        return next;
      });
      onSectionChange(sectionId);
    } else if (selectedSectionId === sectionId) {
      onSectionChange(null);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategoryIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const toggleLessonGroup = (categoryId: string) => {
    setExpandedLessonGroupIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const openCategoryForLesson = (categoryId: string) => {
    setExpandedCategoryIds((current) => new Set(current).add(categoryId));
    setExpandedLessonGroupIds((current) => new Set(current).add(categoryId));
  };

  const renderChapterSummary = (categoryId: string) => {
    const chapter = summaryChapters[categoryId];
    if (!chapter?.section || (typeof chapter.section === 'string' && !chapter.section.trim())) return null;
    const roadmap = typeof chapter.section === 'string'
      ? legacyChapterSummaryRoadmap(chapter.section, chapter.summaries)
      : chapter.section;
    return (
      <section className="knowledge-chapter-summary" aria-label={language === 'vi' ? 'Tóm tắt chương' : 'Chapter summary'}>
        <button type="button" className="knowledge-chapter-summary__heading knowledge-accordion-toggle"
          aria-expanded={expandedChapterSummaryIds.has(categoryId)}
          aria-controls={`knowledge-chapter-summary-content-${categoryId}`}
          onClick={() => setExpandedChapterSummaryIds((current) => {
            const next = new Set(current);
            if (next.has(categoryId)) next.delete(categoryId);
            else next.add(categoryId);
            return next;
          })}>
          {language === 'vi' ? 'Tóm tắt chương' : 'Chapter summary'}
          <span className="knowledge-accordion-chevron" aria-hidden="true">
            {expandedChapterSummaryIds.has(categoryId) ? '−' : '+'}
          </span>
        </button>
        {expandedChapterSummaryIds.has(categoryId) && (
        <div id={`knowledge-chapter-summary-content-${categoryId}`} className="knowledge-chapter-summary__scroll markdown-content">
          {roadmap ? (
            <>
              <div className="knowledge-roadmap" aria-label={language === 'vi' ? 'Lộ trình các bài học' : 'Lesson roadmap'}>
                <h2 className="knowledge-roadmap__heading">1. {roadmap.roadmapHeading}</h2>
                {roadmap.roadmap.map((step, index) => (
                  <div className="knowledge-roadmap__group" key={step.id}>
                    <div className="knowledge-roadmap__step">
                      <div className="knowledge-roadmap__number" aria-hidden="true">{step.order}</div>
                      <div className="knowledge-roadmap__card">
                        <h3>{language === 'vi' ? 'Bài' : 'Lesson'} {step.order} — {step.title}</h3>
                        <div className="knowledge-roadmap__description">
                          <MermaidMarkdown>{step.description}</MermaidMarkdown>
                        </div>
                      </div>
                    </div>
                    {step.transition && (
                      <div className="knowledge-roadmap__connector">
                        <div className="knowledge-roadmap__connector-arrow" aria-hidden="true">↓</div>
                        <div className="knowledge-roadmap__connector-copy">
                          <MermaidMarkdown>{step.transition.description}</MermaidMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {roadmap.comparisonMarkdown && (
                <div className="knowledge-chapter-summary__comparison">
                  <MermaidMarkdown scrollTables tableScrollLabel={language === 'vi' ? 'Cuộn ngang để xem hết các cột' : 'Scroll sideways to view all columns'}>{roadmap.comparisonMarkdown}</MermaidMarkdown>
                </div>
              )}
            </>
          ) : (
            <MermaidMarkdown scrollTables tableScrollLabel={language === 'vi' ? 'Cuộn ngang để xem hết các cột' : 'Scroll sideways to view all columns'}>{chapter.section as string}</MermaidMarkdown>
          )}
        </div>
        )}
      </section>
    );
  };

  const renderSectionCard = (
    section: KnowledgeSectionRef,
    options: {
      showIndex: boolean;
      showCategory: boolean;
    },
  ) => {
    const expanded = expandedSectionIds.has(section.id);
    const markdown = contentCache[section.content];
    const isLoading = loadingSectionIds.has(section.id);
    const sectionError = sectionErrors[section.id];
    const relatedApis = relatedApisByKnowledgeKey.get(`${section.sourcePath}#${section.id}`) ?? [];
    const sectionNumber = visibleSectionNumberById.get(section.id);
    const summaryChapter = summaryChapters[section.categoryId];
    const lessonSummary = summaryChapter?.summaries.find((item) => item.id === section.id)
      ?? summaryChapter?.summaries.find((item) => (
        formatKnowledgeDisplayTitle(item.title) === formatKnowledgeDisplayTitle(section.title)
      ));
    const summaryOpen = openSummaryId === section.id;

    return (
      <article key={section.id} id={`knowledge-section-${section.id}`} className={`knowledge-card${expanded ? ' is-expanded' : ''}${section.isImportant === true ? ' is-important' : ''}`}>
        <div className="knowledge-card__sticky">
          <div className={`knowledge-card__header${options.showIndex ? '' : ' knowledge-card__header--without-index'}`}>
            <button type="button" className="knowledge-card__trigger"
              onClick={() => toggleSection(section.id)} aria-expanded={expanded}>
              {options.showIndex && sectionNumber !== undefined && (
                <span className="knowledge-card__index">#{sectionNumber}</span>
              )}
              <span className="knowledge-card__title-group">
                <span className="knowledge-card__title-row">
                  <span className="knowledge-card__title">{formatKnowledgeDisplayTitle(section.title)}</span>
                  {section.isImportant === true && (
                    <CustomTooltip content={language === 'vi'
                      ? 'Kiến thức quan trọng cần phải học'
                      : 'Essential knowledge you should learn'}>
                      <span className="knowledge-important-star" role="img" aria-label={language === 'vi' ? 'Kiến thức quan trọng cần phải học' : 'Essential knowledge you should learn'} title={language === 'vi' ? 'Kiến thức quan trọng cần phải học' : 'Essential knowledge you should learn'}>★</span>
                    </CustomTooltip>
                  )}
                </span>
                {options.showCategory && (
                  <span className="knowledge-card__category">{section.categoryTitle}</span>
                )}
              </span>
            </button>
            <span className="knowledge-card__metadata">
              <span className={`knowledge-card__level knowledge-card__level--${section.difficulty.toLowerCase()}`}>
                {resolveDifficultyLabel(section.difficulty, language)}
              </span>
              {lessonSummary && (
                <button type="button" className={`knowledge-card__summary-toggle${summaryOpen ? ' is-active' : ''}`}
                  aria-expanded={summaryOpen} aria-controls={`knowledge-summary-${section.id}`}
                  onClick={() => {
                    if (!expanded) toggleSection(section.id);
                    setOpenSummaryId((current) => current === section.id ? null : section.id);
                  }}>
                  {language === 'vi' ? 'Tóm tắt' : 'Summary'}
                </button>
              )}
            </span>
            <button type="button" className="knowledge-card__expand"
              onClick={() => toggleSection(section.id)}
              aria-label={expanded ? (language === 'vi' ? 'Đóng bài học' : 'Collapse lesson')
                : (language === 'vi' ? 'Mở bài học' : 'Expand lesson')}
              aria-expanded={expanded}>
              {expanded ? '−' : '+'}
            </button>
          </div>
          {summaryOpen && lessonSummary && (
            <div id={`knowledge-summary-${section.id}`} className="knowledge-card__summary">
              <div className="knowledge-card__summary-heading">
                <strong>{language === 'vi' ? 'Tóm tắt bài học' : 'Lesson summary'}</strong>
                <button type="button" onClick={() => setOpenSummaryId(null)}
                  aria-label={language === 'vi' ? 'Tắt tóm tắt' : 'Close summary'}>×</button>
              </div>
              <div className="knowledge-card__summary-scroll markdown-content">
                <MermaidMarkdown scrollTables tableScrollLabel={language === 'vi' ? 'Cuộn ngang để xem hết các cột' : 'Scroll sideways to view all columns'}>{lessonSummary.summary}</MermaidMarkdown>
              </div>
            </div>
          )}
        </div>

        {expanded && (
          <div className="knowledge-card__body">
            {isLoading && <div className="knowledge-section-status">{language === 'vi' ? 'Đang tải nội dung...' : 'Loading content...'}</div>}

            {!isLoading && sectionError && (
              <div className="knowledge-section-status knowledge-section-status--error">{sectionError}</div>
            )}

            {!isLoading && markdown !== undefined && (
              <div className="markdown-content knowledge-card__markdown">
                <MermaidMarkdown>{markdown}</MermaidMarkdown>
              </div>
            )}

            {relatedApis.length > 0 && (
              <section className="knowledge-related-apis">
                <div className="knowledge-related-apis__heading">
                  <strong>{language === 'vi' ? 'API liên quan' : 'Related APIs'} · {relatedApis.length}</strong>
                </div>

                <div className="knowledge-related-apis__list">
                  {relatedApis.map(({ controller, operation }) => {
                    const previewOpen = previewOperationId === operation.id;
                    const sanitizedExecution = operation.executionHtml
                      ? DOMPurify.sanitize(operation.executionHtml)
                      : '';

                    return (
                      <div
                        key={operation.id}
                        className="knowledge-related-api-control"
                        data-related-api-control
                      >
                        <button
                          type="button"
                          className="knowledge-related-api-row"
                          onClick={() => setPreviewOperationId((current) => (
                            current === operation.id ? null : operation.id
                          ))}
                        >
                          <span className={`http-method http-method--${operation.httpMethod.toLowerCase()}`}>
                            {operation.httpMethod}
                          </span>
                          <code>{operation.path || '—'}</code>
                          <span className="knowledge-related-api-row__copy">
                            <strong>{operation.summary}</strong>
                            <small>{controller.title}</small>
                          </span>
                        </button>

                        {previewOpen && (
                          <div className="knowledge-related-api-popover" role="dialog" aria-label={operation.summary}>
                            <div className="knowledge-related-api-popover__header">
                              <span className={`http-method http-method--${operation.httpMethod.toLowerCase()}`}>
                                {operation.httpMethod}
                              </span>
                              <code>{operation.path || '—'}</code>
                            </div>

                            <div className="knowledge-related-api-popover__body">
                              <div className="knowledge-related-api-popover__basic-info">
                                <strong>{operation.summary}</strong>
                                {operation.description && <p>{operation.description}</p>}
                                <small>{controller.title} · {operation.methodSignature}</small>
                              </div>

                              <section>
                                <h4>Execution</h4>
                                {sanitizedExecution ? (
                                  <div
                                    className="api-execution-content"
                                    dangerouslySetInnerHTML={{ __html: sanitizedExecution }}
                                  />
                                ) : (
                                  <p className="api-operation__empty-detail">
                                    {language === 'vi' ? 'Chưa có mô tả execution.' : 'No execution description yet.'}
                                  </p>
                                )}
                              </section>

                              {operation.params.length > 0 && (
                                <section>
                                  <h4>{language === 'vi' ? 'Tham số' : 'Parameters'}</h4>
                                  <div className="api-param-list">
                                    {operation.params.map((param) => (
                                      <div key={param.name} className="api-param">
                                        <code>{param.name}</code>
                                        <span>
                                          <strong>{param.summary || param.name}</strong>
                                          {param.description && <small>{param.description}</small>}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              )}
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </article>
    );
  };

  const renderLessonsGroup = (
    categoryId: string,
    sections: KnowledgeSectionRef[],
    showIndex: boolean,
  ) => {
    const expanded = expandedLessonGroupIds.has(categoryId);
    return (
      <>
        <button type="button" className="knowledge-lessons-heading knowledge-lessons-heading--toggle"
          aria-expanded={expanded} aria-controls={`knowledge-lessons-${categoryId}`}
          onClick={() => toggleLessonGroup(categoryId)}>
          <span>{language === 'vi' ? 'BÀI HỌC' : 'LESSONS'}</span>
          <span className="knowledge-lessons-heading__line" aria-hidden="true" />
          <span className="knowledge-lessons-heading__count">{sections.length}</span>
          <span className="knowledge-accordion-chevron" aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
        {expanded && (
          <div id={`knowledge-lessons-${categoryId}`} className="knowledge-category-group__sections">
            {sections.map((section) => renderSectionCard(section, {
              showIndex,
              showCategory: !showIndex,
            }))}
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return <div className="empty-state empty-state--large"><strong>{language === 'vi' ? 'Đang tải Knowledge...' : 'Loading Knowledge...'}</strong></div>;
  }

  if (error) {
    return (
      <div className="empty-state empty-state--large">
        <strong>{language === 'vi' ? 'Không thể tải Knowledge' : 'Unable to load Knowledge'}</strong>
        <span>{error}</span>
      </div>
    );
  }

  if (!index) {
    return (
      <div className="empty-state empty-state--large">
        <strong>{language === 'vi' ? 'Chưa có dữ liệu Knowledge' : 'No Knowledge data yet'}</strong>
      </div>
    );
  }

  return (
    <section className="knowledge-panel" ref={panelRef}>
      <div
        ref={topicNavRef}
        className="knowledge-topic-nav"
        onPointerLeave={() => setHoveredCategoryId(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHoveredCategoryId(null);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setHoveredCategoryId(null);
            topicButtonRefs.current[hoveredCategoryId ?? 'all']?.focus();
          }
        }}
      >
        <button
          type="button"
          className="knowledge-topic-nav__scroll"
          onClick={() => scrollTopics(-1)}
          disabled={!canScrollTopicsLeft}
          aria-label={language === 'vi' ? 'Cuộn danh mục sang trái' : 'Scroll categories left'}
        >
          ‹
        </button>

        <div
          ref={topicStripRef}
          className={`knowledge-topic-strip${draggingTopics ? ' is-dragging' : ''}`}
          aria-label="Knowledge categories"
          onScroll={() => setHoveredCategoryId(null)}
          onPointerDown={handleTopicPointerDown}
          onPointerMove={handleTopicPointerMove}
          onPointerUp={finishTopicDrag}
          onPointerCancel={finishTopicDrag}
          onClickCapture={(event) => {
            if (!suppressTopicClickRef.current) {
              return;
            }

            suppressTopicClickRef.current = false;
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <button
            ref={(element) => { topicButtonRefs.current.all = element; }}
            type="button"
            className={`knowledge-topic-strip__button${activeCategoryId === 'all' ? ' is-active' : ''}`}
            onClick={() => {
              onCategoryChange('all');
              setHoveredCategoryId('all');
            }}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'touch') showCategoryMenu('all', event.currentTarget);
            }}
            onFocus={(event) => showCategoryMenu('all', event.currentTarget)}
            aria-expanded={hoveredCategoryId === 'all'}
            aria-haspopup="true"
          >
            {language === 'vi' ? 'Tất cả' : 'All'}
            <span>{index.sectionCount}</span>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              ref={(element) => { topicButtonRefs.current[category.id] = element; }}
              type="button"
              className={`knowledge-topic-strip__button${activeCategoryId === category.id ? ' is-active' : ''}`}
              onClick={() => {
                setHoveredCategoryId(null);
                onCategoryChange(category.id);
              }}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'touch') showCategoryMenu(category.id, event.currentTarget);
              }}
              onFocus={(event) => showCategoryMenu(category.id, event.currentTarget)}
              aria-expanded={hoveredCategoryId === category.id}
              aria-haspopup="true"
            >
              {category.title}
              <span>{category.sections.length}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="knowledge-topic-nav__scroll"
          onClick={() => scrollTopics(1)}
          disabled={!canScrollTopicsRight}
          aria-label={language === 'vi' ? 'Cuộn danh mục sang phải' : 'Scroll categories right'}
        >
          ›
        </button>

        {(hoveredCategoryId === 'all' || hoveredCategory) && !draggingTopics && (
          <div
            className="knowledge-topic-flyout"
            style={{ left: hoverMenuLeft }}
            aria-label={hoveredCategoryId === 'all'
              ? (language === 'vi' ? 'Danh sách chương' : 'Chapters')
              : hoveredCategory!.title}
          >
            <div className="knowledge-topic-flyout__heading">
              {hoveredCategoryId === 'all'
                ? (language === 'vi' ? 'Các chương' : 'Chapters')
                : hoveredCategory!.title}
              <span>{hoveredCategoryId === 'all' ? categories.length : hoveredCategory!.sections.length}</span>
            </div>
            <div className="knowledge-topic-flyout__items">
              {hoveredCategoryId === 'all' ? categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className="knowledge-topic-flyout__item knowledge-topic-flyout__chapter"
                  onClick={() => {
                    setHoveredCategoryId(null);
                    onCategoryChange(category.id);
                  }}
                >
                  <span>{category.title}</span>
                  <span className="knowledge-topic-flyout__chapter-count">{category.sections.length}</span>
                </button>
              )) : sortKnowledgeSectionsByDifficulty(hoveredCategory!.sections).map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className="knowledge-topic-flyout__item"
                  onClick={() => {
                    setHoveredCategoryId(null);
                    openCategoryForLesson(hoveredCategory!.id);
                    manuallyExpandedSectionRef.current = null;
                    // Re-selecting an already open lesson must scroll to it too.
                    setNavigationSerial((current) => current + 1);
                    onNavigateToSection(hoveredCategory!.id, section.id);
                  }}
                >
                  {formatKnowledgeDisplayTitle(section.title)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="knowledge-list">
        {activeCategoryId === 'all'
          ? visibleSectionGroups.map(({ category, sections }) => {
            const expanded = expandedCategoryIds.has(category.id);
            return (
              <section key={category.id} className="knowledge-category-group">
                <button type="button" className="knowledge-category-group__header knowledge-accordion-toggle"
                  aria-expanded={expanded} aria-controls={`knowledge-category-content-${category.id}`}
                  onClick={() => toggleCategory(category.id)}>
                  <span className="knowledge-category-group__title">{category.title}</span>
                  <span className="knowledge-category-group__actions">
                    <span className="knowledge-category-group__count">
                      {sections.length} {language === 'vi' ? 'section' : sections.length === 1 ? 'section' : 'sections'}
                    </span>
                    <span className="knowledge-accordion-chevron" aria-hidden="true">{expanded ? '−' : '+'}</span>
                  </span>
                </button>
                {expanded && (
                  <div id={`knowledge-category-content-${category.id}`} className="knowledge-category-group__content">
                    {videoByCategoryId.has(category.id) && (
                      <div className="knowledge-category-group__video">
                        <KnowledgeVideoPanel item={videoByCategoryId.get(category.id)!} compact />
                      </div>
                    )}
                    {renderChapterSummary(category.id)}
                    {renderLessonsGroup(category.id, sections, true)}
                  </div>
                )}
              </section>
            );
          })
          : (
            <>
              {videoByCategoryId.has(activeCategoryId) && (
                <KnowledgeVideoPanel item={videoByCategoryId.get(activeCategoryId)!} />
              )}
              {renderChapterSummary(activeCategoryId)}
              {renderLessonsGroup(activeCategoryId, visibleSections, false)}
            </>
          )}

        {visibleSections.length === 0 && (
          <div className="empty-state">
            <strong>{language === 'vi' ? 'Không tìm thấy kiến thức phù hợp' : 'No matching knowledge found'}</strong>
            <span>
              {language === 'vi'
                ? 'Thử đổi category hoặc từ khoá tìm kiếm.'
                : 'Try another category or search term.'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
