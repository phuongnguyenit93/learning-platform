import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildModuleNavigation } from '../build-module-navigation.mjs';

test('navigation tree is small and module metadata is split without changing Java data', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'learning-nav-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const java = join(root, 'language', 'java');
  await mkdir(java, { recursive: true });
  const module = {
    id: 'example', name: 'example', kind: 'MODULE', routeId: 'EXAMPLE', path: '/module/example',
    description: 'Example', moduleType: 'SERVLET', currentStep: '5',
    knowledge: { vi: '/module/EXAMPLE/knowledge/vi/index.json' },
    roadmap: { vi: '/module/EXAMPLE/roadmap/vi/roadmap.yml' },
    sourceFingerprint: 'd'.repeat(64), children: [],
  };
  const source = JSON.stringify({ version: 1, root: { id: 'root', name: 'root', kind: 'GROUP', children: [module] } });
  await writeFile(join(java, 'module-catalog.json'), source);
  const { navigation, details } = await buildModuleNavigation(java, root);
  assert.equal(navigation.root.children[0].routeId, 'EXAMPLE');
  assert.equal(navigation.root.children[0].currentStep, '5');
  assert.equal(navigation.root.children[0].hasContent, true);
  assert.equal(navigation.root.children[0].knowledge, undefined, 'content path is loaded only when module is selected');
  assert.equal(navigation.root.children[0].sourceFingerprint, undefined);
  assert.equal(details.get('EXAMPLE').sourceFingerprint, 'd'.repeat(64));
  assert.equal(details.get('EXAMPLE').currentStep, '5');
  assert.equal(JSON.parse(await readFile(join(root, 'module-details', 'EXAMPLE.json'), 'utf8')).knowledge.vi,
    '/module/EXAMPLE/knowledge/vi/index.json');
  assert.equal(await readFile(join(java, 'module-catalog.json'), 'utf8'), source);
});
