import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { verifyDist } from '../verify-dist.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'learning-platform-dist-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  async function write(relative, contents) {
    const target = join(root, relative);
    await mkdir(join(target, '..'), { recursive: true });
    await writeFile(target, contents);
  }
  await write('index.html', '<!doctype html><html></html>');
  await write('assets/index.js', 'console.log("app")');
  await write('assets/index.css', 'body{}');
  await write('language/java/module-catalog.json', JSON.stringify({
    version: 1, root: {
      kind: 'GROUP',
      children: [{
        kind: 'MODULE', routeId: 'EXAMPLE',
        knowledge: { vi: '/module/EXAMPLE/knowledge/vi/index.json' },
        api: { vi: '/module/EXAMPLE/api/vi' },
        children: [],
      }],
    },
  }));
  await write('module-navigation.json', JSON.stringify({
    version: 1, root: { kind: 'GROUP', children: [
      { kind: 'MODULE', routeId: 'EXAMPLE', name: 'Example', hasContent: true, children: [] },
    ] },
  }));
  await write('module-details/EXAMPLE.json', JSON.stringify({ kind: 'MODULE', routeId: 'EXAMPLE' }));
  await write('module-content-counts.json', JSON.stringify({
    version: 1, locales: {
      vi: { EXAMPLE: { knowledge: 1, quiz: 0, interview: 0, apiDocs: 0 } },
      en: { EXAMPLE: { knowledge: 0, quiz: 0, interview: 0, apiDocs: 0 } },
    },
  }));
  await write('language/java/module/EXAMPLE/knowledge/vi/index.json', '{}');
  await write('language/java/module/EXAMPLE/api/vi/api-descriptions.yml', 'api: {}');
  for (const lang of ['vi', 'en']) {
    await write(`language/java/search/knowledge-search.${lang}.json`, '{"version":1,"documents":[]}');
  }
  return { root, write };
}

test('dist verifier accepts Java files, API metadata directories, and compiled frontend', async (t) => {
  const { root } = await fixture(t);
  await verifyDist(root);
});

test('dist verifier rejects missing Java assets even when frontend is built', async (t) => {
  const { root } = await fixture(t);
  await rm(join(root, 'language', 'java', 'module', 'EXAMPLE', 'knowledge', 'vi', 'index.json'));
  await assert.rejects(verifyDist(root), /Missing Java catalog asset/);
});

test('dist verifier rejects accidental legacy unprefixed Java catalog', async (t) => {
  const { root, write } = await fixture(t);
  await write('module-catalog.json', '{}');
  await assert.rejects(verifyDist(root), /Unexpected unprefixed Java catalog/);
});
