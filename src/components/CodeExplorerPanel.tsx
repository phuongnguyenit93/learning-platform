import { useCallback, useEffect, useRef, useState } from 'react';
import Editor, { loader, type OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/editor/editor.api.js';
import 'monaco-editor/languages/definitions/java/register.js';
import 'monaco-editor/editor/contrib/find/browser/findController.js';
import EditorWorker from 'monaco-editor/editor/editor.worker.js?worker';
import {
  findCodeReference,
  loadCodeExplorer,
  loadCodeExplorerFile,
  type CodeExplorerMaterial,
  type ExplorerSymbol,
  type ExplorerTreeNode,
} from '../data/codeExplorer';
import { useTheme } from '../state/ThemeContext';
import { useLanguage } from '../state/LanguageContext';

// Both the editor and its web worker are bundled locally by Vite.
loader.config({ monaco });
Object.assign(self, { MonacoEnvironment: { getWorker: () => new EditorWorker() } });

interface Props {
  materialUrl: string;
  onClose: () => void;
  caseScope: { groupID: number; caseIndex: number };
}

interface Position {
  path: string;
  line: number;
  column: number;
}

interface Navigation {
  entries: Position[];
  index: number;
}

function FileTree({ node, selected, open }: {
  node: ExplorerTreeNode;
  selected?: string;
  open: (path: string) => void;
}) {
  if (node.type === 'FILE') {
    return <button type="button" title={node.path}
      className={'code-explorer__file' + (node.path === selected ? ' is-active' : '')}
      aria-current={node.path === selected ? 'page' : undefined}
      onClick={() => open(node.path)}>☕ {node.name}</button>;
  }
  return <details className="code-explorer__folder" open={node.path.split('/').length <= 5 || undefined}>
    <summary title={node.path}>{node.name}</summary>
    <div className="code-explorer__children">
      {node.children.map((child) =>
        <FileTree key={child.path} node={child} selected={selected} open={open} />)}
    </div>
  </details>;
}

export default function CodeExplorerPanel({ materialUrl, onClose, caseScope }: Props) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [material, setMaterial] = useState<CodeExplorerMaterial | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [navigation, setNavigation] = useState<Navigation>({ entries: [], index: -1 });
  const [tabs, setTabs] = useState<string[]>([]);
  const [code, setCode] = useState<string | null>(null);
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<ExplorerSymbol[]>([]);
  const materialRef = useRef<CodeExplorerMaterial | null>(null);
  const openRef = useRef<(position: Position) => void>(() => {});
  const disposables = useRef<monaco.IDisposable[]>([]);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const location = navigation.entries[navigation.index];
  const locationRef = useRef<Position | undefined>(undefined);
  locationRef.current = location;
  const routeId = materialUrl.match(/^\/module\/([A-Z0-9_-]+)\//)?.[1] ?? '';
  const modelRoot = '/' + routeId + '/casestudy/g' + caseScope.groupID
    + '/c' + caseScope.caseIndex + '/';

  const openAt = useCallback((next: Position) => {
    setAlternatives([]);
    setTabs((old) => old.includes(next.path) ? old : [...old, next.path]);
    setNavigation((old) => {
      const current = old.entries[old.index];
      if (current && current.path === next.path && current.line === next.line && current.column === next.column) {
        return old;
      }
      return { entries: [...old.entries.slice(0, old.index + 1), next], index: old.index + 1 };
    });
    setNotice(null);
  }, []);
  const openFile = useCallback((path: string) => openAt({ path, line: 1, column: 1 }), [openAt]);
  openRef.current = openAt;
  materialRef.current = material;

  useEffect(() => {
    let active = true;
    setMaterial(null);
    setLoadError(null);
    setNavigation({ entries: [], index: -1 });
    setTabs([]);
    loadCodeExplorer(materialUrl).then((value) => {
      if (active) setMaterial(value);
    }).catch((reason: unknown) => {
      if (active) setLoadError(reason instanceof Error ? reason.message : 'Material could not be loaded.');
    });
    return () => { active = false; };
  }, [materialUrl, retry]);

  useEffect(() => {
    if (!material) return;
    const methodName = 'executeCase' + caseScope.caseIndex;
    const controllerName = '/controller/Group' + caseScope.groupID + 'Controller.java';
    const matches = material.symbols.filter((item) =>
      item.kind === 'METHOD' && item.name === methodName && item.file.endsWith(controllerName));
    if (matches.length !== 1) {
      setNotice(language === 'vi'
        ? 'Không thể xác định duy nhất method Controller của Case Study.'
        : 'Unable to locate the unique Case Study controller method.');
      return;
    }
    openAt({ path: matches[0].file, line: matches[0].line, column: matches[0].column });
  }, [material, caseScope.groupID, caseScope.caseIndex, language, openAt]);

  useEffect(() => {
    if (!material || !location) { setCode(null); return; }
    let active = true;
    setCode(null);
    setSourceError(null);
    loadCodeExplorerFile(material, location.path).then((text) => {
      if (active) setCode(text);
    }).catch((reason: unknown) => {
      if (active) setSourceError(reason instanceof Error ? reason.message : 'Unable to load Java file.');
    });
    return () => { active = false; };
  }, [material, location?.path]);

  useEffect(() => {
    if (!location || code === null || !editorRef.current) return;
    editorRef.current.revealLineInCenter(location.line);
    editorRef.current.setPosition({ lineNumber: location.line, column: location.column });
  }, [location, code]);

  useEffect(() => () => {
    disposables.current.forEach((item) => item.dispose());
    disposables.current = [];
  }, []);

  const mounted: OnMount = useCallback((editor, api) => {
    editorRef.current = editor;
    if (locationRef.current) {
      editor.revealLineInCenter(locationRef.current.line);
      editor.setPosition({ lineNumber: locationRef.current.line, column: locationRef.current.column });
    }
    disposables.current.forEach((item) => item.dispose());
    const sourcePath = (uri: monaco.Uri): string | null => {
      const prefix = modelRoot;
      return uri.scheme === 'code-explorer' && uri.path.startsWith(prefix)
        ? uri.path.slice(prefix.length) : null;
    };
    const openDefinition = (line: number, column: number) => {
      const bundle = materialRef.current;
      const file = editor.getModel() ? sourcePath(editor.getModel()!.uri) : null;
      if (!bundle || !file) return;
      const reference = findCodeReference(bundle.references, file, line, column);
      if (!reference || reference.status === 'UNRESOLVED') return;
      const matches = reference.targets.flatMap((id) => {
        const symbol = bundle.symbols.find((entry) => entry.id === id);
        return symbol ? [symbol] : [];
      });
      if (matches.length === 1) {
        const target = matches[0];
        openRef.current({ path: target.file, line: target.line, column: target.column });
      } else if (matches.length > 1) {
        setAlternatives(matches);
      }
    };
    // The slim Monaco build does not provide VS Code's Ctrl+hover link gesture.
    // Show the affordance only for an indexed, navigable source reference.
    const linkDecoration = editor.createDecorationsCollection();
    let hoveredPosition: monaco.IPosition | null = null;
    let hoveringText = false;
    let modifierDown = false;
    let decoratedKey: string | null = null;
    const clearLink = () => {
      if (decoratedKey !== null) {
        linkDecoration.clear();
        decoratedKey = null;
      }
    };
    const updateLink = () => {
      const bundle = materialRef.current;
      const model = editor.getModel();
      const path = model ? sourcePath(model.uri) : null;
      if (!bundle || !path || !modifierDown || !hoveringText || !hoveredPosition) {
        clearLink();
        return;
      }
      const reference = findCodeReference(bundle.references, path,
        hoveredPosition.lineNumber, hoveredPosition.column);
      if (!reference || reference.status === 'UNRESOLVED'
        || !reference.targets.some((id) => bundle.symbols.some((symbol) => symbol.id === id))) {
        clearLink();
        return;
      }
      const key = path + ':' + reference.line + ':' + reference.column;
      if (key === decoratedKey) return;
      linkDecoration.set([{
        range: new api.Range(reference.line, reference.column,
          reference.endLine, reference.endColumn + 1),
        options: { inlineClassName: 'code-explorer__definition-link' },
      }]);
      decoratedKey = key;
    };
    const handleModifier = (event: KeyboardEvent) => {
      if (event.key !== 'Control' && event.key !== 'Meta') return;
      modifierDown = event.ctrlKey || event.metaKey;
      updateLink();
    };
    const resetLink = () => {
      modifierDown = false;
      hoveredPosition = null;
      hoveringText = false;
      clearLink();
    };
    window.addEventListener('keydown', handleModifier);
    window.addEventListener('keyup', handleModifier);
    window.addEventListener('blur', resetLink);
    // In the nested Case Study scroll panel Monaco's wheel event can fail to
    // reach its own scroll listener. Route vertical wheel input directly to the
    // Monaco viewport while it has room to scroll; at either edge, let the
    // surrounding page continue scrolling normally.
    const editorArea = editor.getDomNode()?.closest<HTMLElement>('.code-explorer__editor');
    const scrollOnWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey
        || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const viewport = editor.getLayoutInfo().height;
      const maxScrollTop = Math.max(0, editor.getScrollHeight() - viewport);
      if (maxScrollTop === 0) return;
      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? viewport : 1;
      const oldTop = editor.getScrollTop();
      const nextTop = Math.max(0, Math.min(maxScrollTop, oldTop + event.deltaY * unit));
      if (nextTop === oldTop) return;
      event.preventDefault();
      event.stopPropagation();
      editor.setScrollTop(nextTop);
    };
    editorArea?.addEventListener('wheel', scrollOnWheel, { capture: true, passive: false });
    disposables.current = [
      { dispose: () => editorArea?.removeEventListener('wheel', scrollOnWheel, true) },
      // Decorations collections have clear(), not dispose().
      { dispose: () => linkDecoration.clear() },
      { dispose: () => {
        window.removeEventListener('keydown', handleModifier);
        window.removeEventListener('keyup', handleModifier);
        window.removeEventListener('blur', resetLink);
      } },
      editor.onDidChangeModel(resetLink),
      editor.onMouseLeave(() => {
        hoveredPosition = null;
        hoveringText = false;
        clearLink();
      }),
      editor.onMouseMove((event) => {
        hoveredPosition = event.target.position;
        hoveringText = event.target.type === api.editor.MouseTargetType.CONTENT_TEXT;
        modifierDown = event.event.ctrlKey || event.event.metaKey;
        updateLink();
      }),
      api.languages.registerDefinitionProvider({ language: 'java', scheme: 'code-explorer' }, {
        provideDefinition(model: monaco.editor.ITextModel, position: monaco.Position) {
          const bundle = materialRef.current;
          const path = sourcePath(model.uri);
          if (!bundle || !path) return null;
          const ref = findCodeReference(bundle.references, path, position.lineNumber, position.column);
          if (!ref || ref.status === 'UNRESOLVED') return null;
          const targets = ref.targets.flatMap((id) => {
            const symbol = bundle.symbols.find((entry) => entry.id === id);
            if (!symbol) return [];
            return [{
              uri: api.Uri.from({ scheme: 'code-explorer', path: modelRoot + symbol.file }),
              range: new api.Range(symbol.line, symbol.column, symbol.endLine, symbol.endColumn),
            }];
          });
          return targets.length ? targets : null;
        },
      }),
      api.editor.registerEditorOpener({
        openCodeEditor(_source: monaco.editor.ICodeEditor, uri: monaco.Uri, selection?: monaco.IRange | monaco.IPosition) {
          const path = sourcePath(uri);
          if (!path || !materialRef.current?.files.some((file) => file.path === path)) return false;
          const line = selection && 'startLineNumber' in selection ? selection.startLineNumber
            : selection && 'lineNumber' in selection ? selection.lineNumber : 1;
          const column = selection && 'startColumn' in selection ? selection.startColumn
            : selection && 'column' in selection ? selection.column : 1;
          openRef.current({ path, line, column });
          return true;
        },
      }),
      // Explicit browser interactions remain functional even in the slim
      // Monaco build where not all VS Code navigation contributions load.
      editor.onMouseDown((event) => {
        if ((event.event.ctrlKey || event.event.metaKey) && event.target.position) {
          openDefinition(event.target.position.lineNumber, event.target.position.column);
        }
      }),
      editor.onKeyDown((event) => {
        if (event.keyCode === api.KeyCode.F12) {
          const position = editor.getPosition();
          if (position) {
            event.preventDefault();
            event.stopPropagation();
            openDefinition(position.lineNumber, position.column);
          }
        }
      }),
    ];
  }, [modelRoot]);

  const jump = (direction: number) =>
    setNavigation((previous) => ({
      ...previous,
      index: Math.max(0, Math.min(previous.entries.length - 1, previous.index + direction)),
    }));
  const closeTab = (path: string) => {
    const next = tabs.filter((item) => item !== path);
    setTabs(next);
    if (location?.path === path) {
      if (next.length) openFile(next[next.length - 1]);
      else setNavigation({ entries: [], index: -1 });
    }
  };

  return <aside className="code-explorer" aria-label="Source Explorer">
    <header className="code-explorer__header">
      <span><strong>Source Explorer</strong><small>{language === 'vi' ? 'Java · chỉ đọc' : 'Java · read-only'}</small></span>
      <button type="button" onClick={onClose} aria-label="Close Source Explorer">✕</button>
    </header>
    {!material && !loadError && <div className="code-explorer__status">{language === 'vi' ? 'Đang tải mã nguồn Case Study...' : 'Loading Case Study source...'}</div>}
    {loadError && <div className="code-explorer__status" role="alert">{loadError}
      <button type="button" onClick={() => setRetry((n) => n + 1)}>{language === 'vi' ? 'Thử lại' : 'Retry'}</button>
    </div>}
    {material && <>
      <div className="code-explorer__toolbar">
        <span>{material.files.length} files · Group {caseScope.groupID} / Case {caseScope.caseIndex}</span>
        <div>
          <button type="button" aria-label="Go back" disabled={navigation.index <= 0} onClick={() => jump(-1)}>←</button>
          <button type="button" aria-label="Go forward" disabled={navigation.index >= navigation.entries.length - 1} onClick={() => jump(1)}>→</button>
        </div>
      </div>
      <div className="code-explorer__workspace">
        <nav className="code-explorer__tree" aria-label="Java source files">
          <div className="code-explorer__tree-heading">
            <strong>EXPLORER</strong>
            <small>{material.files.length} {language === 'vi' ? 'file' : 'files'}</small>
          </div>
          {material.tree.map((node) =>
            <FileTree key={node.path} node={node} selected={location?.path} open={openFile} />)}
        </nav>
        <div className="code-explorer__main">
          <div className="code-explorer__tabs" role="tablist" aria-label="Open Java files">
            {tabs.map((file) => <div key={file} className={'code-explorer__tab' + (location?.path === file ? ' is-active' : '')}>
              <button type="button" role="tab" aria-selected={location?.path === file} title={file}
                onClick={() => openFile(file)}>{file.split('/').pop()}</button>
              <button type="button" aria-label={'Close ' + file.split('/').pop()} onClick={() => closeTab(file)}>×</button>
            </div>)}
          </div>
          {notice && <div className="code-explorer__notice" role="status">{notice}</div>}
          {alternatives.length > 1 && (
            <div className="code-explorer__notice" role="group" aria-label="Choose method definition">
              <strong>{language === 'vi' ? 'Chọn định nghĩa' : 'Choose definition'}</strong>
              {alternatives.map((item) => (
                <button type="button" key={item.id} onClick={() => openAt({
                  path: item.file, line: item.line, column: item.column,
                })}>{item.id}</button>
              ))}
            </div>
          )}
          {!location && <div className="code-explorer__status">{language === 'vi'
            ? 'Chọn file Java của case.' : 'Select a Java file for this case.'}</div>}
          {sourceError && <div className="code-explorer__status" role="alert">{sourceError}</div>}
          {location && code === null && !sourceError && <div className="code-explorer__status">Loading Java source...</div>}
          {location && code !== null && <>
            <div className="code-explorer__breadcrumb" title={location.path}>{location.path}</div>
            <div className="code-explorer__editor">
              <Editor path={monaco.Uri.from({ scheme: 'code-explorer', path: modelRoot + location.path }).toString()}
                language="java" value={code} theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                onMount={mounted}
                options={{ readOnly: true, domReadOnly: true, minimap: { enabled: false },
                  fontSize: 12, lineNumbersMinChars: 3, automaticLayout: true,
                  scrollBeyondLastLine: false, folding: true, wordWrap: 'off',
                  scrollbar: { vertical: 'visible', horizontal: 'auto',
                    handleMouseWheel: true, alwaysConsumeMouseWheel: false } }}
                saveViewState />
            </div>
          </>}
        </div>
      </div>
      <footer className="code-explorer__footer">Ctrl/Cmd+Click · F12 → Go to Definition · Read-only</footer>
    </>}
  </aside>;
}
