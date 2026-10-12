import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const config = JSON.parse(readFileSync(new URL('../../wrangler.jsonc', import.meta.url), 'utf8'));

test('production enables Local Run while Preview remains disabled with isolated bindings', () => {
  assert.equal(config.name, 'learning-platform');
  assert.equal(config.main, './worker/index.ts');
  assert.equal(config.assets.binding, 'ASSETS');
  assert.deepEqual(config.assets.run_worker_first, ['/api/*']);
  assert.equal(config.vars.LOCAL_RUN_ENABLED, 'true');
  assert.equal(config.previews.vars.LOCAL_RUN_ENABLED, 'false');
  assert.deepEqual(config.exports.LocalRunCoordinator, { type: 'durable-object', storage: 'sqlite' });

  const productionDo = config.durable_objects.bindings.find((binding) => binding.name === 'LOCAL_RUN_COORDINATOR');
  const previewDo = config.previews.durable_objects.bindings.find((binding) => binding.name === 'LOCAL_RUN_COORDINATOR');
  assert.equal(productionDo?.class_name, 'LocalRunCoordinator');
  assert.equal(previewDo?.class_name, 'LocalRunCoordinator');
  assert.equal(productionDo.script_name, undefined);
  assert.equal(previewDo.script_name, undefined);

  const productionLimiter = config.ratelimits.find((binding) => binding.name === 'BUILD_RATE_LIMITER');
  const previewLimiter = config.previews.ratelimits.find((binding) => binding.name === 'BUILD_RATE_LIMITER');
  assert.ok(productionLimiter && previewLimiter, 'both environments must declare the rate limiter');
  assert.notEqual(productionLimiter.namespace_id, previewLimiter.namespace_id, 'never share production rate limit counters');
  assert.deepEqual(previewLimiter.simple, { limit: 3, period: 60 });
  assert.deepEqual(productionLimiter.simple, previewLimiter.simple);
});
