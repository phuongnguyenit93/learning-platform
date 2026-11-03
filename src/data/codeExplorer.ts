import { fetchJavaAsset } from './javaAsset';

export interface ExplorerFile {
  path: string;
  bytes: number;
  sha256: string;
}

export interface ExplorerTreeNode {
  name: string;
  path: string;
  type: 'FILE' | 'DIRECTORY';
  children: ExplorerTreeNode[];
}

export interface ExplorerSymbol {
  id: string;
  kind: 'TYPE' | 'METHOD';
  name: string;
  file: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  signature?: string;
}

export interface ExplorerReference {
  file: string;
  kind: 'TYPE_USE' | 'METHOD_CALL';
  text: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  status: 'RESOLVED' | 'MULTIPLE_TARGETS' | 'UNRESOLVED';
  targets: string[];
}

export interface CodeExplorerMaterial {
  url: string;
  files: ExplorerFile[];
  tree: ExplorerTreeNode[];
  symbols: ExplorerSymbol[];
  references: ExplorerReference[];
}

const javaPath = /^(?:[A-Za-z0-9_$-]+\/)*[A-Za-z0-9_$-]+\.java$/;
// Only STEP 8 Case Study bundles are accepted. Module-wide material was retired.
const indexPath = /^\/module\/[A-Z0-9_-]+\/code-explorer\/casestudy\/groups\/[1-9]\d*\/cases\/[1-9]\d*\/index\.json$/;
const materialCache = new Map<string, Promise<CodeExplorerMaterial>>();
const sourceCache = new Map<string, Promise<string>>();

function safeJsonAsset(path: string): string {
  if (!indexPath.test(path)) throw new Error('Invalid Code Explorer material URL.');
  return path;
}

function assetBase(path: string): string {
  return safeJsonAsset(path).slice(0, -'index.json'.length);
}

function requireJavaFile(path: string): string {
  if (!javaPath.test(path)) throw new Error('Invalid Code Explorer source path.');
  return path;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetchJavaAsset(path);
  if (!response.ok) throw new Error('Code Explorer asset unavailable (' + response.status + ').');
  return response.json() as Promise<T>;
}

async function fetchMaterial(index: string): Promise<CodeExplorerMaterial> {
  const base = assetBase(index);
  const header = await fetchJson<{
    version: number;
    type: string;
    language: string;
    files: ExplorerFile[];
    tree: ExplorerTreeNode[];
    symbols: string;
    references: string;
  }>(index);
  if (header.version !== 1 || header.type !== 'CODE_EXPLORER' || header.language !== 'java'
    || !Array.isArray(header.files) || !header.files.length || !Array.isArray(header.tree)
    || header.symbols !== 'symbols.json' || header.references !== 'references.json') {
    throw new Error('Unsupported Code Explorer material version.');
  }
  const paths = new Set<string>();
  for (const file of header.files) {
    requireJavaFile(file.path);
    if (paths.has(file.path)) throw new Error('Duplicate Code Explorer file.');
    paths.add(file.path);
  }
  const [declarations, usages] = await Promise.all([
    fetchJson<{ symbols: ExplorerSymbol[] }>(base + header.symbols),
    fetchJson<{ references: ExplorerReference[] }>(base + header.references),
  ]);
  if (!Array.isArray(declarations.symbols) || !Array.isArray(usages.references)) {
    throw new Error('Invalid Case Study Explorer index.');
  }
  if (declarations.symbols.some((symbol) => !paths.has(symbol.file))
    || usages.references.some((usage) => !paths.has(usage.file))) {
    throw new Error('Code Explorer index references a missing source file.');
  }
  return {
    url: index,
    files: header.files,
    tree: header.tree,
    symbols: declarations.symbols,
    references: usages.references,
  };
}

export function loadCodeExplorer(path: string): Promise<CodeExplorerMaterial> {
  safeJsonAsset(path);
  const existing = materialCache.get(path);
  if (existing) return existing;
  const pending = fetchMaterial(path).catch((error: unknown) => {
    materialCache.delete(path);
    throw error;
  });
  materialCache.set(path, pending);
  return pending;
}

export function loadCodeExplorerFile(material: CodeExplorerMaterial, path: string): Promise<string> {
  requireJavaFile(path);
  if (!material.files.some((file) => file.path === path)) {
    return Promise.reject(new Error('Source is not included in this Code Explorer material.'));
  }
  const url = assetBase(material.url) + 'files/' + path;
  const cached = sourceCache.get(url);
  if (cached) return cached;
  const pending = fetchJavaAsset(url).then((response) => {
    if (!response.ok) throw new Error('Source unavailable (' + response.status + ').');
    return response.text();
  }).catch((error: unknown) => {
    sourceCache.delete(url);
    throw error;
  });
  sourceCache.set(url, pending);
  return pending;
}

export function findCodeReference(
  references: ExplorerReference[],
  file: string,
  line: number,
  column: number,
): ExplorerReference | undefined {
  return references.find((reference) =>
    reference.file === file && reference.line <= line && reference.endLine >= line
    && (line > reference.line || column >= reference.column)
    && (line < reference.endLine || column <= reference.endColumn),
  );
}
