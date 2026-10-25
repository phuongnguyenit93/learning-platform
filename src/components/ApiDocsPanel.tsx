import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { MermaidMarkdown } from './MermaidMarkdown';
import { loadApiDocs, resolveOperationKnowledgeKey } from '../data/apiDocs';
import { fetchJavaAsset } from '../data/javaAsset';
import {
  collectKnowledgeCategories,
  collectKnowledgeSections,
  formatKnowledgeDisplayTitle,
} from '../data/knowledge';
import { useLanguage } from '../state/LanguageContext';
import type {
  ApiDocController,
  ApiDocOperation,
  ApiDocsDocument,
  KnowledgeIndex,
  KnowledgeSectionRef,
} from '../types/learning';
import { CustomTooltip } from './CustomTooltip';
import { DownloadAction } from './DownloadAction';
import type { ExplorerRequest } from './CodeExplorerPanel';

const CodeExplorerPanel = lazy(() => import('./CodeExplorerPanel'));

interface ApiDocsPanelProps {
  basePath?: string;
  knowledgeIndex: KnowledgeIndex | null;
  searchQuery: string;
  onDownload: () => void;
  codeExplorerUrl?: string;
}

export function ApiDocsPanel({
  basePath,
  knowledgeIndex,
  searchQuery,
  onDownload,
  codeExplorerUrl,
}: ApiDocsPanelProps) {
  const { language } = useLanguage();
  const [document, setDocument] = useState<ApiDocsDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedControllers, setExpandedControllers] = useState<Set<string>>(new Set());
  const [expandedOperations, setExpandedOperations] = useState<Set<string>>(new Set());
  const [knowledgeDetailsOperations, setKnowledgeDetailsOperations] = useState<Set<string>>(new Set());
  const [knowledgeContentCache, setKnowledgeContentCache] = useState<Record<string, string>>({});
  const [knowledgeLoadingPaths, setKnowledgeLoadingPaths] = useState<Set<string>>(new Set());
  const [knowledgeErrors, setKnowledgeErrors] = useState<Record<string, string>>({});
  // At most one API owns a mounted Monaco editor. Switching operations
  // unmounts the previous explorer, while material/source fetches stay cached.
  const [activeSource, setActiveSource] = useState<{
    operationId: string;
    request: ExplorerRequest;
  } | null>(null);

  useEffect(() => {
    setActiveSource(null);
  }, [basePath, codeExplorerUrl]);

  useEffect(() => {
    let active = true;

    setDocument(null);
    setKnowledgeContentCache({});
    setKnowledgeLoadingPaths(new Set());
    setKnowledgeErrors({});

    if (!basePath) {
      setLoading(false);
      setError(null);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError(null);

    loadApiDocs(basePath, knowledgeIndex)
      .then((result) => {
        if (!active) {
          return;
        }

        setDocument(result);
        const controllerNames = new Set(result.controllers.map((controller) => controller.name));
        const operationIds = new Set(
          result.controllers.flatMap((controller) => controller.operations.map((operation) => operation.id)),
        );
        setExpandedControllers((current) => new Set(
          [...current].filter((controllerName) => controllerNames.has(controllerName)),
        ));
        setExpandedOperations((current) => new Set(
          [...current].filter((operationId) => operationIds.has(operationId)),
        ));
        setKnowledgeDetailsOperations((current) => new Set(
          [...current].filter((operationId) => operationIds.has(operationId)),
        ));
        setLoading(false);
      })
      .catch((loadError: unknown) => {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : 'Unable to load API Docs.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [basePath, knowledgeIndex]);

  const visibleControllers = useMemo(() => {
    if (!document) {
      return [];
    }

    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return document.controllers;
    }

    return document.controllers
      .map((controller) => {
        const controllerMatch = `${controller.name} ${controller.title} ${controller.description}`
          .toLowerCase()
          .includes(query);

        if (controllerMatch) {
          return controller;
        }

        const matchingOperations = controller.operations.filter((operation) =>
          `${operation.methodName} ${operation.methodSignature} ${operation.httpMethod} ${operation.path} ${operation.summary} ${operation.description}`
            .toLowerCase()
            .includes(query),
        );

        return matchingOperations.length > 0
          ? { ...controller, operations: matchingOperations }
          : null;
      })
      .filter((controller): controller is ApiDocController => controller !== null);
  }, [document, searchQuery]);

  const knowledgeTitleBySourcePath = useMemo(() => {
    if (!knowledgeIndex) {
      return new Map<string, string>();
    }

    return new Map(
      collectKnowledgeCategories(knowledgeIndex.tree).map((category) => [
        category.sourcePath,
        formatKnowledgeDisplayTitle(category.title),
      ]),
    );
  }, [knowledgeIndex]);

  const knowledgeSectionByKey = useMemo(() => {
    if (!knowledgeIndex) {
      return new Map<string, KnowledgeSectionRef>();
    }

    return new Map(
      collectKnowledgeSections(knowledgeIndex.tree).map((section) => [
        `${section.sourcePath}#${section.id}`,
        section,
      ]),
    );
  }, [knowledgeIndex]);

  const toggleController = (controllerName: string) => {
    if (expandedControllers.has(controllerName) && document?.controllers
      .find((controller) => controller.name === controllerName)?.operations
      .some((operation) => operation.id === activeSource?.operationId)) {
      setActiveSource(null);
    }
    setExpandedControllers((current) => {
      const next = new Set(current);
      if (next.has(controllerName)) {
        next.delete(controllerName);
      } else {
        next.add(controllerName);
      }
      return next;
    });
  };

  const toggleOperation = (operationId: string) => {
    setExpandedOperations((current) => {
      const next = new Set(current);
      if (next.has(operationId)) {
        next.delete(operationId);
      } else {
        next.add(operationId);
      }
      return next;
    });
  };

  const openOperationSource = (operation: ApiDocOperation) => {
    if (!codeExplorerUrl) return;
    setActiveSource((previous) => previous?.operationId === operation.id ? null : ({
      operationId: operation.id,
      request: {
        sequence: 1,
        operation: {
          controller: operation.controllerName,
          signature: operation.methodSignature,
          httpMethod: operation.httpMethod,
          path: operation.path,
        },
      },
    }));
  };

  const resolveLinkedKnowledge = (
    controller: ApiDocController,
    operation: ApiDocOperation,
  ): KnowledgeSectionRef | undefined => {
    const key = resolveOperationKnowledgeKey(controller, operation);
    return key ? knowledgeSectionByKey.get(key) : undefined;
  };

  const ensureKnowledgeContent = useCallback((section: KnowledgeSectionRef) => {
    if (
      knowledgeContentCache[section.content] !== undefined
      || knowledgeLoadingPaths.has(section.content)
    ) {
      return;
    }

    setKnowledgeLoadingPaths((current) => new Set(current).add(section.content));
    setKnowledgeErrors((current) => {
      if (current[section.content] === undefined) {
        return current;
      }

      const next = { ...current };
      delete next[section.content];
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
        setKnowledgeContentCache((current) => ({ ...current, [section.content]: markdown }));
      })
      .catch((cause: unknown) => {
        setKnowledgeErrors((current) => ({
          ...current,
          [section.content]: cause instanceof Error ? cause.message : 'Unable to load Knowledge.',
        }));
      })
      .finally(() => {
        setKnowledgeLoadingPaths((current) => {
          const next = new Set(current);
          next.delete(section.content);
          return next;
        });
      });
  }, [knowledgeContentCache, knowledgeLoadingPaths]);

  useEffect(() => {
    document?.controllers.forEach((controller) => {
      controller.operations.forEach((operation) => {
        if (!knowledgeDetailsOperations.has(operation.id)) {
          return;
        }

        const section = resolveLinkedKnowledge(controller, operation);
        if (section) {
          ensureKnowledgeContent(section);
        }
      });
    });
  }, [document, ensureKnowledgeContent, knowledgeDetailsOperations, knowledgeSectionByKey]);

  const toggleKnowledgeDetails = (operationId: string, section: KnowledgeSectionRef) => {
    const opening = !knowledgeDetailsOperations.has(operationId);

    setKnowledgeDetailsOperations((current) => {
      const next = new Set(current);
      if (next.has(operationId)) {
        next.delete(operationId);
      } else {
        next.add(operationId);
      }
      return next;
    });

    if (opening) {
      ensureKnowledgeContent(section);
    }
  };

  if (!basePath) {
    return (
      <div className="empty-state empty-state--large">
        <strong>{language === 'vi' ? 'Module này chưa có API Docs' : 'This module has no API Docs yet'}</strong>
        <span>
          {language === 'vi'
            ? 'API Docs chỉ xuất hiện khi module có đầy đủ Swagger metadata được publish cho Portal.'
            : 'API Docs appear when the module publishes a complete Swagger metadata set for the Portal.'}
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="empty-state">
        <strong>{language === 'vi' ? 'Đang tải API Docs...' : 'Loading API Docs...'}</strong>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state empty-state--large">
        <strong>{language === 'vi' ? 'Không thể tải API Docs' : 'Unable to load API Docs'}</strong>
        <span>{error}</span>
      </div>
    );
  }

  if (!document || document.operationCount === 0) {
    return (
      <div className="empty-state">
        <strong>{language === 'vi' ? 'Không có API đang hoạt động' : 'No active APIs found'}</strong>
      </div>
    );
  }

  const queryActive = searchQuery.trim().length > 0;

  return (
    <section className="api-docs-panel">
      <div className="api-docs-toolbar">
        <div className="api-docs-toolbar__summary">
          <strong>{language === 'vi' ? 'API Reference' : 'API Reference'}</strong>
          <span>
            {document.controllers.length} {language === 'vi' ? 'controller' : 'controllers'} · {document.operationCount} APIs
          </span>
        </div>

        <div className="api-docs-toolbar__actions">
          <button
            type="button"
            onClick={() => {
              setExpandedControllers(new Set(document.controllers.map((controller) => controller.name)));
              setExpandedOperations(new Set(document.controllers.flatMap((controller) => controller.operations.map((operation) => operation.id))));
            }}
          >
            {language === 'vi' ? 'Mở tất cả' : 'Expand all'}
          </button>
          <button
            type="button"
            onClick={() => {
              setExpandedControllers(new Set());
              setExpandedOperations(new Set());
              setActiveSource(null);
            }}
          >
            {language === 'vi' ? 'Thu gọn tất cả' : 'Collapse all'}
          </button>
        </div>
      </div>

      <div className="api-docs-notice">
        <div className="api-docs-notice__copy">
          <strong>{language === 'vi' ? 'Lưu ý khi sử dụng API Reference' : 'API Reference note'}</strong>
          <p>
            {language === 'vi'
              ? 'API Reference này chỉ dùng để tham khảo và hỗ trợ học tập. Bạn không thể chạy hoặc debug API trực tiếp tại Portal. Để thực thi và debug, hãy tải source code của module về và chạy trên máy local.'
              : 'This API Reference is provided for learning and reference only. APIs cannot be run or debugged directly in the Portal. To execute or debug them, download the module source code and run it locally.'}
          </p>
        </div>

        <DownloadAction
          onClick={onDownload}
          className="api-docs-notice__download"
        />
      </div>

      {visibleControllers.length === 0 ? (
        <div className="empty-state">
          <strong>{language === 'vi' ? 'Không tìm thấy API phù hợp' : 'No matching APIs found'}</strong>
        </div>
      ) : (
        <div className="api-controller-list">
          {visibleControllers.map((controller) => {
            const controllerOpen = queryActive || expandedControllers.has(controller.name);
            const knowledgeTitle = controller.readmeRelated.file
              ? knowledgeTitleBySourcePath.get(controller.readmeRelated.file)
              : undefined;

            return (
              <article key={controller.name} className={`api-controller${controllerOpen ? ' is-expanded' : ''}`}>
                <button
                  type="button"
                  className="api-controller__header"
                  aria-expanded={controllerOpen}
                  onClick={() => toggleController(controller.name)}
                >
                  <span className="api-controller__copy">
                    <span className="api-controller__title-row">
                      {knowledgeTitle && <span className="api-controller__knowledge">{knowledgeTitle}</span>}
                      <strong>{controller.title}</strong>
                    </span>
                    <span className="api-controller__name">{controller.name}</span>
                    {controller.description && <span className="api-controller__description">{controller.description}</span>}
                  </span>
                  <span className="api-controller__count">{controller.operations.length} APIs</span>
                </button>

                {controllerOpen && (
                  <div className="api-controller__operations">
                    {controller.operations.map((operation) => {
                      const operationOpen = expandedOperations.has(operation.id);
                      const sourceOpen = activeSource?.operationId === operation.id;
                      const sanitizedExecution = operation.executionHtml
                        ? DOMPurify.sanitize(operation.executionHtml)
                        : '';
                      const linkedKnowledge = resolveLinkedKnowledge(controller, operation);
                      const knowledgeDetailsOpen = linkedKnowledge
                        ? knowledgeDetailsOperations.has(operation.id)
                        : false;
                      const knowledgeMarkdown = linkedKnowledge
                        ? knowledgeContentCache[linkedKnowledge.content]
                        : undefined;
                      const knowledgeLoading = linkedKnowledge
                        ? knowledgeLoadingPaths.has(linkedKnowledge.content)
                        : false;
                      const knowledgeError = linkedKnowledge
                        ? knowledgeErrors[linkedKnowledge.content]
                        : undefined;

                      return (
                        <article
                          key={operation.id}
                          className={`api-operation${operationOpen ? ' is-expanded' : ''}`}
                        >
                          <div className="api-operation__header">
                            <button
                              type="button"
                              className="api-operation__toggle"
                              aria-expanded={operationOpen}
                              onClick={() => toggleOperation(operation.id)}
                            >
                              <span className={`http-method http-method--${operation.httpMethod.toLowerCase()}`}>
                                {operation.httpMethod}
                              </span>
                              <code>{operation.path || '—'}</code>
                              <span className="api-operation__copy">
                                <strong>{operation.summary}</strong>
                                <span>{operation.description}</span>
                              </span>
                            </button>
                            {codeExplorerUrl && (
                              <button type="button" className={'api-operation__source-toggle' + (sourceOpen ? ' is-open' : '')}
                                aria-expanded={sourceOpen}
                                aria-label={(sourceOpen ? 'Close' : 'Open') + ' Java source for ' + operation.httpMethod + ' ' + operation.path}
                                onClick={() => openOperationSource(operation)}>
                                &lt;/&gt; {sourceOpen ? (language === 'vi' ? 'Đóng Source' : 'Close Source') : 'Source'}
                              </button>
                            )}
                            {operationOpen && linkedKnowledge && (
                              <button
                                type="button"
                                className={`api-operation__knowledge-toggle${knowledgeDetailsOpen ? ' is-open' : ''}`}
                                onClick={() => toggleKnowledgeDetails(operation.id, linkedKnowledge)}
                              >
                                {knowledgeDetailsOpen
                                  ? (language === 'vi' ? 'Đóng' : 'Close')
                                  : (language === 'vi' ? 'Chi tiết' : 'Details')}
                              </button>
                            )}
                          </div>

                          {sourceOpen && codeExplorerUrl && (
                            <div className="api-operation__source-explorer">
                              <Suspense fallback={<div className="code-explorer__status" role="status">Loading Source Explorer...</div>}>
                                <CodeExplorerPanel
                                  key={operation.id}
                                  materialUrl={codeExplorerUrl}
                                  request={activeSource.request}
                                  onClose={() => setActiveSource(null)}
                                />
                              </Suspense>
                            </div>
                          )}

                          {operationOpen && (
                            <div className="api-operation__details">
                              <div className={`api-operation__content-grid${knowledgeDetailsOpen ? ' is-split' : ''}`}>
                                <section className="api-operation__detail-section api-operation__execution-pane">
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

                                {knowledgeDetailsOpen && linkedKnowledge && (
                                  <section className="api-operation__detail-section api-operation__knowledge-pane">
                                    <div className="api-operation__knowledge-heading">
                                      <div>
                                        <span>{language === 'vi' ? 'Kiến thức liên quan' : 'Related Knowledge'}</span>
                                        <strong>{formatKnowledgeDisplayTitle(linkedKnowledge.title)}</strong>
                                      </div>
                                    </div>

                                    {knowledgeLoading && (
                                      <div className="knowledge-section-status">
                                        {language === 'vi' ? 'Đang tải nội dung...' : 'Loading content...'}
                                      </div>
                                    )}

                                    {!knowledgeLoading && knowledgeError && (
                                      <div className="knowledge-section-status knowledge-section-status--error">
                                        {knowledgeError}
                                      </div>
                                    )}

                                    {!knowledgeLoading && knowledgeMarkdown !== undefined && (
                                      <div className="markdown-content api-operation__knowledge-markdown">
                                        <MermaidMarkdown>{knowledgeMarkdown}</MermaidMarkdown>
                                      </div>
                                    )}
                                  </section>
                                )}
                              </div>

                              {operation.params.length > 0 && (
                                <section className="api-operation__detail-section">
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
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
