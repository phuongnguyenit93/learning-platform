import { parse } from 'yaml';
import { collectKnowledgeCategories } from './knowledge';
import { fetchJavaAsset } from './javaAsset';
import type {
  ApiDocController,
  ApiKnowledgeRelation,
  ApiDocOperation,
  ApiDocsDocument,
  ApiParamDefinition,
  ApiReadmeRelated,
  KnowledgeIndex,
} from '../types/learning';

interface ApiDocsSourceBundle {
  controllerDescriptions: Record<string, unknown>;
  apiDescriptions: Record<string, unknown>;
  apiExecutions: Record<string, unknown>;
}

const sourceCache = new Map<string, Promise<ApiDocsSourceBundle>>();

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asBoolean(value: unknown, fallback = true): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => String(item ?? '').trim()).filter(Boolean)
    : [];
}

function normalizeBasePath(basePath: string): string {
  return basePath.replace(/\/+$/, '');
}

async function fetchText(path: string): Promise<string> {
  const response = await fetchJavaAsset(path);

  if (!response.ok) {
    throw new Error(`Unable to load API metadata: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function loadApiDocsSource(basePath: string): Promise<ApiDocsSourceBundle> {
  const normalizedBasePath = normalizeBasePath(basePath);
  const cached = sourceCache.get(normalizedBasePath);

  if (cached) {
    return cached;
  }

  const request = Promise.all([
    fetchText(`${normalizedBasePath}/controller-description.yml`),
    fetchText(`${normalizedBasePath}/api-descriptions.yml`),
    fetchText(`${normalizedBasePath}/api-execution.yml`),
  ])
    .then(([controllerDescriptions, apiDescriptions, apiExecutions]) => ({
      controllerDescriptions: asRecord(parse(controllerDescriptions)),
      apiDescriptions: asRecord(parse(apiDescriptions)),
      apiExecutions: asRecord(parse(apiExecutions)),
    }))
    .catch((error: unknown) => {
      sourceCache.delete(normalizedBasePath);
      throw error;
    });

  sourceCache.set(normalizedBasePath, request);
  return request;
}

function normalizeReadmeRelated(value: unknown): ApiReadmeRelated {
  const related = asRecord(value);
  const file = asString(related.file).trim();
  const anchor = asString(related.anchor).trim();
  const anchorList = asStringArray(related.anchorList);

  return {
    ...(Array.isArray(related.anchorList) ? { anchorList } : {}),
    ...(file ? { file } : {}),
    ...(anchor ? { anchor } : {}),
  };
}

function decodeBasicHtmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(value: string): string {
  return decodeBasicHtmlEntities(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function extractControllerTitle(descriptionHtml: string, fallback: string): string {
  const match = descriptionHtml.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i);
  const title = match ? stripHtml(match[1]) : '';

  return title || fallback;
}

function extractControllerDescription(descriptionHtml: string): string {
  const withoutHeading = descriptionHtml.replace(/<h2\b[^>]*>[\s\S]*?<\/h2>/i, ' ');
  return stripHtml(withoutHeading);
}

function resolveParamDefinitions(
  params: unknown,
): ApiParamDefinition[] {
  if (!Array.isArray(params)) return [];
  return params.map((item) => {
    const definition = asRecord(item);
    return {
      name: asString(definition.name).trim(),
      summary: asString(definition.summary).trim(),
      description: asString(definition.description).trim(),
    };
  }).filter((param) => param.name.length > 0);
}

function buildReadmeAnchorOrder(index: KnowledgeIndex | null): Map<string, number> {
  const result = new Map<string, number>();

  if (!index) {
    return result;
  }

  let order = 0;
  collectKnowledgeCategories(index.tree).forEach((category) => {
    category.sections.forEach((section) => {
      result.set(`${category.sourcePath}#${section.id}`, order);
      // Section IDs are unique in the module-wide catalog.
      if (!result.has(section.id)) result.set(section.id, order);
      order += 1;
    });
  });

  return result;
}

function sortOperations(
  operations: ApiDocOperation[],
  readmeAnchorOrder: Map<string, number>,
): ApiDocOperation[] {
  return [...operations].sort((left, right) => {
    const leftFile = left.readmeRelated.file;
    const rightFile = right.readmeRelated.file;
    const leftKey = leftFile && left.readmeRelated.anchor
      ? `${leftFile}#${left.readmeRelated.anchor}`
      : left.readmeRelated.anchorList?.[0] ?? '';
    const rightKey = rightFile && right.readmeRelated.anchor
      ? `${rightFile}#${right.readmeRelated.anchor}`
      : right.readmeRelated.anchorList?.[0] ?? '';
    const leftOrder = leftKey ? readmeAnchorOrder.get(leftKey) : undefined;
    const rightOrder = rightKey ? readmeAnchorOrder.get(rightKey) : undefined;

    if (leftOrder !== undefined && rightOrder !== undefined && leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    if (leftOrder !== undefined && rightOrder === undefined) {
      return -1;
    }

    if (leftOrder === undefined && rightOrder !== undefined) {
      return 1;
    }

    return left.methodSignature.localeCompare(right.methodSignature);
  });
}

export function buildDocument(
  source: ApiDocsSourceBundle,
  knowledgeIndex: KnowledgeIndex | null,
): ApiDocsDocument {
  const readmeAnchorOrder = buildReadmeAnchorOrder(knowledgeIndex);
  const controllers: ApiDocController[] = [];

  Object.entries(source.apiDescriptions).forEach(([controllerName, methodsValue]) => {
    const controllerDescription = asRecord(source.controllerDescriptions[controllerName]);
    const descriptionHtml = asString(controllerDescription.description).trim();
    const executionController = asRecord(source.apiExecutions[controllerName]);
    const operations: ApiDocOperation[] = [];

    Object.entries(asRecord(methodsValue)).forEach(([methodSignature, methodValue]) => {
      const method = asRecord(methodValue);

      if (!asBoolean(method.usage)) {
        return;
      }

      const execution = asRecord(executionController[methodSignature]);
      const httpMethods = asStringArray(method.httpMethods);
      const mappingPaths = asStringArray(method.mappingPaths);
      const methodName = asString(method.methodName).trim() || methodSignature.replace(/\(.*/, '');
      const operationReadmeRelated = normalizeReadmeRelated(method.readmeRelated);

      operations.push({
        id: `${controllerName}:${methodSignature}`,
        controllerName,
        methodSignature,
        methodName,
        httpMethod: httpMethods[0] || 'GET',
        path: mappingPaths[0] || '',
        summary: asString(method.summary).trim() || methodName,
        description: asString(method.description).trim(),
        executionHtml: asString(execution.execution).trim(),
        consumes: asStringArray(method.consumes),
        produces: asStringArray(method.produces),
        params: resolveParamDefinitions(method.params),
        readmeRelated: operationReadmeRelated,
      });
    });

    if (operations.length === 0) {
      return;
    }

    controllers.push({
      name: controllerName,
      title: extractControllerTitle(descriptionHtml, controllerName),
      description: extractControllerDescription(descriptionHtml),
      descriptionHtml,
      operations: sortOperations(operations, readmeAnchorOrder),
    });
  });

  controllers.sort((left, right) => left.name.localeCompare(right.name, undefined, { numeric: true }));

  return {
    operationCount: controllers.reduce((count, controller) => count + controller.operations.length, 0),
    controllers,
  };
}

export async function loadApiDocs(
  basePath: string,
  knowledgeIndex: KnowledgeIndex | null,
): Promise<ApiDocsDocument> {
  const source = await loadApiDocsSource(basePath);
  return buildDocument(source, knowledgeIndex);
}

export async function loadApiOperationCount(basePath: string): Promise<number> {
  const source = await loadApiDocsSource(basePath);
  return buildDocument(source, null).operationCount;
}

export function resolveOperationKnowledgeKeys(
  controller: ApiDocController,
  operation: ApiDocOperation,
  index: KnowledgeIndex | null,
): string[] {
  if (operation.readmeRelated.anchorList) {
    if (!index) return [];
    const byId = new Map<string, string | null>();
    collectKnowledgeCategories(index.tree).forEach((category) => {
      category.sections.forEach((section) => {
        byId.set(section.id, byId.has(section.id) ? null : `${category.sourcePath}#${section.id}`);
      });
    });
    return operation.readmeRelated.anchorList
      .map((id) => byId.get(id))
      .filter((key): key is string => Boolean(key));
  }
  const sourcePath = operation.readmeRelated.file;
  const anchor = operation.readmeRelated.anchor;

  return sourcePath && anchor ? [`${sourcePath}#${anchor}`] : [];
}

export function collectApiKnowledgeRelations(
  document: ApiDocsDocument,
  index: KnowledgeIndex | null = null,
): ApiKnowledgeRelation[] {
  return document.controllers.flatMap((controller) =>
    controller.operations.flatMap((operation) =>
      resolveOperationKnowledgeKeys(controller, operation, index).map((key) => {
        const separator = key.lastIndexOf('#');
        return { controller, operation, sourcePath: key.slice(0, separator), anchor: key.slice(separator + 1) };
      })),
  );
}
