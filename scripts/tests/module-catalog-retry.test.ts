import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadModuleCatalog, loadModuleDetails } from '../../src/data/moduleCatalog';

const catalog = { version: 1, root: { kind: 'GROUP', children: [] } };

test('transient HTTP 500 retries the small navigation index, not the entire Java catalog', async (t) => {
  let count = 0;
  t.mock.method(globalThis, 'fetch', async (url: RequestInfo | URL) => {
    assert.equal(url, '/module-navigation.json');
    count++;
    return count === 1
      ? new Response('Internal server error', { status: 500 })
      : new Response(JSON.stringify(catalog), { status: 200 });
  });
  assert.deepEqual(await loadModuleCatalog(), catalog);
  assert.equal(count, 2);
});

test('sidebar navigation loads independently of current-module metadata', async (t) => {
  const paths: string[] = [];
  const tree = { version: 1, root: { kind: 'GROUP', children: [
    { kind: 'MODULE', routeId: 'PROGRESSIVE_CASE', name: 'example', children: [], hasContent: true },
  ] } };
  t.mock.method(globalThis, 'fetch', async (url: RequestInfo | URL) => {
    paths.push(String(url));
    if (url === '/module-navigation.json') return new Response(JSON.stringify(tree), { status: 200 });
    if (url === '/module-details/PROGRESSIVE_CASE.json') {
      return new Response(JSON.stringify({ kind: 'MODULE', routeId: 'PROGRESSIVE_CASE', name: 'example',
        path: '/module/example', knowledge: { vi: '/module/EXAMPLE/knowledge/vi/index.json' } }), { status: 200 });
    }
    throw new Error(`Unexpected request ${url}`);
  });
  const sidebar = await loadModuleCatalog();
  assert.deepEqual(sidebar, tree);
  assert.deepEqual(paths, ['/module-navigation.json'], 'module details must not block initial navigation');
  const detail = await loadModuleDetails('PROGRESSIVE_CASE');
  assert.equal(detail.knowledge?.vi, '/module/EXAMPLE/knowledge/vi/index.json');
  await loadModuleDetails('PROGRESSIVE_CASE');
  assert.deepEqual(paths, ['/module-navigation.json', '/module-details/PROGRESSIVE_CASE.json'],
    'details are lazily fetched once per selected module');
});

test('404 fails fast without unnecessary retries or additional traffic', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    calls++;
    return new Response('Not Found', { status: 404 });
  });
  await assert.rejects(loadModuleCatalog(), /404/);
  assert.equal(calls, 1);
});
