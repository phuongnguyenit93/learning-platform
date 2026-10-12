import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GithubLocalRun, githubRunUrl } from '../local-run/github';

test('numeric GitHub run ID derives the exact URL without an upstream html_url', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ workflow_run_id: 12345 }), { status: 200 }));
  const result = await new GithubLocalRun('fake-token').dispatch('THREAD', 'a'.repeat(64));
  assert.deepEqual(result, { id: 12345,
    url: 'https://github.com/phuongnguyenit93/java-learning/actions/runs/12345' });
});

test('only valid positive numeric run IDs may generate build URLs', () => {
  assert.equal(githubRunUrl(321), 'https://github.com/phuongnguyenit93/java-learning/actions/runs/321');
  for (const id of [0, -1, NaN, Infinity, 1.1]) assert.throws(() => githubRunUrl(id));
});
