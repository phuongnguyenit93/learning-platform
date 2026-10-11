import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { zipSync } from 'fflate';
import { assertExpectedRelease, downloadAndValidate, parseChecksum, syncJavaData, validateArchive } from '../sync-java-data.mjs';

const utf8 = (text) => new TextEncoder().encode(text);
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

function fixture({ extraEntries = {}, overrideManifest = {} } = {}) {
  const catalog = utf8(JSON.stringify({
    version: 1,
    root: {
      kind: 'GROUP', children: [{ kind: 'MODULE', routeId: 'DEMO', children: [] }],
    },
  }));
  const dataFiles = {
    'module-catalog.json': catalog,
    'module/DEMO/overview/vi.md': utf8('# Demo\n'),
    'search/knowledge-search.vi.json': utf8('{"version":1,"documents":[]}'),
    'search/knowledge-search.en.json': utf8('{"version":1,"documents":[]}'),
    ...extraEntries,
  };
  const totalBytes = Object.values(dataFiles).reduce((n, bytes) => n + bytes.length, 0);
  const manifest = {
    schemaVersion: 1,
    producer: 'java-learning',
    sourceCommit: 'a'.repeat(40),
    sourceCommitTime: '2026-10-11T00:00:00Z',
    fileCount: Object.keys(dataFiles).length,
    totalBytes,
    catalogSha256: sha256(catalog),
    moduleCount: 1,
    referenceCount: 1,
    ...overrideManifest,
  };
  const zip = zipSync({ 'manifest.json': utf8(JSON.stringify(manifest)), ...dataFiles });
  return { zip, checksum: `${sha256(zip)}  java-learning-data.zip\n`, manifest };
}

test('accepts the intended static-only archive and checks full manifest', () => {
  const { zip, checksum, manifest } = fixture({ extraEntries: {
    'module/DEMO/roadmap/vi/roadmap.yaml': utf8('roadmap: []\n'),
  } });
  const result = validateArchive(zip, checksum);
  assert.equal(result.manifest.sourceCommit, manifest.sourceCommit);
  assert.equal(result.files.size, manifest.fileCount);
  assert.equal(result.files.has('manifest.json'), false);
  assert.equal(result.files.has('module/DEMO/roadmap/vi/roadmap.yaml'), true);
});

test('requires the expected checksum format and rejects tampered ZIP', () => {
  const { zip, checksum } = fixture();
  assert.equal(parseChecksum(checksum), sha256(zip));
  assert.throws(() => parseChecksum('garbage'), /Invalid .*sha256 format/);
  assert.throws(() => validateArchive(zip, `${'0'.repeat(64)}  java-learning-data.zip\n`), /SHA-256 mismatch/);
});

test('rejects dangerous paths, source code, executables and unexpected roots', () => {
  for (const path of ['../escape.md', '/escape.md', 'module/DEMO/../../../escape.md', 'module/DEMO/Example.java', 'module/DEMO/example.jar', 'module/DEMO/LICENSE', 'gradlew', 'src/main/resources/example.json']) {
    const { zip, checksum } = fixture({ extraEntries: { [path]: utf8('payload') } });
    assert.throws(() => validateArchive(zip, checksum), /Unsafe ZIP path|Unexpected ZIP entry|Forbidden ZIP entry type/, path);
  }
});

test('rejects invalid or incompatible manifest', () => {
  for (const override of [
    { sourceCommit: 'short' },
    { producer: 'unknown-repo' },
    { schemaVersion: 2 },
    { fileCount: 123 },
    { totalBytes: 1 },
    { moduleCount: 9 },
    { catalogSha256: '0'.repeat(64) },
  ]) {
    const { zip, checksum } = fixture({ overrideManifest: override });
    assert.throws(() => validateArchive(zip, checksum), /manifest|Manifest|Catalog SHA-256|sourceCommit/);
  }
});

test('retries mismatched download pairs and accepts the next consistent pair', async () => {
  const { zip, checksum } = fixture();
  const bad = `${'0'.repeat(64)}  java-learning-data.zip\n`;
  let calls = 0;
  const fakeFetch = async (url) => {
    calls++;
    return new Response(url.endsWith('.sha256') && calls === 2 ? bad : url.endsWith('.sha256') ? checksum : zip);
  };
  const result = await downloadAndValidate({ fetchImpl: fakeFetch, attempts: 2, retryDelayMs: 0 });
  assert.equal(result.manifest.sourceCommit, 'a'.repeat(40));
  assert.equal(calls, 4);
});

test('fails closed after retries if checksum remains invalid', async () => {
  const { zip } = fixture();
  const fakeFetch = async (url) => new Response(url.endsWith('.sha256') ? 'corrupt' : zip);
  await assert.rejects(
    downloadAndValidate({ fetchImpl: fakeFetch, attempts: 2, retryDelayMs: 0 }),
    /verification failed after 2 attempt/,
  );
});

test('repository dispatch enforces the exact producer commit and ZIP checksum', () => {
  const { zip, checksum } = fixture();
  const result = validateArchive(zip, checksum);
  const expected = {
    JAVA_DATA_DISPATCH_REQUIRED: 'true',
    JAVA_DATA_EXPECTED_SOURCE_COMMIT: result.manifest.sourceCommit,
    JAVA_DATA_EXPECTED_SHA256: result.sha256,
  };
  assert.doesNotThrow(() => assertExpectedRelease(result, expected));
  assert.throws(() => assertExpectedRelease(result, { ...expected, JAVA_DATA_EXPECTED_SOURCE_COMMIT: 'b'.repeat(40) }), /source commit mismatch/);
  assert.throws(() => assertExpectedRelease(result, { ...expected, JAVA_DATA_EXPECTED_SHA256: 'b'.repeat(64) }), /ZIP checksum mismatch/);
  assert.throws(() => assertExpectedRelease(result, { ...expected, JAVA_DATA_EXPECTED_SHA256: '' }), /missing valid data_sha256/);
  assert.throws(() => assertExpectedRelease(result, { JAVA_DATA_DISPATCH_REQUIRED: 'true' }), /missing valid source_commit/);
  assert.doesNotThrow(() => assertExpectedRelease(result, {}), 'regular builds may consume latest Java Release');
});

test('stages Java data and preserves unrelated files and sibling language directories', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'learning-platform-consumer-'));
  t.after(async () => {
    const { rm } = await import('node:fs/promises');
    await rm(root, { recursive: true, force: true });
  });
  const dataDir = join(root, 'dist', 'language', 'java');
  const siblingDir = join(root, 'dist', 'language', 'golang');
  const buildAsset = join(root, 'dist', 'assets', 'app.js');
  await mkdir(join(dataDir, 'module', 'OLD'), { recursive: true });
  await mkdir(siblingDir);
  await mkdir(join(root, 'dist', 'assets'), { recursive: true });
  await writeFile(join(dataDir, 'module', 'OLD', 'stale.md'), 'stale');
  await writeFile(join(dataDir, 'module-catalog.json'), '{"old":true}');
  await writeFile(join(dataDir, 'notes.md'), '# Separate notes');
  await writeFile(join(siblingDir, 'keep.md'), '# Other language');
  await writeFile(buildAsset, 'console.log("keep")');
  const { zip, checksum } = fixture();
  const validated = validateArchive(zip, checksum);
  await syncJavaData(dataDir, validated);
  assert.equal(await readFile(join(dataDir, 'notes.md'), 'utf8'), '# Separate notes');
  assert.equal(await readFile(join(siblingDir, 'keep.md'), 'utf8'), '# Other language');
  assert.equal(await readFile(buildAsset, 'utf8'), 'console.log("keep")');
  assert.equal(await readFile(join(dataDir, 'module', 'DEMO', 'overview', 'vi.md'), 'utf8'), '# Demo\n');
  assert.equal(JSON.parse(await readFile(join(dataDir, 'module-catalog.json'), 'utf8')).version, 1);
  assert.deepEqual(await readdir(join(dataDir, 'module')), ['DEMO']);
  assert.deepEqual((await readdir(join(root, 'dist', 'language'))).sort(), ['golang', 'java'], 'staging and backup directories removed');
});

test('a failed validation cannot change the existing Java data directory', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'learning-platform-consumer-'));
  t.after(async () => {
    const { rm } = await import('node:fs/promises');
    await rm(root, { recursive: true, force: true });
  });
  const dataDir = join(root, 'dist', 'language', 'java');
  await mkdir(dataDir, { recursive: true });
  await writeFile(join(dataDir, 'module-catalog.json'), '{"original":true}');
  const { zip } = fixture();
  assert.throws(
    () => validateArchive(zip, `${'0'.repeat(64)}  java-learning-data.zip\n`),
    /SHA-256 mismatch/,
  );
  assert.equal(await readFile(join(dataDir, 'module-catalog.json'), 'utf8'), '{"original":true}');
});
