import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { zipSync } from 'fflate';
import { downloadAndValidate, parseChecksum, syncPublicData, validateArchive } from '../sync-java-data.mjs';

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

test('stages new data and preserves unrelated public assets', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'learning-platform-consumer-'));
  t.after(async () => {
    const { rm } = await import('node:fs/promises');
    await rm(root, { recursive: true, force: true });
  });
  const publicDir = join(root, 'public');
  await mkdir(join(publicDir, 'module', 'OLD'), { recursive: true });
  await writeFile(join(publicDir, 'module', 'OLD', 'stale.md'), 'stale');
  await writeFile(join(publicDir, 'module-catalog.json'), '{"old":true}');
  await writeFile(join(publicDir, 'favicon.svg'), '<svg></svg>');
  const { zip, checksum } = fixture();
  const validated = validateArchive(zip, checksum);
  await syncPublicData(publicDir, validated);
  assert.equal(await readFile(join(publicDir, 'favicon.svg'), 'utf8'), '<svg></svg>');
  assert.equal(await readFile(join(publicDir, 'module', 'DEMO', 'overview', 'vi.md'), 'utf8'), '# Demo\n');
  assert.equal(JSON.parse(await readFile(join(publicDir, 'module-catalog.json'), 'utf8')).version, 1);
  assert.deepEqual(await readdir(join(publicDir, 'module')), ['DEMO']);
  assert.equal((await readdir(root)).length, 1, 'staging and backup directories removed');
});

test('a failed validation cannot change the existing public directory', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'learning-platform-consumer-'));
  t.after(async () => {
    const { rm } = await import('node:fs/promises');
    await rm(root, { recursive: true, force: true });
  });
  const publicDir = join(root, 'public');
  await mkdir(publicDir);
  await writeFile(join(publicDir, 'module-catalog.json'), '{"original":true}');
  const { zip } = fixture();
  assert.throws(
    () => validateArchive(zip, `${'0'.repeat(64)}  java-learning-data.zip\n`),
    /SHA-256 mismatch/,
  );
  assert.equal(await readFile(join(publicDir, 'module-catalog.json'), 'utf8'), '{"original":true}');
});
