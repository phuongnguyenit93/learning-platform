/**
 * Consume only the static Java data published by java-learning.
 *
 * STEP 3.1: Run explicitly with --check (download/verify only) or --sync
 * (replace only dist/language/java). The dev/build npm scripts download first
 * and verify before serving or deploying; the generated ZIP stays unchanged.
 */
import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, isAbsolute, join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { unzipSync } from 'fflate';

const RELEASE = 'https://github.com/phuongnguyenit93/java-learning/releases/download/java-data';
const ZIP_NAME = 'java-learning-data.zip';
const CHECKSUM_NAME = 'java-learning-data.zip.sha256';
const ALLOWED_EXTENSIONS = new Set(['.json', '.yml', '.yaml', '.md']);
const CODE_EXPLORER_JAVA = /^module\/[A-Z0-9_-]+\/code-explorer\/files\/(?:[A-Za-z0-9_$-]+\/)*[A-Za-z0-9_$-]+\.java$/;
const MANAGED_NAMES = new Set(['module-catalog.json', 'module', 'search']);
const MAX_DOWNLOAD_BYTES = 120 * 1024 * 1024;
const MAX_EXTRACTED_BYTES = 300 * 1024 * 1024;
const MAX_FILE_COUNT = 50_000;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function decode(bytes) {
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export function parseChecksum(text) {
  const match = /^([0-9a-f]{64}) {2}java-learning-data\.zip\r?\n?$/.exec(text);
  assert(match, 'Invalid java-learning-data.zip.sha256 format');
  return match[1];
}

function validateName(name, isManifest = false) {
  assert(typeof name === 'string' && name.length > 0, 'Empty ZIP path');
  assert(
    !isAbsolute(name) && !name.startsWith('/') && !name.includes('\\') &&
      !name.includes('\0') && !name.includes(':'),
    `Unsafe ZIP path: ${name}`,
  );
  const parts = name.split('/');
  assert(parts.every((part) => part && part !== '.' && part !== '..'), `Unsafe ZIP path: ${name}`);
  assert(
    isManifest
      ? name === 'manifest.json'
      : name === 'module-catalog.json' || name.startsWith('module/') || name.startsWith('search/'),
    `Unexpected ZIP entry: ${name}`,
  );
  if (!isManifest) {
    assert(
      ALLOWED_EXTENSIONS.has(extname(name).toLowerCase()) || CODE_EXPLORER_JAVA.test(name),
      `Forbidden ZIP entry type: ${name}`,
    );
  }
}

function countModules(node) {
  assert(node && typeof node === 'object', 'Invalid catalog node');
  const children = node.children ?? [];
  assert(Array.isArray(children), 'Invalid catalog children');
  const self = node.kind === 'MODULE' ? 1 : 0;
  return self + children.reduce((count, child) => count + countModules(child), 0);
}

function verifyCodeExplorerFiles(files, catalog) {
  const claimed = new Set();
  function visit(node) {
    if (node.kind === 'MODULE' && node.codeExplorer !== undefined) {
      const route = node.routeId;
      assert(/^[A-Z0-9_-]{1,128}$/.test(route), 'Invalid Code Explorer module routeId');
      const prefix = `module/${route}/code-explorer/`;
      assert(node.codeExplorer === `/${prefix}index.json`, `Invalid Code Explorer catalog path for ${route}`);
      const encoded = files.get(`${prefix}index.json`);
      assert(encoded, `Missing Code Explorer index for ${route}`);
      let index;
      try {
        index = JSON.parse(decode(encoded));
      } catch (error) {
        throw new Error(`Invalid Code Explorer index for ${route}: ${error.message}`);
      }
      assert(index.version === 1 && index.type === 'CODE_EXPLORER'
        && typeof index.id === 'string' && Array.isArray(index.files) && index.files.length > 0,
      `Invalid Code Explorer manifest for ${route}`);
      for (const [key, expected] of Object.entries({
        symbols: 'symbols.json', references: 'references.json', apiMap: 'api-map.json',
      })) {
        assert(index[key] === expected && files.has(prefix + expected),
          `Missing or invalid Code Explorer index asset: ${route}/${key}`);
      }
      for (const entry of index.files) {
        assert(entry && typeof entry.path === 'string'
          && CODE_EXPLORER_JAVA.test(prefix + 'files/' + entry.path),
        `Unsafe Code Explorer source path: ${route}`);
        const relative = prefix + 'files/' + entry.path;
        assert(!claimed.has(relative), `Duplicate Code Explorer source: ${relative}`);
        claimed.add(relative);
        const bytes = files.get(relative);
        assert(bytes && bytes.length === entry.bytes && sha256(bytes) === entry.sha256,
          `Code Explorer source checksum mismatch: ${relative}`);
      }
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(catalog.root);
  for (const name of files.keys()) {
    if (name.endsWith('.java')) {
      assert(claimed.has(name), `Unclaimed Code Explorer Java source: ${name}`);
    }
  }
}

/**
 * Verify the sidecar SHA-256 and complete manifest before returning files.
 * Manifest is intentionally not copied into the Vite static assets.
 */
export function validateArchive(zipBytes, checksumText) {
  const expected = parseChecksum(checksumText);
  const actual = sha256(zipBytes);
  assert(actual === expected, `ZIP SHA-256 mismatch (expected ${expected}, got ${actual})`);

  let decoded;
  try {
    decoded = unzipSync(new Uint8Array(zipBytes));
  } catch (error) {
    throw new Error(`Invalid ZIP archive: ${error.message}`, { cause: error });
  }
  const names = Object.keys(decoded);
  assert(names.length > 2 && names.length <= MAX_FILE_COUNT + 1, 'Invalid ZIP entry count');

  const seen = new Set();
  let dataBytes = 0;
  const files = new Map();
  for (const name of names) {
    validateName(name, name === 'manifest.json');
    const folded = name.toLowerCase();
    assert(!seen.has(folded), `Duplicate ZIP path: ${name}`);
    seen.add(folded);
    const content = decoded[name];
    assert(content.length > 0, `Empty ZIP entry: ${name}`);
    if (name !== 'manifest.json') {
      dataBytes += content.length;
      assert(dataBytes <= MAX_EXTRACTED_BYTES, 'Uncompressed dataset exceeds safety limit');
      files.set(name, content);
    }
  }
  assert(seen.has('manifest.json') && seen.has('module-catalog.json'), 'ZIP missing manifest/catalog');

  let manifest;
  let catalog;
  try {
    manifest = JSON.parse(decode(decoded['manifest.json']));
    catalog = JSON.parse(decode(decoded['module-catalog.json']));
  } catch (error) {
    throw new Error(`Invalid manifest or module catalog JSON: ${error.message}`, { cause: error });
  }
  assert(manifest.schemaVersion === 1 && manifest.producer === 'java-learning', 'Unexpected producer manifest');
  assert(/^[0-9a-f]{40}$/.test(manifest.sourceCommit), 'Invalid manifest sourceCommit');
  assert(typeof manifest.sourceCommitTime === 'string' && Number.isFinite(Date.parse(manifest.sourceCommitTime)), 'Invalid manifest sourceCommitTime');
  assert(manifest.fileCount === files.size, 'Manifest fileCount mismatch');
  assert(manifest.totalBytes === dataBytes, 'Manifest totalBytes mismatch');
  assert(manifest.catalogSha256 === sha256(decoded['module-catalog.json']), 'Catalog SHA-256 mismatch');
  assert(catalog.version === 1 && catalog.root, 'Unexpected module catalog schema');
  assert(manifest.moduleCount === countModules(catalog.root) && manifest.moduleCount > 0, 'Manifest moduleCount mismatch');
  assert(Number.isSafeInteger(manifest.referenceCount) && manifest.referenceCount > 0, 'Invalid manifest referenceCount');
  verifyCodeExplorerFiles(files, catalog);

  return { manifest, files, sha256: actual };
}

async function fetchBytes(url, fetchImpl, maxBytes) {
  const response = await fetchImpl(url, {
    method: 'GET',
    redirect: 'follow',
    cache: 'no-store',
    headers: { 'User-Agent': 'learning-platform-data-consumer', Accept: 'application/octet-stream' },
    signal: AbortSignal.timeout(120_000),
  });
  assert(response.ok, `Download failed: HTTP ${response.status} for ${url}`);
  const contentLength = Number(response.headers.get('content-length') ?? 0);
  assert(contentLength <= maxBytes, `Release asset too large: ${url}`);
  assert(response.body, `Missing download body: ${url}`);
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      assert(total <= maxBytes, `Release asset too large: ${url}`);
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, total);
}

export async function downloadAndValidate({
  fetchImpl = fetch,
  attempts = 3,
  retryDelayMs = 1500,
  releaseUrl = RELEASE,
} = {}) {
  assert(Number.isInteger(attempts) && attempts > 0, 'Invalid retry count');
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const zipBytes = await fetchBytes(`${releaseUrl}/${ZIP_NAME}`, fetchImpl, MAX_DOWNLOAD_BYTES);
      const checksumBytes = await fetchBytes(`${releaseUrl}/${CHECKSUM_NAME}`, fetchImpl, 1024);
      const result = validateArchive(zipBytes, decode(checksumBytes));
      return result;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        console.warn(`Java data download/verification attempt ${attempt} failed: ${error.message}; retrying`);
        await sleep(retryDelayMs);
      }
    }
  }
  throw new Error(`Java data verification failed after ${attempts} attempt(s): ${lastError.message}`, { cause: lastError });
}

/**
 * A producer-triggered build must consume precisely the Release that was
 * verified before dispatch. Ordinary push / manual builds use the latest
 * verified Release without an expectation.
 */
export function assertExpectedRelease(result, environment = process.env) {
  const required = environment.JAVA_DATA_DISPATCH_REQUIRED === 'true';
  const commit = environment.JAVA_DATA_EXPECTED_SOURCE_COMMIT || '';
  const checksum = environment.JAVA_DATA_EXPECTED_SHA256 || '';
  if (required) {
    assert(/^[0-9a-f]{40}$/.test(commit), 'Producer dispatch missing valid source_commit');
    assert(/^[0-9a-f]{64}$/.test(checksum), 'Producer dispatch missing valid data_sha256');
  }
  if (commit) assert(result.manifest.sourceCommit === commit, `Java Release source commit mismatch: expected ${commit}, got ${result.manifest.sourceCommit}`);
  if (checksum) assert(result.sha256 === checksum, `Java Release ZIP checksum mismatch: expected ${checksum}, got ${result.sha256}`);
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

/**
 * Construct a complete replacement directory before touching dist/language/java.
 * Preserve any unrelated files within that directory, then swap with a
 * backup/rollback. Other languages and dist/assets stay untouched.
 */
export async function syncJavaData(dataDirectory, validated) {
  const dataDir = resolve(dataDirectory);
  const parent = dirname(dataDir);
  const name = basename(dataDir);
  assert(dataDir !== parent, 'Refusing to replace a filesystem root');
  const stage = join(parent, `.${name}-data-stage`);
  const backup = join(parent, `.${name}-data-backup`);
  assert(!(await exists(stage)) && !(await exists(backup)), `Previous data sync requires inspection: ${stage} or ${backup}`);
  if (await exists(dataDir)) {
    assert((await stat(dataDir)).isDirectory(), `Not a data directory: ${dataDir}`);
  }

  await mkdir(parent, { recursive: true });
  await mkdir(stage);
  let oldMoved = false;
  let installed = false;
  try {
    if (await exists(dataDir)) {
      for (const item of await readdir(dataDir, { withFileTypes: true })) {
        if (!MANAGED_NAMES.has(item.name)) {
          await cp(join(dataDir, item.name), join(stage, item.name), { recursive: true, errorOnExist: true });
        }
      }
    }
    for (const [name, content] of validated.files) {
      // Temporary: ignore search indexes even in existing published Releases.
      if (name.startsWith('search/knowledge-search.')) continue;
      const target = join(stage, ...name.split('/'));
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content, { flag: 'wx' });
    }

    if (await exists(dataDir)) {
      await rename(dataDir, backup);
      oldMoved = true;
    }
    try {
      await rename(stage, dataDir);
      installed = true;
    } catch (error) {
      if (oldMoved) await rename(backup, dataDir);
      oldMoved = false;
      throw error;
    }
    // If cleanup fails, retain the backup rather than silently losing data.
    if (oldMoved) await rm(backup, { recursive: true });
    return { dataDir, ...validated.manifest };
  } finally {
    if (!installed && (await exists(stage))) await rm(stage, { recursive: true });
  }
}

function parseArgs(args) {
  const usage = 'Usage: node scripts/sync-java-data.mjs --check | --sync [--data-dir PATH]';
  let mode = null;
  let dataDir = resolve('dist/language/java');
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--check' || args[i] === '--sync') {
      assert(!mode, usage);
      mode = args[i];
    } else if (args[i] === '--data-dir') {
      assert(i + 1 < args.length, usage);
      dataDir = resolve(args[++i]);
    } else {
      throw new Error(`${usage}; unknown argument: ${args[i]}`);
    }
  }
  assert(mode, usage);
  return { mode, dataDir };
}

async function main() {
  const { mode, dataDir } = parseArgs(process.argv.slice(2));
  const result = await downloadAndValidate();
  assertExpectedRelease(result);
  console.log(`Verified Java data ${result.manifest.sourceCommit}: ${result.files.size} files, SHA-256 ${result.sha256}`);
  if (mode === '--sync') {
    await syncJavaData(dataDir, result);
    console.log(`Updated managed Java data under ${dataDir}`);
  } else {
    console.log('Check-only mode: dist/language/java was not modified');
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Java data consumer failed: ${error.message}`);
    process.exitCode = 1;
  });
}
