import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BuildCoordinatorEngine } from '../local-run/engine';
import { GithubRejectedError, LocalRunError, assetLabel, trackingId, workflowTitle,
  type BuildRecord, type GithubRun, type GithubService, type RecordStore,
} from '../local-run/types';

const MODULE = 'THREAD';
const FP = 'a'.repeat(40);
const FP2 = 'b'.repeat(40);
const title = workflowTitle(MODULE, FP);

class Store implements RecordStore {
  value: BuildRecord | null = null;
  read() { return this.value ? structuredClone(this.value) : null; }
  write(value: BuildRecord) { this.value = structuredClone(value); }
}

function createHarness() {
  const store = new Store();
  const stats = { assets: 0, active: 0, dispatched: 0, polled: 0, rate: 0 };
  let clock = 1000;
  let releaseAsset: Awaited<ReturnType<GithubService['findAsset']>> = null;
  let listedRun: GithubRun | null = null;
  let getRun: GithubRun = {
    id: 88, display_title: title, head_branch: 'main', status: 'in_progress', html_url: 'https://github.com/run/88',
  };
  let onFindAsset: (() => Promise<void>) | undefined;
  let onDispatch: (() => Promise<void>) | undefined;
  let onGetRun: (() => Promise<void>) | undefined;
  let allowDispatch = true;

  const github: GithubService = {
    async findAsset() {
      stats.assets++;
      await onFindAsset?.();
      return releaseAsset;
    },
    async findMatchingRun() {
      stats.active++;
      return listedRun;
    },
    async dispatch() {
      stats.dispatched++;
      await onDispatch?.();
      return { id: 88, url: 'https://github.com/run/88' };
    },
    async getRun() {
      stats.polled++;
      await onGetRun?.();
      return getRun;
    },
  };
  const engine = new BuildCoordinatorEngine(store, github, {
    async limit() { stats.rate++; return allowDispatch; },
  }, () => clock);
  return {
    store, stats, engine,
    advance(ms: number) { clock += ms; },
    setAsset(asset: typeof releaseAsset) { releaseAsset = asset; },
    setListedRun(run: GithubRun | null) { listedRun = run; },
    setPolledRun(run: GithubRun) { getRun = run; },
    setAssetHook(fn: () => Promise<void>) { onFindAsset = fn; },
    setDispatchHook(fn: () => Promise<void>) { onDispatch = fn; },
    setGetRunHook(fn: () => Promise<void>) { onGetRun = fn; },
    disallowBuild() { allowDispatch = false; },
  };
}

test('existing matching JAR returns AVAILABLE without rate tokens or dispatch', async () => {
  const h = createHarness();
  h.setAsset({ name: 'thread.jar', label: assetLabel(MODULE, FP), browser_download_url: 'https://github.com/asset' });
  const response = await h.engine.start(MODULE, FP, 'actor');
  assert.deepEqual(response, { moduleId: MODULE, status: 'SUCCESS', result: 'AVAILABLE' });
  assert.equal(h.stats.rate, 0);
  assert.equal(h.stats.dispatched, 0);
});

test('existing active GitHub workflow is reused without dispatch and without rate tokens', async () => {
  const h = createHarness();
  h.setListedRun({ id: 42, status: 'in_progress', display_title: title, head_branch: 'main', html_url: 'https://github.com/run/42' });
  const result = await h.engine.start(MODULE, FP, 'actor');
  assert.equal(result.result, 'REUSED');
  assert.equal(result.status, 'BUILDING');
  assert.equal(result.runId, trackingId(FP));
  assert.equal(h.stats.dispatched, 0);
  assert.equal(h.stats.rate, 0);
});

test('new source builds once and repeated request reuses the same tracking id', async () => {
  const h = createHarness();
  const first = await h.engine.start(MODULE, FP, 'actor');
  const second = await h.engine.start(MODULE, FP, 'actor');
  assert.equal(first.result, 'DISPATCHED');
  assert.equal(second.result, 'REUSED');
  assert.equal(first.runId, second.runId);
  assert.equal(h.stats.dispatched, 1);
  assert.equal(h.stats.rate, 1);
  h.advance(9000);
  assert.equal((await h.engine.status(MODULE, first.runId!)).status, 'BUILDING');
  h.setPolledRun({ id: 88, display_title: title, head_branch: 'main', status: 'completed', conclusion: 'success' });
  h.advance(9000);
  assert.equal((await h.engine.status(MODULE, first.runId!)).status, 'SUCCESS');
});

test('simultaneous requests are single-flight even while GitHub checks are pending', async () => {
  const h = createHarness();
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  h.setAssetHook(() => pending);

  const first = h.engine.start(MODULE, FP, 'same-ip');
  // The reservation is synchronous and exists before the first external await.
  assert.equal(h.store.value?.phase, 'CHECKING');
  const others = await Promise.all(Array.from({ length: 99 }, () => h.engine.start(MODULE, FP, 'same-ip')));
  assert.ok(others.every((reply) => reply.result === 'REUSED' && reply.runId === trackingId(FP)));
  assert.equal(h.stats.rate, 0);
  release();
  assert.equal((await first).result, 'DISPATCHED');
  assert.equal(h.stats.dispatched, 1);
  assert.equal(h.stats.rate, 1);
});

test('other fingerprint of the same module cannot clobber an active build', async () => {
  const h = createHarness();
  await h.engine.start(MODULE, FP, 'ip');
  await assert.rejects(h.engine.start(MODULE, FP2, 'ip'), (error: unknown) => (
    error instanceof LocalRunError && error.statusCode === 409
  ));
  assert.equal(h.stats.dispatched, 1);
});

test('rate limit blocks only genuinely new dispatches; existing asset is still served', async () => {
  const h = createHarness();
  h.disallowBuild();
  await assert.rejects(h.engine.start(MODULE, FP, 'ip'), (error: unknown) => (
    error instanceof LocalRunError && error.statusCode === 429
  ));
  assert.equal(h.stats.rate, 1);
  assert.equal(h.stats.dispatched, 0);
  h.setAsset({ name: 'thread.jar', label: assetLabel(MODULE, FP), browser_download_url: 'https://github.com/asset' });
  assert.equal((await h.engine.start(MODULE, FP, 'ip')).result, 'AVAILABLE');
  assert.equal(h.stats.rate, 1);
});

test('uncertain dispatch is not retried and can recover using matching workflow', async () => {
  const h = createHarness();
  h.setDispatchHook(async () => { throw new Error('connection dropped after GitHub accepted'); });
  const first = await h.engine.start(MODULE, FP, 'ip');
  assert.equal(first.result, 'DISPATCHED');
  assert.equal(h.store.value?.phase, 'DISPATCHING');
  const duplicate = await h.engine.start(MODULE, FP, 'ip');
  assert.equal(duplicate.result, 'REUSED');
  assert.equal(h.stats.dispatched, 1);
  h.setListedRun({ id: 177, status: 'in_progress', display_title: title, head_branch: 'main' });
  h.advance(13000);
  assert.equal((await h.engine.status(MODULE, trackingId(FP))).status, 'BUILDING');
  assert.equal(h.store.value?.runId, '177');
  assert.equal(h.stats.dispatched, 1);
});

test('uncertain dispatch expires without automatically sending another', async () => {
  const h = createHarness();
  h.setDispatchHook(async () => { throw new Error('network failed'); });
  await h.engine.start(MODULE, FP, 'ip');
  h.advance(20 * 60_000 + 1);
  assert.equal((await h.engine.status(MODULE, trackingId(FP))).status, 'FAILED');
  assert.equal(h.stats.dispatched, 1);
});

test('status rejects unowned tracking IDs and wrong upstream workflow identity', async () => {
  const h = createHarness();
  await h.engine.start(MODULE, FP, 'ip');
  await assert.rejects(h.engine.status(MODULE, trackingId(FP2)), (e: unknown) => e instanceof LocalRunError && e.statusCode === 404);
  h.setPolledRun({ id: 88, status: 'completed', conclusion: 'success', display_title: 'some other workflow', head_branch: 'main' });
  h.advance(9000);
  await assert.rejects(h.engine.status(MODULE, trackingId(FP)), (e: unknown) => e instanceof LocalRunError && e.statusCode === 502);
});

test('GitHub explicitly rejecting dispatch fails fast instead of leaving a phantom queued job', async () => {
  const h = createHarness();
  h.setDispatchHook(async () => { throw new GithubRejectedError(403); });
  await assert.rejects(h.engine.start(MODULE, FP, 'ip'), (e: unknown) => (
    e instanceof GithubRejectedError && e.statusCode === 502
  ));
  assert.equal(h.store.value?.phase, 'FAILED');
  assert.equal((await h.engine.status(MODULE, trackingId(FP))).status, 'FAILED');
});

test('concurrent status pollers share a durable check window rather than stampeding GitHub', async () => {
  const h = createHarness();
  await h.engine.start(MODULE, FP, 'ip');
  h.advance(9000);
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  h.setGetRunHook(() => pending);
  const first = h.engine.status(MODULE, trackingId(FP));
  const rest = await Promise.all(Array.from({ length: 50 }, () => h.engine.status(MODULE, trackingId(FP))));
  assert.equal(h.stats.polled, 1);
  assert.ok(rest.every((r) => r.status === 'QUEUED'));
  release();
  assert.equal((await first).status, 'BUILDING');
  assert.equal(h.stats.polled, 1);
});
