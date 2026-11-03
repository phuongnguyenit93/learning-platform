import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren, type RefObject } from 'react';
import { useLanguage } from '../state/LanguageContext';

type FullscreenMode = 'native' | 'focus' | null;

type ReadingFullscreenControls = {
  fullscreenMode: FullscreenMode;
  toggleFullscreen: () => void;
};

/** Fullscreen lives on the shared module pane, keeping tab navigation mounted
 * and interactive while readers switch Knowledge / Quiz / Interview / Cases. */
export const ReadingFullscreenContext = createContext<ReadingFullscreenControls | null>(null);

function getActiveReadingPanel(main: HTMLElement): HTMLElement | null {
  return main.querySelector<HTMLElement>(
    '.learning-tab-panel:not(.learning-tab-panel--inactive) .reading-fullscreen-surface',
  );
}

function readingOffset(main: HTMLElement): number {
  const panel = getActiveReadingPanel(main);
  if (!panel) return 0;
  return Math.max(0, main.getBoundingClientRect().top - panel.getBoundingClientRect().top);
}

function alignReadingPosition(main: HTMLElement, offset: number, fullscreen: boolean): void {
  const panel = getActiveReadingPanel(main);
  if (!panel) return;
  const tabsHeight = fullscreen
    ? (main.querySelector<HTMLElement>('.module-tab-wrapper')?.getBoundingClientRect().height ?? 0)
    : 0;
  main.scrollTop += panel.getBoundingClientRect().top
    - main.getBoundingClientRect().top + offset - tabsHeight;
}

export function useModuleReadingFullscreen(mainRef: RefObject<HTMLElement | null>): ReadingFullscreenControls {
  const [fullscreenMode, setFullscreenMode] = useState<FullscreenMode>(null);
  const modeRef = useRef<FullscreenMode>(null);
  const offsetRef = useRef(0);

  const toggleFullscreen = () => {
    const main = mainRef.current;
    if (!main || !main.classList.contains('learning-main--reading')) return;
    if (document.fullscreenElement === main) {
      void document.exitFullscreen();
      return;
    }
    if (modeRef.current === 'focus') {
      const offset = readingOffset(main);
      modeRef.current = null;
      setFullscreenMode(null);
      window.requestAnimationFrame(() => alignReadingPosition(main, offset, false));
      return;
    }

    offsetRef.current = readingOffset(main);
    const activateFocusMode = () => {
      modeRef.current = 'focus';
      setFullscreenMode('focus');
      window.requestAnimationFrame(() => alignReadingPosition(main, offsetRef.current, true));
    };
    if (typeof main.requestFullscreen === 'function') {
      void main.requestFullscreen().catch(activateFocusMode);
    } else {
      activateFocusMode();
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      const main = mainRef.current;
      if (!main) return;
      if (document.fullscreenElement === main) {
        modeRef.current = 'native';
        setFullscreenMode('native');
        window.requestAnimationFrame(() => alignReadingPosition(main, offsetRef.current, true));
      } else if (modeRef.current === 'native') {
        modeRef.current = null;
        setFullscreenMode(null);
        window.requestAnimationFrame(() => alignReadingPosition(main, offsetRef.current, false));
      }
    };
    const trackReading = (event: Event) => {
      const main = mainRef.current;
      if (main && event.target === main && modeRef.current) {
        offsetRef.current = readingOffset(main);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    // The module pane can mount after the catalog finishes loading. Capture
    // scroll on document so it still works when the ref was null at mount.
    document.addEventListener('scroll', trackReading, { capture: true, passive: true });
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('scroll', trackReading, true);
    };
  }, [mainRef]);

  useEffect(() => {
    if (fullscreenMode !== 'focus') return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const main = mainRef.current;
      if (!main) return;
      const offset = readingOffset(main);
      modeRef.current = null;
      setFullscreenMode(null);
      window.requestAnimationFrame(() => alignReadingPosition(main, offset, false));
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [fullscreenMode, mainRef]);

  return { fullscreenMode, toggleFullscreen };
}

/** All four reading tabs scroll the main pane; fullscreen owns its own scroll. */
export function getReadingScroller(panel: HTMLElement | null): HTMLElement | null {
  if (!panel) return null;
  if (document.fullscreenElement === panel || panel.classList.contains('is-focus-mode')) return panel;
  return panel.closest<HTMLElement>('.learning-main--reading')
    ?? panel.closest<HTMLElement>('.learning-tab-panel');
}

function restoreReadingScroll(panel: HTMLElement, offsetWithinPanel: number): void {
  const scroller = panel.closest<HTMLElement>('.learning-main--reading')
    ?? panel.closest<HTMLElement>('.learning-tab-panel');
  if (!scroller) return;
  scroller.scrollTop += panel.getBoundingClientRect().top
    - scroller.getBoundingClientRect().top + offsetWithinPanel;
}

export function useReadingFullscreen(ready = true) {
  const shared = useContext(ReadingFullscreenContext);
  const panelRef = useRef<HTMLElement>(null);
  const [fullscreenMode, setFullscreenMode] = useState<FullscreenMode>(null);
  const readingOffsetRef = useRef(0);
  const nativeFullscreenRef = useRef(false);

  const exitFocusMode = () => {
    const panel = panelRef.current;
    if (!panel) return;
    const offset = panel.scrollTop;
    setFullscreenMode(null);
    window.requestAnimationFrame(() => restoreReadingScroll(panel, offset));
  };

  const toggleFullscreen = () => {
    if (shared) {
      shared.toggleFullscreen();
      return;
    }
    const panel = panelRef.current;
    if (!panel) return;
    if (document.fullscreenElement === panel) {
      void document.exitFullscreen();
      return;
    }
    if (fullscreenMode === 'focus') {
      exitFocusMode();
      return;
    }

    const scroller = getReadingScroller(panel);
    readingOffsetRef.current = scroller
      ? Math.max(0, scroller.getBoundingClientRect().top - panel.getBoundingClientRect().top)
      : 0;

    const activateFocusMode = () => {
      setFullscreenMode('focus');
      window.requestAnimationFrame(() => { panel.scrollTop = readingOffsetRef.current; });
    };
    if (typeof panel.requestFullscreen === 'function') {
      void panel.requestFullscreen().catch(activateFocusMode);
    } else {
      activateFocusMode();
    }
  };

  useEffect(() => {
    if (shared) return;
    const panel = panelRef.current;
    if (!panel) return;
    const onFullscreenChange = () => {
      if (document.fullscreenElement === panel) {
        nativeFullscreenRef.current = true;
        setFullscreenMode('native');
        window.requestAnimationFrame(() => { panel.scrollTop = readingOffsetRef.current; });
      } else if (nativeFullscreenRef.current) {
        nativeFullscreenRef.current = false;
        const offset = readingOffsetRef.current;
        setFullscreenMode(null);
        window.requestAnimationFrame(() => restoreReadingScroll(panel, offset));
      }
    };
    const rememberFullscreenScroll = () => {
      if (document.fullscreenElement === panel) readingOffsetRef.current = panel.scrollTop;
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    panel.addEventListener('scroll', rememberFullscreenScroll, { passive: true });
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      panel.removeEventListener('scroll', rememberFullscreenScroll);
    };
  }, [ready, shared]);

  useEffect(() => {
    if (shared || fullscreenMode !== 'focus') return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') exitFocusMode();
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [fullscreenMode, shared]);

  return { panelRef, fullscreenMode: shared?.fullscreenMode ?? fullscreenMode, toggleFullscreen };
}

export function ReadingFullscreenToolbar({ fullscreenMode, onToggle }: {
  fullscreenMode: FullscreenMode;
  onToggle: () => void;
}) {
  const { language } = useLanguage();
  const fullscreen = Boolean(fullscreenMode);
  const label = fullscreen
    ? (language === 'vi' ? 'Thoát toàn màn hình' : 'Exit fullscreen')
    : (language === 'vi' ? 'Toàn màn hình' : 'Fullscreen');
  return (
    <div className="reading-fullscreen-toolbar">
      <button type="button" className="reading-fullscreen-button" onClick={onToggle}
        aria-label={label} aria-pressed={fullscreen} title={fullscreen ? `${label} (Esc)` : label}>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {fullscreen
            ? <path d="M9 3v6H3M15 21v-6h6M3 9l6-6M21 15l-6 6" />
            : <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" />}
        </svg>
        <span>{label}</span>
      </button>
    </div>
  );
}

/** Shared reading surface for Quiz, Interview and Case Study. */
export function QuestionReadingFrame({ children }: PropsWithChildren) {
  const { panelRef, fullscreenMode, toggleFullscreen } = useReadingFullscreen();
  return (
    <section ref={panelRef} className={`reading-fullscreen-surface question-reading-frame${fullscreenMode === 'focus' ? ' is-focus-mode' : ''}`}>
      <div className="question-reading-frame__sticky">
        <ReadingFullscreenToolbar fullscreenMode={fullscreenMode} onToggle={toggleFullscreen} />
      </div>
      {children}
    </section>
  );
}
