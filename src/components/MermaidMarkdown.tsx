import { isValidElement, useEffect, useId, useState, type ReactNode } from 'react';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MermaidMarkdownProps {
  children: string;
}

type DiagramState =
  | { status: 'loading' }
  | { status: 'ready'; svg: string }
  | { status: 'error' };

// Mermaid's renderer uses a shared DOM container, so serialize diagram renders.
let renderQueue: Promise<void> = Promise.resolve();
let mermaidImport: Promise<typeof import('mermaid')> | undefined;

function renderDiagram(source: string, id: string): Promise<string> {
  const render = async (): Promise<string> => {
    mermaidImport ??= import('mermaid');
    const { default: mermaid } = await mermaidImport;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      flowchart: { htmlLabels: false },
    });

    await mermaid.parse(source);
    const { svg } = await mermaid.render(id, source);
    // Content comes from published Markdown. Never insert raw SVG into the DOM.
    return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } });
  };

  const task = renderQueue.then(render, render);
  renderQueue = task.then(() => undefined, () => undefined);
  return task;
}

function MermaidDiagram({ source }: { source: string }) {
  const id = 'mermaid-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [state, setState] = useState<DiagramState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });

    void renderDiagram(source, id)
      .then((svg) => {
        if (active) setState({ status: 'ready', svg });
      })
      .catch(() => {
        if (active) setState({ status: 'error' });
      });

    return () => {
      active = false;
    };
  }, [id, source]);

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