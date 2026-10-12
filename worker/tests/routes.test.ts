import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('../index.ts', import.meta.url), 'utf8');

test('Worker routes are available without a legacy enable variable', () => {
  assert.match(source, /\/api\/local-run\/build/);
  assert.match(source, /\/api\/local-run\/status/);
  assert.match(source, /\/api\/local-run\/artifact/);
  assert.doesNotMatch(source, /env\.[A-Z_]*ENABLED/);
});

test('Worker keeps credential, origin and payload validation before dispatch', () => {
  const token = source.indexOf('if (!env.GITHUB_ACTION_TOKEN)');
  const origin = source.indexOf("request.headers.get('origin')");
  const contentType = source.indexOf("request.headers.get('content-type')");
  const catalog = source.indexOf('await validatePublishedModule(');
  const dispatch = source.indexOf('.startBuild(moduleId, fingerprint, actor)');
  assert.ok(token > 0 && token < dispatch, 'secret gate before dispatch');
  assert.ok(origin > token && origin < dispatch, 'origin gate before dispatch');
  assert.ok(contentType > origin && contentType < dispatch, 'content-type before dispatch');
  assert.ok(catalog > contentType && catalog < dispatch, 'published fingerprint before dispatch');
  assert.match(source, /Cross-origin builds are not allowed/);
  assert.match(source, /Local Run API has not been configured/);
});
