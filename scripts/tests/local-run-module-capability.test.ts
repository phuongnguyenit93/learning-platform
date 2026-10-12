import assert from 'node:assert/strict';
import { test } from 'node:test';
import { toLearningModule } from '../../src/data/moduleCatalog';
import type { ModuleCatalogNode, ModuleStats } from '../../src/types/learning';

const stats = { knowledge: 0, quiz: 0, interview: 0, api: 0 } as ModuleStats;

test('only runnable modules expose Local Run without a client feature toggle', () => {
  for (const kind of ['SERVLET', 'REACTIVE', 'LIBRARY', 'PLATFORM']) {
    const node = {
      kind: 'MODULE', routeId: 'EXAMPLE', serviceName: 'EXAMPLE',
      name: 'example', moduleType: kind, path: '/module/example', children: [],
    } as unknown as ModuleCatalogNode;
    const module = toLearningModule(node, stats);
    assert.equal(module.capabilities.execution, kind === 'SERVLET' || kind === 'REACTIVE', kind);
  }
});
