import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { productionAssetPaths, verifyProductionOnce } from '../check-production.mjs';

test('production gate checks exact bytes for catalog, search and OOP content', async (t) => {
  const dist = await mkdtemp(join(tmpdir(), 'lp-prod-verify-'));
  t.after(() => rm(dist, { recursive: true, force: true }));
  const catalog = {
    version: 1,
    root: { kind: 'GROUP', children: [
      { kind: 'MODULE', knowledge: { en: '/module/OBJECT_ORIENTED_PROGRAMMING/knowledge/en/index.json' }, children: [] },
    ] },
  };
  const data = new Map([
    ['/', '<!doctype html><html></html>'],
    ['/assets/index-abc123.js', 'console.log("latest frontend")'],
    ['/assets/index-abc123.css', 'body { color: black; }'],
    ['/language/java/module-catalog.json', JSON.stringify(catalog)],
    ['/module-content-counts.json', JSON.stringify({ version: 1, locales: { vi: {}, en: {} } })],
    ['/language/java/search/knowledge-search.vi.json', '{"version":1,"documents":[]}'],
    ['/language/java/search/knowledge-search.en.json', '{"version":1,"documents":[]}'],
    ['/language/java/module/OBJECT_ORIENTED_PROGRAMMING/knowledge/en/index.json', '{"version":1}'],
    [productionAssetPaths[4], '**Lập trình hướng đối tượng** bản mới'],
    [productionAssetPaths[5], '**Object-oriented programming** new lesson'],
  ]);
  for (const path of [...productionAssetPaths, '/assets/index-abc123.js', '/assets/index-abc123.css']) {
    const dest = join(dist, path.substring(1));
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, data.get(path));
  }
  const mockFetch = async (url) => new Response(data.get(url.pathname) ?? '', {
    status: data.has(url.pathname) ? 200 : 404,
  });
  await verifyProductionOnce('https://site.example', dist, mockFetch);

  const staleFetch = async (url) => new Response(
    url.pathname === productionAssetPaths[5] ? 'old OOP lesson' : data.get(url.pathname) ?? '',
    { status: data.has(url.pathname) ? 200 : 404 },
  );
  await assert.rejects(
    verifyProductionOnce('https://site.example', dist, staleFetch),
    /Production asset mismatch.*oop-what.md/,
  );
});
