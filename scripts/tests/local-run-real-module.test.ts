import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isCountedRealModule, projectCountedRealModules, type ModuleContentCounts } from '../../src/data/realModuleFilter';
import type { ModuleCatalogNode } from '../../src/types/learning';

function moduleNode(id: string, overrides: Partial<ModuleCatalogNode> = {}): ModuleCatalogNode {
  return { id, name: id, kind: 'MODULE', routeId: id, children: [], ...overrides } as ModuleCatalogNode;
}
function group(id: string, children: ModuleCatalogNode[]): ModuleCatalogNode {
  return { id, name: id, kind: 'GROUP', children } as ModuleCatalogNode;
}
const empty: ModuleContentCounts = { knowledge: {}, quiz: {}, interview: {}, api: {} };

test('Real module requires a positive counted item, not metadata, hasContent or roadmap', () => {
  const falsePositive = moduleNode('EMPTY', {
    hasContent: true, roadmap: { vi: '/module/empty/roadmap.json' },
    knowledge: { vi: '/module/empty/knowledge.json' },
  } as Partial<ModuleCatalogNode>);
  assert.equal(isCountedRealModule(falsePositive, empty), false);
  for (const key of ['knowledge', 'quiz', 'interview', 'api'] as const) {
    assert.equal(isCountedRealModule(falsePositive, { ...empty, [key]: { EMPTY: 1 } }), true, key);
    assert.equal(isCountedRealModule(falsePositive, { ...empty, [key]: { EMPTY: 0 } }), false, key);
  }
  assert.equal(isCountedRealModule(group('GROUP', [falsePositive]), { ...empty, knowledge: { GROUP: 9 } }), false);
});

test('Real module projection keeps original catalog order and only necessary ancestors', () => {
  const data = [group('ROOT', [moduleNode('EMPTY', { hasContent: true }),
    group('SUB', [moduleNode('REAL')]), moduleNode('LATER')]), group('EMPTY_GROUP', [moduleNode('ZERO')])];
  const projected = projectCountedRealModules(data, { ...empty, interview: { REAL: 3, LATER: 1 } });
  assert.deepEqual(projected.map((v) => v.id), ['ROOT']);
  assert.deepEqual(projected[0].children.map((v) => v.id), ['SUB', 'LATER']);
  assert.deepEqual(projected[0].children[0].children.map((v) => v.id), ['REAL']);
  assert.equal(data[0].children.length, 3, 'projection must not mutate canonical navigation');
});

test('Counts of the selected language determine the qualified Real module set', () => {
  const nodes = [moduleNode('VI_ONLY'), moduleNode('EN_ONLY')];
  const vi = projectCountedRealModules(nodes, { ...empty, quiz: { VI_ONLY: 1 } });
  const en = projectCountedRealModules(nodes, { ...empty, quiz: { EN_ONLY: 2 } });
  assert.deepEqual(vi.map((node) => node.routeId), ['VI_ONLY']);
  assert.deepEqual(en.map((node) => node.routeId), ['EN_ONLY']);
});
