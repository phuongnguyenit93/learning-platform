import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadModuleCatalog } from '../../src/data/moduleCatalog';

const catalog = { version: 1, root: { kind: 'GROUP', children: [] } };

test('transient HTTP 500 retries then loads the static Java catalog', async (t) => {
  let count = 0;
  t.mock.method(globalThis, 'fetch', async (url: RequestInfo | URL) => {
    assert.equal(url, '/language/java/module-catalog.json');
    count++;
    return count === 1
      ? new Response('Internal server error', { status: 500 })
      : new Response(JSON.stringify(catalog), { status: 200 });
  });
  assert.deepEqual(await loadModuleCatalog(), catalog);
  assert.equal(count, 2);
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
