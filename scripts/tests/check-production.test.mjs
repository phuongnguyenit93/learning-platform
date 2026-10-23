import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { productionAssetPaths, verifyProductionOnce } from '../check-production.mjs';

const moduleId = 'OBJECT_ORIENTED_PROGRAMMING';
const viLesson = `/language/java/module/${moduleId}/knowledge/vi/content/OOPBasic/sections/oop-basic-001.md`;
const enLesson = `/language/java/module/${moduleId}/knowledge/en/content/Introduction/sections/oop-1-1.md`;

const knowledgeIndex = (language, lesson) => JSON.stringify({
  version: 1,
  moduleId,
  language,
  tree: [{
    kind: 'FOLDER',
    children: [{
      kind: 'CATEGORY',
      sections: [{ content: lesson.replace('/language/java', '') }],
    }],
  }],
});

async function fixture(t) {
  const dist = await mkdtemp(join(tmpdir(), 'lp-prod-verify-'));
  t.after(() => rm(dist, { recursive: true, force: true }));
  const catalog = {
    version: 1,
    root: {
      kind: 'GROUP',
      children: [{
        kind: 'MODULE',
        knowledge: { vi: `/module/${moduleId}/knowledge/vi/index.json` },
        children: [],
      }],
    },
  };
  const data = new Map([
    ['/', '<!doctype html><html></html>'],
    ['/assets/index-abc123.js', 'console.log("latest frontend")'],
    ['/assets/index-abc123.css', 'body { color: black; }'],
    ['/language/java/module-catalog.json', JSON.stringify(catalog)],
    ['/module-navigation.json', JSON.stringify(catalog)],
    [`/module-details/${moduleId}.json`, JSON.stringify({ kind: 'MODULE', routeId: moduleId })],
    ['/module-content-counts.json', JSON.stringify({ version: 1, locales: { vi: {}, en: {} } })],
    [`/language/java/module/${moduleId}/knowledge/vi/index.json`, knowledgeIndex('vi', viLesson)],
    [`/language/java/module/${moduleId}/knowledge/en/index.json`, knowledgeIndex('en', enLesson)],
    [viLesson, '**Lập trình hướng đối tượng** bản mới'],
    [enLesson, '**Object-oriented programming** new lesson'],
  ]);
  async function write(relativePath, content) {
    const dest = join(dist, relativePath.substring(1));
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, content);
  }
  for (const [path, content] of data) {
    if (path !== '/') await write(path, content);
  }
  const mockFetch = async (url) => new Response(data.get(url.pathname) ?? '', {
    status: data.has(url.pathname) ? 200 : 404,
  });
  return { dist, data, mockFetch, write };
}

test('production gate selects real VI/EN OOP lessons from Knowledge indices and checks exact bytes', async (t) => {
  const { dist, data, mockFetch } = await fixture(t);
  assert.equal(productionAssetPaths.length, 6);
  assert.ok(![...data.keys()].some((path) => path.endsWith('oop-what.md')));
  const visited = [];
  await verifyProductionOnce('https://site.example', dist, async (url) => {
    visited.push(url.pathname);
    return mockFetch(url);
  });
  for (const path of [viLesson, enLesson]) {
    assert.ok(visited.includes(path), `Expected to verify ${path}`);
  }
});

test('production gate detects stale VI or EN Knowledge even when indices and frontend match', async (t) => {
  const { dist, data } = await fixture(t);
  for (const lesson of [viLesson, enLesson]) {
    const staleFetch = async (url) => new Response(
      url.pathname === lesson ? 'old OOP lesson' : data.get(url.pathname) ?? '',
      { status: data.has(url.pathname) ? 200 : 404 },
    );
    await assert.rejects(
      verifyProductionOnce('https://site.example', dist, staleFetch),
      /Production asset mismatch.*oop-(?:basic-001|1-1)\.md/,
    );
  }
});

test('production gate fails when a referenced lesson is missing in the built artifact', async (t) => {
  const { dist, mockFetch } = await fixture(t);
  await unlink(join(dist, viLesson.substring(1)));
  await assert.rejects(
    verifyProductionOnce('https://site.example', dist, mockFetch),
    /ENOENT.*oop-basic-001\.md/,
  );
});

test('production gate rejects an index with no lesson or an unsafe reference', async (t) => {
  const { dist, mockFetch, write } = await fixture(t);
  const indexPath = `/language/java/module/${moduleId}/knowledge/vi/index.json`;
  const invalidIndex = JSON.parse(knowledgeIndex('vi', viLesson));
  invalidIndex.tree[0].children[0].sections[0].content = '/module/OTHER/knowledge/vi/content/a.md';
  await write(indexPath, JSON.stringify(invalidIndex));
  await assert.rejects(
    verifyProductionOnce('https://site.example', dist, mockFetch),
    /Invalid OOP vi Knowledge lesson path/,
  );
  invalidIndex.tree[0].children[0].sections[0].content =
    `/module/${moduleId}/knowledge/vi/content/../secrets.md`;
  await write(indexPath, JSON.stringify(invalidIndex));
  await assert.rejects(
    verifyProductionOnce('https://site.example', dist, mockFetch),
    /Invalid OOP vi Knowledge lesson path/,
  );
  await write(indexPath, JSON.stringify({ version: 1, moduleId, language: 'vi', tree: [] }));
  await assert.rejects(
    verifyProductionOnce('https://site.example', dist, mockFetch),
    /OOP Knowledge index has no lessons for vi/,
  );
});
