import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BuildCoordinatorEngine } from '../local-run/engine';
import { freshAsset, GithubLocalRun } from '../local-run/github';
import {
  assetLabel, sourceAssetLabel, sourceWorkflowTitle, sourceZipName, trackingId, workflowTitle,
  type BuildRecord, type GithubService,
} from '../local-run/types';

const MODULE = 'DATABASE_MYSQL';
const FP = 'c'.repeat(64);

test('Source ZIP release metadata requires a matching source fingerprint and cannot match a JAR asset', () => {
  const source = { name: sourceZipName(MODULE), label: sourceAssetLabel(MODULE, FP), browser_download_url: 'https://github.com/example' };
  assert.equal(sourceZipName(MODULE), 'database_mysql_source.zip');
  assert.equal(source.label, `${MODULE} · source-fingerprint:${FP}`);
  assert.equal(freshAsset(source, MODULE, FP, 'source'), true);
  assert.equal(freshAsset(source, MODULE, FP, 'jar'), false);
  assert.equal(freshAsset({ ...source, label: assetLabel(MODULE, FP) }, MODULE, FP, 'source'), false);
  assert.equal(freshAsset(source, MODULE, 'd'.repeat(64), 'source'), false);
});

test('Source GitHub client checks the dedicated workflow and release file', async (t) => {
  const requests: Array<{ url: string; body?: string }> = [];
  t.mock.method(globalThis, 'fetch', async (url: string, init?: RequestInit) => {
    const value = String(url);
    requests.push({ url: value, body: init?.body?.toString() });
    const payload = value.endsWith('/releases/tags/local-run') ? { id: 321 }
      : value.includes('/releases/321/assets') ? [
        { name: 'database_mysql.jar', label: assetLabel(MODULE, FP) },
        { name: sourceZipName(MODULE), label: sourceAssetLabel(MODULE, FP) },
      ]
      : value.includes('/runs?event=workflow_dispatch') ? { workflow_runs: [{
        id: 99, status: 'in_progress', display_title: sourceWorkflowTitle(MODULE, FP), head_branch: 'main',
      }] }
      : value.endsWith('/dispatches') ? { workflow_run_id: 987 }
      : {};
    return new Response(JSON.stringify(payload), { status: 200 });
  });
  const github = new GithubLocalRun('token', 'source');
  assert.equal((await github.findAsset(MODULE))?.label, sourceAssetLabel(MODULE, FP));
  assert.equal((await github.findMatchingRun(MODULE, FP))?.id, 99);
  assert.equal((await github.dispatch(MODULE, FP)).id, 987);
  assert.ok(requests.some(({ url }) => url.includes('local-run-source-build.yml/runs')));
  assert.ok(requests.some(({ url }) => url.includes('local-run-source-build.yml/dispatches')));
  assert.deepEqual(JSON.parse(requests.at(-1)!.body!), {
    ref: 'main', return_run_details: true, inputs: { moduleId: MODULE, sourceFingerprint: FP },
  });
});

test('Source engine tracks the dedicated workflow identity and independently deduplicates jobs', async () => {
  let record: BuildRecord | null = null;
  let dispatchCount = 0;
  let clock = 1000;
  const github: GithubService = {
    findAsset: async () => null,
    findMatchingRun: async () => null,
    dispatch: async () => { dispatchCount++; return { id: 55 }; },
    getRun: async () => ({ id: 55, status: 'completed', conclusion: 'success',
      head_branch: 'main', display_title: sourceWorkflowTitle(MODULE, FP) }),
  };
  const engine = new BuildCoordinatorEngine({
    read: () => record,
    write: (value) => { record = structuredClone(value); },
  }, github, { limit: async () => true }, () => clock, 'source');
  const first = await engine.start(MODULE, FP, 'caller');
  const again = await engine.start(MODULE, FP, 'caller');
  assert.equal(first.result, 'DISPATCHED');
  assert.equal(again.result, 'REUSED');
  assert.equal(dispatchCount, 1);
  clock += 9000;
  assert.equal((await engine.status(MODULE, trackingId(FP))).status, 'SUCCESS');
  assert.notEqual(sourceWorkflowTitle(MODULE, FP), workflowTitle(MODULE, FP));
});
