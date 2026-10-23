import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkPreview } from '../check-preview.mjs';

function fakeFetch(pathOverrides = {}) {
  const catalog = {
    version: 1,
    root: {
      kind: 'GROUP',
      children: [{ kind: 'MODULE', knowledge: { vi: '/module/EXAMPLE/knowledge/vi/index.json' }, children: [] }],
    },
  };
  const routes = {
    '/': '<!doctype html><html><body>ok</body></html>',
    '/language/java/module-catalog.json': JSON.stringify(catalog),
    '/language/java/module/EXAMPLE/knowledge/vi/index.json': '{"version":1}',
    ...pathOverrides,
  };
  return async (url) => {
    const body = routes[url.pathname];
    return body === undefined ? new Response('Not found', { status: 404 }) : new Response(body);
  };
}

test('preview smoke accepts valid HTML, catalog and Knowledge paths without search', async () => {
  await checkPreview('https://example.workers.dev/', fakeFetch());
});

test('preview smoke rejects SPA fallback returned instead of JSON', async () => {
  await assert.rejects(
    checkPreview('https://example.workers.dev/', fakeFetch({
      '/language/java/module/EXAMPLE/knowledge/vi/index.json': '<!doctype html><html></html>',
    })),
  );
});
