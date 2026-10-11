import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { transformWithEsbuild } from 'vite';

// Compile the production TypeScript helper for Node without requiring a new
// test-runner dependency or relying on Node's native TS support/version.
const source = await readFile(new URL('../../src/data/javaAsset.ts', import.meta.url), 'utf8');
const compiled = await transformWithEsbuild(source, 'javaAsset.ts', { loader: 'ts', format: 'esm' });
const { javaAssetUrl, fetchJavaAsset } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.code).toString('base64')}`
);

test('Java catalog and producer-relative metadata paths receive language/java prefix', () => {
  assert.equal(javaAssetUrl('/module-catalog.json'), '/language/java/module-catalog.json');
  assert.equal(
    javaAssetUrl('/module/DEMO/knowledge/vi/index.json'),
    '/language/java/module/DEMO/knowledge/vi/index.json',
  );
  assert.equal(
    javaAssetUrl('/search/knowledge-search.en.json'),
    '/language/java/search/knowledge-search.en.json',
  );
});

test('existing prefixed paths and unrelated API / external URLs are unchanged', () => {
  assert.equal(javaAssetUrl('/language/java/module/DEMO/index.json'), '/language/java/module/DEMO/index.json');
  assert.equal(javaAssetUrl('/language/golang/module-catalog.json'), '/language/golang/module-catalog.json');
  assert.equal(javaAssetUrl('/api/local-run/status'), '/api/local-run/status');
  assert.equal(javaAssetUrl('https://example.org/path'), 'https://example.org/path');
});

test('Java fetch wrapper calls the correct HTTP path with no-cache', async () => {
  const previousFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (...args) => {
    calls.push(args);
    return new Response('{}');
  };
  try {
    const response = await fetchJavaAsset('/module/DEMO/quiz/vi/question.yml');
    assert.equal(response.status, 200);
    assert.deepEqual(calls, [[
      '/language/java/module/DEMO/quiz/vi/question.yml',
      { cache: 'no-cache' },
    ]]);
  } finally {
    globalThis.fetch = previousFetch;
  }
});
