import { isValidElement, useEffect, useId, useState, type ReactNode } from 'react';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { wrapMermaidLabel } from '../data/mermaidLabelWrap';

interface MermaidMarkdownProps {
  children: string;
}

type DiagramTheme = 'light' | 'dark';

type DiagramState =
  | { status: 'loading' }
  | { status: 'ready'; svg: string }
  | { status: 'error' };

function activeTheme(): DiagramTheme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

// Use explicit, readable Mermaid palettes rather than its light-default colors
// (which make node/message labels nearly invisible on the Portal's dark surface).
const diagramPalettes = {
  dark: {
    background: '#17191e',
    primaryColor: '#293548',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#a78bfa',
    secondaryColor: '#293548',
    secondaryTextColor: '#f8fafc',
    secondaryBorderColor: '#a78bfa',
    tertiaryColor: '#293548',
    tertiaryTextColor: '#f8fafc',
    tertiaryBorderColor: '#a78bfa',
    textColor: '#f8fafc',
    nodeTextColor: '#f8fafc',
    lineColor: '#cbd5e1',
    defaultLinkColor: '#cbd5e1',
    edgeLabelBackground: '#293548',
    actorBkg: '#293548',
    actorBorder: '#a78bfa',
    actorTextColor: '#f8fafc',
    actorLineColor: '#cbd5e1',
    signalColor: '#cbd5e1',
    signalTextColor: '#f8fafc',
    labelBoxBkgColor: '#293548',
    labelBoxBorderColor: '#a78bfa',
    labelTextColor: '#f8fafc',
    loopTextColor: '#f8fafc',
    noteBkgColor: '#334155',
    noteBorderColor: '#a78bfa',
    noteTextColor: '#f8fafc',
    stateLabelColor: '#f8fafc',
    transitionColor: '#cbd5e1',
    transitionLabelColor: '#f8fafc',
    classText: '#f8fafc',
    titleColor: '#f8fafc',
  },
  light: {
    background: '#f3f5f8',
    primaryColor: '#e9eafe',
    primaryTextColor: '#1a1d23',
    primaryBorderColor: '#7655c2',
    secondaryColor: '#e9eafe',
    secondaryTextColor: '#1a1d23',
    secondaryBorderColor: '#7655c2',
    tertiaryColor: '#e9eafe',
    tertiaryTextColor: '#1a1d23',
    tertiaryBorderColor: '#7655c2',
    textColor: '#1a1d23',
    nodeTextColor: '#1a1d23',
    lineColor: '#475569',
    defaultLinkColor: '#475569',
    edgeLabelBackground: '#f3f5f8',
    actorBkg: '#e9eafe',
    actorBorder: '#7655c2',
    actorTextColor: '#1a1d23',
    actorLineColor: '#475569',
    signalColor: '#475569',
    signalTextColor: '#1a1d23',
    labelBoxBkgColor: '#e9eafe',
    labelBoxBorderColor: '#7655c2',
    labelTextColor: '#1a1d23',
    loopTextColor: '#1a1d23',
    noteBkgColor: '#eff6ff',
    noteBorderColor: '#7655c2',
    noteTextColor: '#1a1d23',
    stateLabelColor: '#1a1d23',
    transitionColor: '#475569',
    transitionLabelColor: '#1a1d23',
    classText: '#1a1d23',
    titleColor: '#1a1d23',
  },
} as const;

// Mermaid v11 represents many flowchart node labels using HTML inside
// <foreignObject>. Our SVG-only sanitizer intentionally strips that HTML,
// which previously left visible shapes with completely blank labels.
// Convert the labels into native SVG text BEFORE sanitizing, so all original
// HTML stays untrusted and never enters the displayed DOM.
function sanitizeDiagramSvg(svg: string, theme: DiagramTheme): string {
  const parsed = new DOMParser().parseFromString(svg, 'text/html');
  const root = parsed.querySelector('svg');
  if (!root) {
    return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } });
  }

  const context = document.createElement('canvas').getContext('2d');
  const measure = (text: string, fontSize: number): number => {
    if (!context) return Array.from(text).length * fontSize * 0.65;
    context.font = `${fontSize}px "Trebuchet MS", Verdana, Arial, sans-serif`;
    return context.measureText(text).width;
  };

  for (const foreignObject of root.querySelectorAll('foreignObject')) {
    const width = Number(foreignObject.getAttribute('width') ?? 0);
    const height = Number(foreignObject.getAttribute('height') ?? 0);
    const paragraphs = Array.from(foreignObject.querySelectorAll('p'));
    // Preserve deliberate <br> breaks without copying any HTML into SVG.
    for (const br of foreignObject.querySelectorAll('br')) {
      br.replaceWith(parsed.createTextNode('\n'));
    }
    const lines = (paragraphs.length > 0 ? paragraphs : [foreignObject])
      .flatMap((node) => (node.textContent ?? '').split('\n'))
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    const wrapped = wrapMermaidLabel(lines, width, height, measure);
    const label = parsed.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', String(Number.isFinite(width) ? width / 2 : 0));
    label.setAttribute('y', String(Number.isFinite(height) ? height / 2 : 0));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'middle');
    label.setAttribute('fill', diagramPalettes[theme].primaryTextColor);
    label.setAttribute('font-size', String(wrapped.fontSize));
    label.setAttribute('font-family', 'Trebuchet MS, Verdana, Arial, sans-serif');

    for (let i = 0; i < wrapped.lines.length; i++) {
      const tspan = parsed.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.setAttribute('x', label.getAttribute('x') ?? '0');
      tspan.setAttribute('dy', i === 0
        ? String(-(wrapped.lines.length - 1) * wrapped.lineHeight / 2)
        : String(wrapped.lineHeight));
      tspan.textContent = wrapped.lines[i];
      label.appendChild(tspan);
    }
    foreignObject.replaceWith(label);
  }

  return DOMPurify.sanitize(root.outerHTML, { USE_PROFILES: { svg: true, svgFilters: true } });
}
// Mermaid uses shared DOM rendering state, so serialize renders (including
// distinct themes) to avoid cross-diagram palette interference.
let renderQueue: Promise<void> = Promise.resolve();
let mermaidImport: Promise<typeof import('mermaid')> | undefined;
let renderSequence = 0;

function renderDiagram(source: string, id: string, theme: DiagramTheme): Promise<string> {
  const render = async (): Promise<string> => {
    mermaidImport ??= import('mermaid');
    const { default: mermaid } = await mermaidImport;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      themeVariables: diagramPalettes[theme],
      flowchart: { htmlLabels: false },
    });

    await mermaid.parse(source);
    const { svg } = await mermaid.render(id + '-' + ++renderSequence, source);
    // The content comes from published Markdown. Never insert raw SVG into the DOM.
    return sanitizeDiagramSvg(svg, theme);
  };

  const task = renderQueue.then(render, render);
  renderQueue = task.then(() => undefined, () => undefined);
  return task;
}

function MermaidDiagram({ source }: { source: string }) {
  const id = 'mermaid-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [theme, setTheme] = useState<DiagramTheme>(activeTheme);
  const [state, setState] = useState<DiagramState>({ status: 'loading' });

  useEffect(() => {
    const element = document.documentElement;
    const syncTheme = () => setTheme(activeTheme());
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(element, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });

    void renderDiagram(source, id, theme)
      .then((svg) => {
        if (active) setState({ status: 'ready', svg });
      })
      .catch(() => {
        if (active) setState({ status: 'error' });
      });

    return () => {
      active = false;
    };
  }, [id, source, theme]);

  return (
    <div className="mermaid-diagram">
      {state.status === 'loading' && <p className="mermaid-diagram__status">Rendering diagram…</p>}
      {state.status === 'ready' && (
        <div className="mermaid-diagram__svg" role="img" aria-label="Mermaid diagram" dangerouslySetInnerHTML={{ __html: state.svg }} />
      )}
      {state.status === 'error' && (
        <div className="mermaid-diagram__error">
          <p>The diagram could not be rendered. You can still view its source below.</p>
          <pre><code>{source}</code></pre>
        </div>
      )}
    </div>
  );
}

export function MermaidMarkdown({ children }: MermaidMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre({ node: _node, children: content, ...props }) {
          if (isValidElement<{ className?: string; children?: ReactNode }>(content)
            && /(?:^|\s)language-mermaid(?:\s|$)/i.test(content.props.className ?? '')) {
            const source = content.props.children;
            if (typeof source === 'string') {
              return <MermaidDiagram source={source.trimEnd()} />;
            }
          }

          return <pre {...props}>{content}</pre>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
