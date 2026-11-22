import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { topicKnowledgePath } from '../data/topicRoutes';
import { calculateModulePickerPosition, type ModulePickerPosition } from '../data/modulePickerPosition';
import { getCurrentUser } from '../data/auth';
import { fetchAdminStructure, projectAdminNodes, type AdminStructure, type AdminTreeNode,
  type GroupEditorTarget } from '../data/groupAdmin';
import { GroupFormDialog, GroupStructureDialog, ModuleFormDialog } from './GroupAdminDialogs';
// Knowledge search is disabled until its oversized index is replaced.
const KNOWLEDGE_SEARCH_ENABLED = false;
import { loadKnowledgeSearchIndex, searchKnowledge } from '../data/knowledgeSearch';
import { collectRealModules, formatCatalogName } from '../data/moduleCatalog';
import { getModuleStepTooltip } from '../data/moduleStepTooltips';
import { isCountedRealModule, projectCountedRealModules } from '../data/realModuleFilter';
import { useLanguage } from '../state/LanguageContext';
import { CustomTooltip } from './CustomTooltip';
import type {
  KnowledgeSearchIndex,
  KnowledgeSearchResult,
  ModuleCatalogNode,
} from '../types/learning';

interface ModuleSidebarProps {
  nodes: ModuleCatalogNode[];
  activeModuleId: string;
  /** DB-backed Topic ID; only these sidebars offer Group administration. */
  topicId?: number;
  onStructureChanged?: () => void;
  /** Disable the static content-count filter while navigation is sourced from DB. */
  enableRealModulesFilter?: boolean;
  knowledgeCounts: Record<string, number>;
  quizCounts: Record<string, number>;
  interviewCounts: Record<string, number>;
  caseStudyCounts: Record<string, number>;
  roadmapAvailability: Record<string, boolean>;
  contentCountsState: 'loading' | 'ready' | 'error';
  onRetryContentCounts: () => void;
}

interface TreeNodeProps {
  node: ModuleCatalogNode;
  depth: number;
  activeModuleId: string;
  knowledgeCounts: Record<string, number>;
  quizCounts: Record<string, number>;
  interviewCounts: Record<string, number>;
  caseStudyCounts: Record<string, number>;
  roadmapAvailability: Record<string, boolean>;
  filter: string;
  knowledgeSearchActive: boolean;
  knowledgeMatchModuleIds: ReadonlySet<string>;
  expandRequest: SidebarExpandRequest;
  showEntireSubtree?: boolean;
  renderAsPicker?: boolean;
  onEditGroup?: (node: ModuleCatalogNode) => void;
  onEditModule?: (node: ModuleCatalogNode) => void;
}

interface SidebarExpandRequest {
  version: number;
  expanded: boolean;
}

interface ModulePickerEntry {
  node: ModuleCatalogNode;
  sequence: number;
}

type ModuleTreeCssProperties = CSSProperties & {
  '--module-tree-depth'?: number;
};

function moduleTreeIndentStyle(depth: number): ModuleTreeCssProperties {
  return {
    '--module-tree-depth': depth,
  };
}

function ModuleTreeIndent({ depth }: { depth: number }) {
  return (
    <span
      className="module-tree__indent"
      style={moduleTreeIndentStyle(depth)}
      aria-hidden="true"
    />
  );
}

interface ModuleSearchMetadata {
  displayName: string;
  hierarchy: string;
}

const MODULE_PICKER_OPEN_EVENT = 'java-learning:module-picker-open';
const KNOWLEDGE_RESULTS_PAGE_SIZE = 12;

function nodeMatchesSelf(node: ModuleCatalogNode, filter: string): boolean {
  if (!filter) {
    return true;
  }

  const searchable = [
    formatCatalogName(node.name),
    node.name,
    node.routeId,
    node.serviceName,
    node.description,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return searchable.includes(filter);
}

function nodeContainsMatch(node: ModuleCatalogNode, filter: string): boolean {
  if (!filter) {
    return true;
  }

  if (nodeMatchesSelf(node, filter)) {
    return true;
  }

  return node.children.some((child) => nodeContainsMatch(child, filter));
}

function nodeContainsKnowledgeMatch(
  node: ModuleCatalogNode,
  matchingModuleIds: ReadonlySet<string>,
): boolean {
  if (node.routeId && matchingModuleIds.has(node.routeId)) {
    return true;
  }

  return node.children.some((child) => nodeContainsKnowledgeMatch(child, matchingModuleIds));
}

function collectModuleSearchMetadata(
  nodes: ModuleCatalogNode[],
  parentPath: string[] = [],
  result: Map<string, ModuleSearchMetadata> = new Map(),
): Map<string, ModuleSearchMetadata> {
  nodes.forEach((node) => {
    const displayName = formatCatalogName(node.name);
    const currentPath = [...parentPath, displayName];

    if (node.routeId) {
      result.set(node.routeId, {
        displayName,
        hierarchy: currentPath.slice(0, -1).join(' / '),
      });
    }

    collectModuleSearchMetadata(node.children, currentPath, result);
  });

  return result;
}

function isTerminalModuleGroup(node: ModuleCatalogNode): boolean {
  return node.kind === 'GROUP'
    && node.children.length > 0
    && node.children.every(
      (child) => child.kind === 'MODULE' && Boolean(child.routeId) && child.children.length === 0,
    );
}

function hasMixedDirectChildren(node: ModuleCatalogNode): boolean {
  // Direct leaf Modules belong to their parent's picker; only nested Groups
  // (and structural Modules with children) remain in the left-hand tree.
  return node.kind === 'GROUP'
    && node.children.some(isLeafModule)
    && node.children.some((child) => !isLeafModule(child));
}

function isLeafModule(node: ModuleCatalogNode): boolean {
  return node.kind === 'MODULE' && Boolean(node.routeId) && node.children.length === 0;
}

function ModuleBadges({
  routeId,
  knowledgeCounts,
  quizCounts,
  interviewCounts,
  caseStudyCounts,
  roadmapAvailability,
}: {
  routeId: string;
  knowledgeCounts: Record<string, number>;
  quizCounts: Record<string, number>;
  interviewCounts: Record<string, number>;
  caseStudyCounts: Record<string, number>;
  roadmapAvailability: Record<string, boolean>;
}) {
  const knowledgeCount = knowledgeCounts[routeId] ?? 0;
  const quizCount = quizCounts[routeId] ?? 0;
  const interviewCount = interviewCounts[routeId] ?? 0;
  const caseStudyCount = caseStudyCounts[routeId] ?? 0;
  const hasRoadmap = roadmapAvailability[routeId] === true;

  if (knowledgeCount === 0 && quizCount === 0 && interviewCount === 0 && caseStudyCount === 0 && !hasRoadmap) {
    return null;
  }

  return (
    <span className="module-tree__badges" aria-label="Module content counts">
      {hasRoadmap && (
        <span className="module-tree__badge module-tree__badge--roadmap" title="Roadmap" aria-label="Roadmap">
          R
        </span>
      )}
      {knowledgeCount > 0 && (
        <span className="module-tree__badge module-tree__badge--knowledge" title="Knowledge">
          {knowledgeCount}
        </span>
      )}
      {quizCount > 0 && (
        <span className="module-tree__badge module-tree__badge--quiz" title="Quiz">
          {quizCount}
        </span>
      )}
      {interviewCount > 0 && (
        <span className="module-tree__badge module-tree__badge--interview" title="Interview">
          {interviewCount}
        </span>
      )}
      {caseStudyCount > 0 && (
        <span className="module-tree__badge module-tree__badge--casestudy" title="Case Study">
          {caseStudyCount}
        </span>
      )}
    </span>
  );
}

function ModulePickerPopup({
  group,
  entries,
  position,
  activeModuleId,
  knowledgeCounts,
  quizCounts,
  interviewCounts,
  caseStudyCounts,
  roadmapAvailability,
  popupRef,
  onMouseEnter,
  onMouseLeave,
  onClose,
  onEditModule,
}: {
  group: ModuleCatalogNode;
  entries: ModulePickerEntry[];
  position: ModulePickerPosition;
  activeModuleId: string;
  knowledgeCounts: Record<string, number>;
  quizCounts: Record<string, number>;
  interviewCounts: Record<string, number>;
  caseStudyCounts: Record<string, number>;
  roadmapAvailability: Record<string, boolean>;
  popupRef: React.RefObject<HTMLDivElement | null>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
  onEditModule?: (node: ModuleCatalogNode) => void;
}) {
  const navigate = useNavigate();
  const { topicSlug = 'java' } = useParams();
  const { language } = useLanguage();
  const groupName = formatCatalogName(group.name);

  return createPortal(
    <div
      ref={popupRef}
      className="module-picker"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        maxHeight: position.maxHeight,
      }}
      role="dialog"
      aria-label={`${groupName} modules`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="module-picker__header">
        <div>
          <div className="module-picker__eyebrow">
            {language === 'vi' ? 'THỨ TỰ MODULE' : 'MODULE ORDER'}
          </div>
          <div className="module-picker__title">{groupName}</div>
        </div>
        <span className="module-picker__total">
          {entries.length} {language === 'vi' ? 'module' : 'modules'}
        </span>
      </div>

      <div className="module-picker__list">
        {entries.map(({ node: moduleNode, sequence }) => {
          const routeId = moduleNode.routeId;

          if (!routeId) {
            return null;
          }

          const active = routeId === activeModuleId;
          const step = moduleNode.currentStep;
          const stepLabel = step === 'FINAL'
            ? 'Finished'
            : (step && /^[1-9][0-9]*[A-Z]?$/.test(step) ? `Step ${step}` : null);

          return (
            <div key={moduleNode.id} className="module-picker__entry">
              <button
              type="button"
              className={`module-picker__item${active ? ' is-active' : ''}`}
              onClick={() => {
                onClose();
                navigate(topicKnowledgePath(topicSlug, routeId));
              }}
            >
              <span className="module-picker__sequence" aria-label={`Order ${sequence}`}>
                {sequence}
              </span>
              <span className="module-picker__module-title">
                <span className="group-node-badge group-node-badge--module">M</span>
                <span className="module-picker__module-name">{formatCatalogName(moduleNode.name)}</span>
                {stepLabel && (
                  <CustomTooltip content={getModuleStepTooltip(step, language) ?? stepLabel}>
                    <span className={`module-picker__step${step === 'FINAL' ? ' module-picker__step--finished' : ''}`}>
                      {stepLabel}
                    </span>
                  </CustomTooltip>
                )}
              </span>
              <ModuleBadges
                routeId={routeId}
                knowledgeCounts={knowledgeCounts}
                quizCounts={quizCounts}
                interviewCounts={interviewCounts}
                caseStudyCounts={caseStudyCounts}
                roadmapAvailability={roadmapAvailability}
              />
              <span className="module-picker__open-cue" aria-hidden="true">›</span>
              </button>
              {onEditModule && <button type="button" className="module-picker__edit"
                aria-label={`Edit Module ${formatCatalogName(moduleNode.name)}`}
                title={`Edit ${formatCatalogName(moduleNode.name)}`}
                onClick={() => { onClose(); onEditModule(moduleNode); }}>✎</button>}
            </div>
          );
        })}
      </div>
    </div>,
    document.body,
  );
}

function ModulePickerRow({
  group,
  entries,
  depth,
  activeModuleId,
  knowledgeCounts,
  quizCounts,
  interviewCounts,
  caseStudyCounts,
  roadmapAvailability,
  onEditGroup,
  onEditModule,
  expanded,
  onToggleExpand,
  children,
}: {
  group: ModuleCatalogNode;
  entries: ModulePickerEntry[];
  depth: number;
  activeModuleId: string;
  knowledgeCounts: Record<string, number>;
  quizCounts: Record<string, number>;
  interviewCounts: Record<string, number>;
  caseStudyCounts: Record<string, number>;
  roadmapAvailability: Record<string, boolean>;
  onEditGroup?: (node: ModuleCatalogNode) => void;
  onEditModule?: (node: ModuleCatalogNode) => void;
  /** For a Group with mixed children, the picker and tree toggle are independent. */
  expanded?: boolean;
  onToggleExpand?: () => void;
  children?: ReactNode;
}) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerPinned, setPickerPinned] = useState(false);
  const [pickerPosition, setPickerPosition] = useState<ModulePickerPosition | null>(null);
  const pickerAnchorRef = useRef<HTMLButtonElement>(null);
  const pickerPopupRef = useRef<HTMLDivElement>(null);
  const pickerCloseTimerRef = useRef<number | null>(null);
  const displayName = formatCatalogName(group.name);
  const activeEntry = entries.find(({ node }) => node.routeId === activeModuleId);
  const containsActiveModule = Boolean(activeEntry);
  const activeModuleName = activeEntry ? formatCatalogName(activeEntry.node.name) : null;

  const clearPickerCloseTimer = useCallback(() => {
    if (pickerCloseTimerRef.current !== null) {
      window.clearTimeout(pickerCloseTimerRef.current);
      pickerCloseTimerRef.current = null;
    }
  }, []);

  const closePicker = useCallback(() => {
    clearPickerCloseTimer();
    setPickerVisible(false);
    setPickerPinned(false);
  }, [clearPickerCloseTimer]);

  const updatePickerPosition = useCallback(() => {
    const anchor = pickerAnchorRef.current;

    if (!anchor) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const sidebarRight = anchor.closest('.learning-sidebar')?.getBoundingClientRect().right ?? rect.right;
    setPickerPosition(calculateModulePickerPosition({
      anchorTop: rect.top,
      anchorRight: rect.right,
      sidebarRight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      itemCount: entries.length,
    }));
  }, [entries.length]);

  const openPicker = useCallback(() => {
    clearPickerCloseTimer();
    window.dispatchEvent(new CustomEvent<string>(MODULE_PICKER_OPEN_EVENT, { detail: group.id }));
    updatePickerPosition();
    setPickerVisible(true);
  }, [clearPickerCloseTimer, group.id, updatePickerPosition]);

  const schedulePickerClose = useCallback(() => {
    if (pickerPinned) {
      return;
    }

    clearPickerCloseTimer();
    pickerCloseTimerRef.current = window.setTimeout(() => {
      setPickerVisible(false);
    }, 180);
  }, [clearPickerCloseTimer, pickerPinned]);

  useEffect(() => {
    closePicker();
  }, [activeModuleId, closePicker]);

  useEffect(() => {
    const handleOtherPickerOpen = (event: Event) => {
      const pickerEvent = event as CustomEvent<string>;

      if (pickerEvent.detail !== group.id) {
        closePicker();
      }
    };

    window.addEventListener(MODULE_PICKER_OPEN_EVENT, handleOtherPickerOpen);

    return () => {
      window.removeEventListener(MODULE_PICKER_OPEN_EVENT, handleOtherPickerOpen);
    };
  }, [closePicker, group.id]);

  useEffect(() => {
    if (!pickerVisible) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (pickerAnchorRef.current?.contains(target) || pickerPopupRef.current?.contains(target)) {
        return;
      }

      closePicker();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePicker();
        pickerAnchorRef.current?.focus();
      }
    };

    const handleViewportChange = () => {
      updatePickerPosition();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [closePicker, pickerVisible, updatePickerPosition]);

  useEffect(() => () => clearPickerCloseTimer(), [clearPickerCloseTimer]);

  return (
    <li className="module-tree__item">
      <div className={`module-tree__row is-module-picker${onToggleExpand ? ' is-mixed-group is-expandable is-menu-level' : ''}${containsActiveModule ? ' is-active' : ''}`}>
        {onToggleExpand && (
          <button type="button" className={`module-tree__mixed-toggle${expanded ? ' is-open' : ' is-closed'}`}
            onClick={onToggleExpand} aria-expanded={expanded}
            aria-label={`${expanded ? 'Collapse' : 'Expand'} ${displayName}`}
            title={`${expanded ? 'Collapse' : 'Expand'} ${displayName}`}>
            <ModuleTreeIndent depth={depth} />
            <span className="module-tree__caret" aria-hidden="true">{expanded ? '⌄' : '›'}</span>
          </button>
        )}
        <button
          ref={pickerAnchorRef}
          type="button"
          className={`module-tree__picker-zone${pickerVisible ? ' is-open' : ''}`}
          onMouseEnter={openPicker}
          onMouseLeave={schedulePickerClose}
          onFocus={openPicker}
          onBlur={schedulePickerClose}
          onClick={() => {
            clearPickerCloseTimer();

            if (pickerPinned) {
              closePicker();
              return;
            }

            window.dispatchEvent(new CustomEvent<string>(MODULE_PICKER_OPEN_EVENT, { detail: group.id }));
            updatePickerPosition();
            setPickerPinned(true);
            setPickerVisible(true);
          }}
          aria-haspopup="dialog"
          aria-expanded={pickerVisible}
          aria-label={`Open ${displayName} modules`}
          title={`Open ${displayName} modules`}
        >
          {!onToggleExpand && <>
            <ModuleTreeIndent depth={depth} />
            <span className="module-tree__vertical-cue module-tree__vertical-cue--placeholder" aria-hidden="true" />
            <span className="module-tree__caret" aria-hidden="true">›</span>
          </>}
          <span className={`module-tree__content${containsActiveModule ? ' is-active' : ''}`}>
            <span className={`group-node-badge group-node-badge--${group.kind === 'GROUP' ? 'group' : 'module'}`}>
              {group.kind === 'GROUP' ? 'G' : 'M'}
            </span>
            <span className="module-tree__label">{displayName}</span>
            {group.active === false && <span className="module-tree__inactive">INACTIVE</span>}
            {activeModuleName && (
              <span className="module-tree__active-module">
                <span className="module-tree__active-module-dot" aria-hidden="true" />
                <span className="module-tree__active-module-prefix">ACTIVE</span>
                <span className="module-tree__active-module-name">{activeModuleName}</span>
              </span>
            )}
          </span>
          <span className="module-tree__count">{entries.length} module</span>
          <span className="module-tree__picker-cue" aria-hidden="true">›</span>
        </button>
        {onEditGroup && group.kind === 'GROUP' && <button type="button" className="module-tree__edit-group"
          title={`Edit ${displayName}`} aria-label={`Edit Group ${displayName}`}
          onClick={() => { closePicker(); onEditGroup(group); }}>✎</button>}
        {onEditModule && group.kind === 'MODULE' && <button type="button" className="module-tree__edit-group"
          title={`Edit ${displayName}`} aria-label={`Edit Module ${displayName}`}
          onClick={() => { closePicker(); onEditModule(group); }}>✎</button>}
      </div>

      {pickerVisible && pickerPosition && (
        <ModulePickerPopup
          group={group}
          entries={entries}
          position={pickerPosition}
          activeModuleId={activeModuleId}
          knowledgeCounts={knowledgeCounts}
          quizCounts={quizCounts}
          interviewCounts={interviewCounts}
          caseStudyCounts={caseStudyCounts}
          roadmapAvailability={roadmapAvailability}
          popupRef={pickerPopupRef}
          onMouseEnter={openPicker}
          onMouseLeave={schedulePickerClose}
          onClose={closePicker}
          onEditModule={onEditModule}
        />
      )}
      {children}
    </li>
  );
}

function TreeNode({
  node,
  depth,
  activeModuleId,
  knowledgeCounts,
  quizCounts,
  interviewCounts,
  caseStudyCounts,
  roadmapAvailability,
  filter,
  knowledgeSearchActive,
  knowledgeMatchModuleIds,
  expandRequest,
  showEntireSubtree = false,
  renderAsPicker = false,
  onEditGroup,
  onEditModule,
}: TreeNodeProps) {
  const navigate = useNavigate();
  const { topicSlug = 'java' } = useParams();
  const hasChildren = node.children.length > 0;
  const terminalModuleGroup = isTerminalModuleGroup(node);
  const hasInlineChildren = hasChildren && !terminalModuleGroup;
  const mixedDirectChildren = hasMixedDirectChildren(node);
  const [expanded, setExpanded] = useState(expandRequest.expanded);
  const [searchExpanded, setSearchExpanded] = useState(expandRequest.expanded);
  const selfMatches = nodeMatchesSelf(node, filter);
  const containsMatch = nodeContainsMatch(node, filter);
  const containsKnowledgeMatch = nodeContainsKnowledgeMatch(node, knowledgeMatchModuleIds);
  const treeSearchActive = Boolean(filter) || knowledgeSearchActive;
  const visible = knowledgeSearchActive
    ? containsKnowledgeMatch
    : (!filter || showEntireSubtree || containsMatch);
  const childShowEntireSubtree = knowledgeSearchActive
    ? false
    : showEntireSubtree || (Boolean(filter) && selfMatches);
  const open = treeSearchActive ? searchExpanded : expanded;
  const isModule = node.kind === 'MODULE' && Boolean(node.routeId);
  const isActive = isModule && node.routeId === activeModuleId;
  const structuralModule = isModule && hasInlineChildren;
  const isRealModule = isCountedRealModule(node, {
    knowledge: knowledgeCounts, quiz: quizCounts, interview: interviewCounts, casestudy: caseStudyCounts,
  });
  const displayName = formatCatalogName(node.name);
  const pickerEntries = useMemo<ModulePickerEntry[]>(() => {
    const ordered = node.children.map((child, index) => ({ node: child, sequence: index + 1 }));

    if (knowledgeSearchActive) {
      return ordered.filter(({ node: child }) => nodeContainsKnowledgeMatch(child, knowledgeMatchModuleIds));
    }

    if (!filter || showEntireSubtree || selfMatches) {
      return ordered;
    }

    return ordered.filter(({ node: child }) => nodeContainsMatch(child, filter));
  }, [filter, knowledgeMatchModuleIds, knowledgeSearchActive, node.children, selfMatches, showEntireSubtree]);

  const toggleChildren = () => {
    if (hasInlineChildren) {
      if (treeSearchActive) setSearchExpanded((current) => !current);
      else setExpanded((current) => !current);
    }
  };

  useEffect(() => {
    if (treeSearchActive && visible && hasInlineChildren) {
      setSearchExpanded(true);
    }
  }, [hasInlineChildren, treeSearchActive, visible]);

  useEffect(() => {
    setExpanded(expandRequest.expanded);
    setSearchExpanded(expandRequest.expanded);
  }, [expandRequest]);

  if (!visible) {
    return null;
  }

  if (renderAsPicker && isLeafModule(node)) {
    return (
      <ModulePickerRow
        group={node}
        entries={[{ node, sequence: 1 }]}
        depth={depth}
        activeModuleId={activeModuleId}
        knowledgeCounts={knowledgeCounts}
        quizCounts={quizCounts}
        interviewCounts={interviewCounts}
        caseStudyCounts={caseStudyCounts}
        roadmapAvailability={roadmapAvailability}
        onEditGroup={onEditGroup}
        onEditModule={onEditModule}
      />
    );
  }

  if (terminalModuleGroup) {
    return (
      <ModulePickerRow
        group={node}
        entries={pickerEntries}
        depth={depth}
        activeModuleId={activeModuleId}
        knowledgeCounts={knowledgeCounts}
        quizCounts={quizCounts}
        interviewCounts={interviewCounts}
        caseStudyCounts={caseStudyCounts}
        roadmapAvailability={roadmapAvailability}
        onEditGroup={onEditGroup}
        onEditModule={onEditModule}
      />
    );
  }

  if (mixedDirectChildren) {
    const directModules = pickerEntries.filter(({ node: child }) => isLeafModule(child))
      .map(({ node: child }, index) => ({ node: child, sequence: index + 1 }));
    return (
      <ModulePickerRow
        group={node}
        entries={directModules}
        depth={depth}
        activeModuleId={activeModuleId}
        knowledgeCounts={knowledgeCounts}
        quizCounts={quizCounts}
        interviewCounts={interviewCounts}
        caseStudyCounts={caseStudyCounts}
        roadmapAvailability={roadmapAvailability}
        onEditGroup={onEditGroup}
        onEditModule={onEditModule}
        expanded={open}
        onToggleExpand={toggleChildren}
      >
        {open && <ul className="module-tree__branch">
          {node.children.filter((child) => !isLeafModule(child)).map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              activeModuleId={activeModuleId}
              knowledgeCounts={knowledgeCounts}
              quizCounts={quizCounts}
              interviewCounts={interviewCounts}
              caseStudyCounts={caseStudyCounts}
              roadmapAvailability={roadmapAvailability}
              filter={filter}
              knowledgeSearchActive={knowledgeSearchActive}
              knowledgeMatchModuleIds={knowledgeMatchModuleIds}
              expandRequest={expandRequest}
              onEditGroup={onEditGroup}
              onEditModule={onEditModule}
              showEntireSubtree={childShowEntireSubtree}
            />
          ))}
        </ul>}
      </ModulePickerRow>
    );
  }

  const navigateToModule = () => {
    if (isModule && node.routeId) {
      navigate(topicKnowledgePath(topicSlug, node.routeId));
    }
  };

  const content = (
    <span className={`module-tree__content${isActive && !structuralModule ? ' is-active' : ''}`}>
      <span className={`group-node-badge group-node-badge--${node.kind === 'GROUP' ? 'group' : 'module'}`}>
        {node.kind === 'GROUP' ? 'G' : 'M'}
      </span>
      <span className="module-tree__label">{displayName}</span>
      {node.active === false && <span className="module-tree__inactive">INACTIVE</span>}

      {isModule && node.routeId && !structuralModule && (
        <ModuleBadges
          routeId={node.routeId}
          knowledgeCounts={knowledgeCounts}
          quizCounts={quizCounts}
          interviewCounts={interviewCounts}
          caseStudyCounts={caseStudyCounts}
          roadmapAvailability={roadmapAvailability}
        />
      )}
    </span>
  );

  return (
    <li className="module-tree__item">
      <div
        className={`module-tree__row${hasChildren ? ' is-menu-level' : ''}${hasInlineChildren ? ' is-expandable' : ''}${isModule && !structuralModule ? ' is-module' : ''}${isRealModule ? ' is-real-module' : ''}${isActive && !structuralModule ? ' is-active' : ''}`}
      >
        {hasInlineChildren && (
          <button
            type="button"
            className={`module-tree__collapse-zone is-full${open ? ' is-open' : ' is-closed'}`}
            onClick={toggleChildren}
            aria-expanded={open}
            aria-label={`${open ? 'Collapse' : 'Expand'} ${displayName}`}
            title={`${open ? 'Collapse' : 'Expand'} ${displayName}`}
          >
            <ModuleTreeIndent depth={depth} />
            <span className="module-tree__caret" aria-hidden="true">{open ? '⌄' : '›'}</span>
            {content}
          </button>
        )}

        {isModule && !hasChildren && (
          <button
            type="button"
            className={`module-tree__dashboard-zone${hasChildren ? ' is-split' : ' is-full'}`}
            onClick={navigateToModule}
            aria-label={`Open ${displayName} dashboard`}
            title={`Open ${displayName}`}
          >
            {!hasChildren && (
              <>
                <ModuleTreeIndent depth={depth} />
                <span className="module-tree__vertical-cue module-tree__vertical-cue--placeholder" aria-hidden="true" />
                <span className="module-tree__caret module-tree__caret--leaf" aria-hidden="true">•</span>
              </>
            )}
            {content}
            <span className="module-tree__dashboard-cue" aria-hidden="true">›››</span>
          </button>
        )}

        {!hasChildren && !isModule && (
          <div className="module-tree__static-zone">
            <ModuleTreeIndent depth={depth} />
            <span className="module-tree__vertical-cue module-tree__vertical-cue--placeholder" aria-hidden="true" />
            <span className="module-tree__caret module-tree__caret--leaf" aria-hidden="true">•</span>
            {content}
          </div>
        )}
        {onEditGroup && node.kind === 'GROUP' && (
          <button type="button" className="module-tree__edit-group"
            title={`Edit ${displayName}`} aria-label={`Edit Group ${displayName}`}
            onClick={() => onEditGroup(node)}>✎</button>
        )}
        {onEditModule && node.kind === 'MODULE' && (
          <button type="button" className="module-tree__edit-group"
            title={`Edit ${displayName}`} aria-label={`Edit Module ${displayName}`}
            onClick={() => onEditModule(node)}>✎</button>
        )}
      </div>

      {hasInlineChildren && open && (
        <ul className="module-tree__branch">
          {structuralModule && (
            knowledgeSearchActive
              ? Boolean(node.routeId && knowledgeMatchModuleIds.has(node.routeId))
              : (!filter || showEntireSubtree || selfMatches)
          ) && (
            <ModulePickerRow
              group={node}
              entries={[{ node, sequence: 1 }]}
              depth={depth + 1}
              activeModuleId={activeModuleId}
              knowledgeCounts={knowledgeCounts}
              quizCounts={quizCounts}
              interviewCounts={interviewCounts}
              caseStudyCounts={caseStudyCounts}
              roadmapAvailability={roadmapAvailability}
              onEditGroup={onEditGroup}
              onEditModule={onEditModule}
            />
          )}

          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              activeModuleId={activeModuleId}
              knowledgeCounts={knowledgeCounts}
              quizCounts={quizCounts}
              interviewCounts={interviewCounts}
              caseStudyCounts={caseStudyCounts}
              roadmapAvailability={roadmapAvailability}
              filter={filter}
              knowledgeSearchActive={knowledgeSearchActive}
              knowledgeMatchModuleIds={knowledgeMatchModuleIds}
              expandRequest={expandRequest}
              onEditGroup={onEditGroup}
              onEditModule={onEditModule}
              showEntireSubtree={childShowEntireSubtree}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function ModuleSidebar({
  nodes,
  activeModuleId,
  topicId,
  onStructureChanged,
  enableRealModulesFilter = true,
  knowledgeCounts,
  quizCounts,
  interviewCounts,
  caseStudyCounts,
  roadmapAvailability,
  contentCountsState,
  onRetryContentCounts,
}: ModuleSidebarProps) {
  const navigate = useNavigate();
  const { topicSlug = 'java' } = useParams();
  const { search, hash } = useLocation();
  const { language } = useLanguage();
  const [adminEnabled, setAdminEnabled] = useState(false);
  const [adminStructure, setAdminStructure] = useState<AdminStructure | null>(null);
  const [adminReload, setAdminReload] = useState(0);
  const [adminError, setAdminError] = useState('');
  const [groupEditor, setGroupEditor] = useState<GroupEditorTarget | null>(null);
  const [moduleEditor, setModuleEditor] = useState<AdminTreeNode | null>(null);
  const [modifyOpen, setModifyOpen] = useState(false);

  useEffect(() => {
    if (!topicId) return;
    const controller = new AbortController();
    getCurrentUser(controller.signal).then((user) => {
      if (controller.signal.aborted) return;
      if (!user?.roles.includes('ADMIN')) {
        setAdminEnabled(false);
        setAdminStructure(null);
        return;
      }
      setAdminEnabled(true);
      return fetchAdminStructure(topicId, controller.signal).then((structure) => {
        if (!controller.signal.aborted) { setAdminStructure(structure); setAdminError(''); }
      });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setAdminError(error instanceof Error ? error.message : 'Admin error');
    });
    return () => controller.abort();
  }, [topicId, adminReload]);

  const adminNodes = useMemo(() => adminStructure ? projectAdminNodes(adminStructure.nodes) : null, [adminStructure]);
  const sourceNodes = adminEnabled && adminNodes ? adminNodes : nodes;

  const finishGroupChange = useCallback(() => {
    setGroupEditor(null);
    setModuleEditor(null);
    setModifyOpen(false);
    setAdminReload((value) => value + 1);
    onStructureChanged?.();
  }, [onStructureChanged]);

  const editGroupNode = (node: ModuleCatalogNode) => {
    const groupId = Number(node.id.replace(/^GROUP_/, ''));
    const find = (items: AdminTreeNode[]): AdminTreeNode | null => {
      for (const item of items) {
        if (item.kind === 'GROUP' && item.id === groupId) return item;
        const nested = find(item.children);
        if (nested) return nested;
      }
      return null;
    };
    const original = adminStructure && find(adminStructure.nodes);
    if (original) setGroupEditor({ kind: 'edit', group: original });
  };
  const editModuleNode = (node: ModuleCatalogNode) => {
    if (!node.id.startsWith('PLACEMENT_') || !adminStructure) return;
    const placementId = Number(node.id.slice('PLACEMENT_'.length));
    const find = (items: AdminTreeNode[]): AdminTreeNode | null => {
      for (const item of items) {
        if (item.kind === 'MODULE' && item.id === placementId) return item;
        const nested = find(item.children);
        if (nested) return nested;
      }
      return null;
    };
    const original = find(adminStructure.nodes);
    if (original) setModuleEditor(original);
  };
  const [filterInput, setFilterInput] = useState('');
  const [realModulesOnly, setRealModulesOnly] = useState(true);
  const filterRealModules = enableRealModulesFilter && realModulesOnly;
  const [knowledgeSearchInput, setKnowledgeSearchInput] = useState('');
  const [knowledgeSearchIndex, setKnowledgeSearchIndex] = useState<KnowledgeSearchIndex | null>(null);
  const [knowledgeSearchLoading, setKnowledgeSearchLoading] = useState(false);
  const [knowledgeSearchError, setKnowledgeSearchError] = useState<string | null>(null);
  const [visibleKnowledgeResultLimit, setVisibleKnowledgeResultLimit] = useState(KNOWLEDGE_RESULTS_PAGE_SIZE);
  const [expandRequest, setExpandRequest] = useState<SidebarExpandRequest>({ version: 0, expanded: true });
  const filter = useMemo(() => filterInput.trim().toLowerCase(), [filterInput]);
  const knowledgeQuery = knowledgeSearchInput.trim();
  const knowledgeSearchActive = KNOWLEDGE_SEARCH_ENABLED && knowledgeQuery.length > 0;
  const moduleSearchMetadata = useMemo(() => collectModuleSearchMetadata(sourceNodes), [sourceNodes]);

  useEffect(() => {
    let active = true;

    if (!knowledgeSearchActive) {
      setKnowledgeSearchLoading(false);
      setKnowledgeSearchError(null);
      return () => {
        active = false;
      };
    }

    if (knowledgeSearchIndex?.language === language) {
      return () => {
        active = false;
      };
    }

    setKnowledgeSearchLoading(true);
    setKnowledgeSearchError(null);

    loadKnowledgeSearchIndex(language)
      .then((result) => {
        if (!active) {
          return;
        }

        setKnowledgeSearchIndex(result);
        setKnowledgeSearchLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setKnowledgeSearchIndex(null);
        setKnowledgeSearchLoading(false);
        setKnowledgeSearchError(error instanceof Error ? error.message : 'Unable to load Knowledge search.');
      });

    return () => {
      active = false;
    };
  }, [knowledgeSearchActive, knowledgeSearchIndex?.language, language]);

  const knowledgeResults = useMemo<KnowledgeSearchResult[]>(() => {
    if (!knowledgeSearchActive || !knowledgeSearchIndex || knowledgeSearchIndex.language !== language) {
      return [];
    }

    return searchKnowledge(knowledgeSearchIndex, knowledgeQuery);
  }, [knowledgeQuery, knowledgeSearchActive, knowledgeSearchIndex, language]);

  const knowledgeMatchModuleIds = useMemo(
    () => new Set(knowledgeResults.map(({ document }) => document.moduleId)),
    [knowledgeResults],
  );
  const visibleKnowledgeResults = useMemo(
    () => knowledgeResults.slice(0, visibleKnowledgeResultLimit),
    [knowledgeResults, visibleKnowledgeResultLimit],
  );

  useEffect(() => {
    setVisibleKnowledgeResultLimit(KNOWLEDGE_RESULTS_PAGE_SIZE);
  }, [knowledgeQuery, language]);
  const moduleCount = useMemo(
    () => sourceNodes.reduce((count, node) => count + collectRealModules(node).length, 0),
    [sourceNodes],
  );
  const realModuleCount = useMemo(
    () => sourceNodes.reduce(
      (count, node) => count + collectRealModules(node)
        .filter((moduleNode) => isCountedRealModule(moduleNode, {
          knowledge: knowledgeCounts, quiz: quizCounts, interview: interviewCounts, casestudy: caseStudyCounts,
        })).length,
      0,
    ),
    [interviewCounts, caseStudyCounts, knowledgeCounts, sourceNodes, quizCounts],
  );
  const visibleNodes = useMemo(
    () => {
      if (knowledgeSearchActive) {
        return sourceNodes;
      }

      // A count summary that is loading or has failed is not evidence of empty modules.
      return filterRealModules && contentCountsState === 'ready'
        ? projectCountedRealModules(sourceNodes, {
          knowledge: knowledgeCounts, quiz: quizCounts, interview: interviewCounts, casestudy: caseStudyCounts,
        })
        : sourceNodes;
    },
    [
      interviewCounts,
      caseStudyCounts,
      knowledgeCounts,
      knowledgeSearchActive,
      contentCountsState,
      sourceNodes,
      quizCounts,
      filterRealModules,
    ],
  );

  const navigateToKnowledgeResult = (result: KnowledgeSearchResult) => {
    const { document } = result;
    const params = new URLSearchParams({
      tab: 'knowledge',
      category: document.categoryId,
    });

    if (document.sectionId) {
      params.set('section', document.sectionId);
    }

    setKnowledgeSearchInput('');
    navigate(`${topicKnowledgePath(topicSlug, document.moduleId)}?${params.toString()}`);
  };

  const displayedModuleCount = knowledgeSearchActive
    ? knowledgeMatchModuleIds.size
    : (filterRealModules && contentCountsState !== 'ready' ? '?'
      : (filterRealModules ? realModuleCount : moduleCount));

  return (
    <aside className="learning-sidebar">
      <div className="learning-sidebar__headline">
        <span className="learning-sidebar__headline-copy">
          <span>{language === 'vi' ? 'Tất cả module' : 'All modules'}</span>
          <span className="learning-sidebar__total">{displayedModuleCount}</span>
        </span>
      </div>

      {filterRealModules && contentCountsState !== 'ready' && !knowledgeSearchActive && (
        <div className="sidebar-module-count-notice" role="status">
          <span>{contentCountsState === 'loading'
            ? (language === 'vi' ? '\u0110ang t\u1ea3i s\u1ed1 l\u01b0\u1ee3ng n\u1ed9i dung \u0111\u1ec3 l\u1ecdc Module th\u1eadt\u2026' : 'Loading content counts for Real modules...')
            : (language === 'vi' ? 'Kh\u00f4ng th\u1ec3 x\u00e1c minh Module th\u1eadt; \u0111ang hi\u1ec3n th\u1ecb c\u00e2y \u0111\u1ea7y \u0111\u1ee7.' : 'Unable to verify Real modules; showing the full tree.')}</span>
          {contentCountsState === 'error' && (
            <button type="button" onClick={onRetryContentCounts}>
              {language === 'vi' ? 'Th\u1eed l\u1ea1i' : 'Retry'}
            </button>
          )}
        </div>
      )}

      <label className={`sidebar-search${knowledgeSearchActive ? ' is-disabled' : ''}`}>
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={filterInput}
          onChange={(event) => setFilterInput(event.target.value)}
          disabled={knowledgeSearchActive}
          placeholder={language === 'vi' ? 'Lọc module...' : 'Filter modules...'}
        />
      </label>

      <div
        className={`sidebar-module-mode${knowledgeSearchActive ? ' is-disabled' : ''}`}
        aria-label={language === 'vi' ? 'Chế độ hiển thị module' : 'Module display mode'}
      >
        {enableRealModulesFilter && <>
        <span className={!realModulesOnly ? 'is-active' : undefined}>
          {language === 'vi' ? 'Đầy đủ' : 'Full tree'}
        </span>
        <button
          type="button"
          className={`sidebar-module-mode__switch${realModulesOnly ? ' is-on' : ''}`}
          role="switch"
          aria-checked={realModulesOnly}
          aria-label={language === 'vi' ? 'Chỉ hiển thị module thật' : 'Show real modules only'}
          disabled={knowledgeSearchActive}
          onClick={() => setRealModulesOnly((current) => !current)}
        >
          <span className="sidebar-module-mode__thumb" />
        </button>
        <span className={realModulesOnly ? 'is-active' : undefined}>
          {language === 'vi' ? 'Module thật' : 'Real modules'}
        </span>
        </>}

        <div className="sidebar-module-mode__tree-actions" aria-label={language === 'vi' ? 'Điều khiển cây module' : 'Module tree controls'}>
          <button
            type="button"
            onClick={() => setExpandRequest((current) => ({ version: current.version + 1, expanded: true }))}
            aria-label={language === 'vi' ? 'Mở tất cả module' : 'Expand all modules'}
            title={language === 'vi' ? 'Mở tất cả' : 'Expand all'}
          >
            + All
          </button>
          <button
            type="button"
            onClick={() => setExpandRequest((current) => ({ version: current.version + 1, expanded: false }))}
            aria-label={language === 'vi' ? 'Thu gọn tất cả module' : 'Collapse all modules'}
            title={language === 'vi' ? 'Thu gọn tất cả' : 'Collapse all'}
          >
            − All
          </button>
        </div>
      </div>

      {KNOWLEDGE_SEARCH_ENABLED && <label className={`sidebar-knowledge-search${knowledgeSearchActive ? ' is-active' : ''}`}>
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={knowledgeSearchInput}
          onChange={(event) => setKnowledgeSearchInput(event.target.value)}
          placeholder={language === 'vi' ? 'Tìm kiến thức...' : 'Search knowledge...'}
          aria-label={language === 'vi' ? 'Tìm trong Knowledge của tất cả module' : 'Search Knowledge across all modules'}
        />
        {knowledgeSearchInput && (
          <button
            type="button"
            className="sidebar-knowledge-search__clear"
            onClick={() => setKnowledgeSearchInput('')}
            aria-label={language === 'vi' ? 'Xóa tìm kiếm kiến thức' : 'Clear Knowledge search'}
          >
            ×
          </button>
        )}
      </label>}

      {knowledgeSearchActive && (
        <div className="sidebar-knowledge-results" aria-live="polite">
          <div className="sidebar-knowledge-results__header">
            <span>{language === 'vi' ? 'KẾT QUẢ KIẾN THỨC' : 'KNOWLEDGE RESULTS'}</span>
            {!knowledgeSearchLoading && !knowledgeSearchError && (
              <span>{knowledgeResults.length}</span>
            )}
          </div>

          {knowledgeSearchLoading && (
            <div className="sidebar-knowledge-results__status">
              {language === 'vi' ? 'Đang tải chỉ mục tìm kiếm...' : 'Loading search index...'}
            </div>
          )}

          {!knowledgeSearchLoading && knowledgeSearchError && (
            <div className="sidebar-knowledge-results__status is-error">{knowledgeSearchError}</div>
          )}

          {!knowledgeSearchLoading && !knowledgeSearchError && knowledgeResults.length === 0 && (
            <div className="sidebar-knowledge-results__status">
              {language === 'vi' ? 'Không tìm thấy Knowledge phù hợp.' : 'No matching Knowledge found.'}
            </div>
          )}

          {!knowledgeSearchLoading && !knowledgeSearchError && visibleKnowledgeResults.length > 0 && (
            <div className="sidebar-knowledge-results__list">
              {visibleKnowledgeResults.map((result) => {
                const { document } = result;
                const moduleMetadata = moduleSearchMetadata.get(document.moduleId);
                const moduleName = moduleMetadata?.displayName ?? document.moduleId;
                const context = document.type === 'SECTION'
                  ? `${moduleName} › ${document.categoryTitle}`
                  : moduleName;

                return (
                  <button
                    key={document.documentId}
                    type="button"
                    className="sidebar-knowledge-result"
                    onClick={() => navigateToKnowledgeResult(result)}
                    title={moduleMetadata?.hierarchy
                      ? `${moduleMetadata.hierarchy} / ${moduleName}`
                      : moduleName}
                  >
                    <span className="sidebar-knowledge-result__title">{document.title}</span>
                    <span className="sidebar-knowledge-result__context">{context}</span>
                    {document.preview && (
                      <span className="sidebar-knowledge-result__preview">{document.preview}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {!knowledgeSearchLoading && !knowledgeSearchError && knowledgeResults.length > visibleKnowledgeResults.length && (
            <button
              type="button"
              className="sidebar-knowledge-results__more"
              onClick={() => setVisibleKnowledgeResultLimit((current) => (
                Math.min(current + KNOWLEDGE_RESULTS_PAGE_SIZE, knowledgeResults.length)
              ))}
            >
              {language === 'vi'
                ? `Còn ${knowledgeResults.length - visibleKnowledgeResults.length} kết quả khác`
                : `${knowledgeResults.length - visibleKnowledgeResults.length} more results`}
            </button>
          )}
        </div>
      )}

      <div className="learning-sidebar__section-title">
        {language === 'vi' ? 'CẤU TRÚC HỌC TẬP' : 'LEARNING STRUCTURE'}
        {topicId && adminEnabled && adminStructure && <span className="module-group-admin-actions">
          <button type="button" onClick={() => setGroupEditor({ kind: 'create' })}>+ Add Group</button>
          <button type="button" onClick={() => setModifyOpen(true)}>Modify Group</button>
        </span>}
      </div>
      {adminEnabled && adminError && <div className="module-group-admin-error" role="alert">{adminError}
        <button type="button" onClick={() => setAdminReload((value) => value + 1)}>Retry</button>
      </div>}

      <ul className="module-tree">
        {visibleNodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            // Root MODULE leaves have no parent GROUP to apply the nested
            // mixed-children picker rule; present them as one-item pickers too.
            renderAsPicker={isLeafModule(node)}
            activeModuleId={activeModuleId}
            knowledgeCounts={knowledgeCounts}
            quizCounts={quizCounts}
            interviewCounts={interviewCounts}
            caseStudyCounts={caseStudyCounts}
            roadmapAvailability={roadmapAvailability}
            filter={knowledgeSearchActive ? '' : filter}
            knowledgeSearchActive={knowledgeSearchActive}
            knowledgeMatchModuleIds={knowledgeMatchModuleIds}
            expandRequest={expandRequest}
            onEditGroup={adminEnabled && adminStructure ? editGroupNode : undefined}
            onEditModule={adminEnabled && adminStructure ? editModuleNode : undefined}
          />
        ))}
        {knowledgeSearchActive
          && !knowledgeSearchLoading
          && !knowledgeSearchError
          && knowledgeMatchModuleIds.size === 0 && (
            <li className="module-tree__empty-search">
              {language === 'vi' ? 'Không có module chứa Knowledge phù hợp.' : 'No module contains matching Knowledge.'}
            </li>
        )}
      </ul>
      {topicId && adminEnabled && adminStructure && groupEditor && (
        createPortal(<GroupFormDialog key={groupEditor.kind === 'create' ? 'create' : `edit-${groupEditor.group.id}`}
          topicId={topicId} revision={adminStructure.revision} target={groupEditor} language={language}
          onClose={() => setGroupEditor(null)} onSaved={finishGroupChange}
          onReload={() => { setGroupEditor(null); setAdminReload((value) => value + 1); }} />, document.body)
      )}
      {topicId && adminEnabled && adminStructure && moduleEditor && (
        createPortal(<ModuleFormDialog key={`module-${moduleEditor.id}`}
          revision={adminStructure.revision} module={moduleEditor} language={language}
          onClose={() => setModuleEditor(null)}
          onSaved={(newSlug) => {
            const originalSlug = moduleEditor.slug;
            finishGroupChange();
            if (activeModuleId === originalSlug && newSlug !== originalSlug) {
              navigate(`${topicKnowledgePath(topicSlug, newSlug)}${search}${hash}`, { replace: true });
            }
          }}
          onReload={() => { setModuleEditor(null); setAdminReload((value) => value + 1); }} />, document.body)
      )}
      {topicId && adminEnabled && adminStructure && modifyOpen && (
        createPortal(<GroupStructureDialog topicId={topicId} initial={adminStructure} language={language}
          onClose={() => setModifyOpen(false)} onSaved={finishGroupChange}
          onReload={() => { setModifyOpen(false); setAdminReload((value) => value + 1); }} />, document.body)
      )}
    </aside>
  );
}
