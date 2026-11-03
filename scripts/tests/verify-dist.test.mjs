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
      vi: { EXAMPLE: { knowledge: 1, quiz: 0, interview: 0, casestudy: 0 } },
      en: { EXAMPLE: { knowledge: 0, quiz: 0, interview: 0, casestudy: 0 } },
    },
  }));
  await write('language/java/module/EXAMPLE/knowledge/vi/index.json', '{}');
  return { root, write };
}

test('dist verifier accepts Java files and compiled frontend while ignoring legacy API metadata', async (t) => {
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

test('dist verifier checks Case Study Java source checksum and rejects tampering', async (t) => {
  const { root, write } = await fixture(t);
  const source = 'package demo;\npublic class Example {}\n';
  const sha = (await import('node:crypto')).createHash('sha256').update(source).digest('hex');
  await write('language/java/module-catalog.json', JSON.stringify({
    version: 1, root: { kind: 'GROUP', children: [{
      kind: 'MODULE', routeId: 'EXAMPLE',
      knowledge: { vi: '/module/EXAMPLE/knowledge/vi/index.json' },
      api: { vi: '/module/EXAMPLE/api/vi' },
      caseStudyExplorer: '/module/EXAMPLE/code-explorer/casestudy/index.json', children: [],
    }] },
  }));
  const base = 'language/java/module/EXAMPLE/code-explorer/casestudy';
  await write(base + '/index.json', JSON.stringify({
    version: 1, type: 'CASE_STUDY_EXPLORER', complete: true,
    cases: [{ groupID: 1, caseIndex: 1, path: 'groups/1/cases/1/index.json', files: 1 }],
  }));
  const scope = base + '/groups/1/cases/1';
  await write(scope + '/index.json', JSON.stringify({
    version: 1, type: 'CODE_EXPLORER', id: 'casestudy-g1-c1',
    files: [{ path: 'demo/Example.java', bytes: Buffer.byteLength(source), sha256: sha }],
    symbols: 'symbols.json', references: 'references.json',
  }));
  for (const file of ['symbols.json', 'references.json']) {
    await write(scope + '/' + file, '{"version":1}');
  }
  await write(scope + '/files/demo/Example.java', source);
  await verifyDist(root);
  await write(scope + '/files/demo/Example.java', source + '// tampered');
  await assert.rejects(verifyDist(root), /STEP8_EXPLORER Java checksum/);
});
