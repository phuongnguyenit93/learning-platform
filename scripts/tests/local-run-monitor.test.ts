import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  localRunApi, LocalRunHttpError, localRunTrackingId, type LocalRunArtifactResponse,
  type LocalRunStatusResponse,
} from '../../src/data/localRun';
import { invalidatePublicReleaseCache } from '../../src/data/githubPublicRelease';
import {
  isLocalRunNotFound, LocalRunTrackingInterruptedError,
  waitForLocalRunArtifact, watchLocalRunBuild,
} from '../../src/data/localRunMonitor';

const FP = 'b'.repeat(64);
const MODULE = 'DATABASE_MYSQL';
const RUN_ID = `job-${FP}`;
const response = (status: LocalRunStatusResponse['status']): LocalRunStatusResponse => ({
  moduleId: MODULE, runId: RUN_ID, status,
});

test('tracking ID is deterministic across reloads and rejects invalid fingerprints', () => {
  assert.equal(localRunTrackingId(FP), RUN_ID);
  assert.equal(localRunTrackingId(FP), localRunTrackingId(FP));
  assert.throws(() => localRunTrackingId('../bad'));
});

test('reloading resumes through a read-only status GET, never dispatches POST', async (t) => {
  const requests: string[] = [];
  t.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    requests.push(`${init?.method ?? 'GET'} ${String(input)}`);
    return new Response(JSON.stringify(response(requests.length === 1 ? 'BUILDING' : 'SUCCESS')), {
      status: 200, headers: { 'content-type': 'application/json' },
    });
  });
  const controller = new AbortController();
  const seen: string[] = [];
  const outcome = await watchLocalRunBuild(
    (signal) => localRunApi.getBuildStatus(localRunTrackingId(FP), MODULE, signal),
    (result) => seen.push(result.status),
    { signal: controller.signal, wait: async () => {} },
  );
  assert.equal(outcome.status, 'SUCCESS');
  assert.deepEqual(seen, ['BUILDING', 'SUCCESS']);
  assert.ok(requests.every((request) => request.startsWith('GET /api/local-run/status?')));
  assert.ok(requests.every((request) => request.includes(`runId=job-${FP}`)));
});

test('a missing durable job is a typed 404, not a new dispatch', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ message: 'Not found.' }), { status: 404 }));
  await assert.rejects(
    localRunApi.getBuildStatus(RUN_ID, MODULE),
    (error: unknown) => isLocalRunNotFound(error),
  );
});

test('public JAR download remains available when the Worker status endpoint is offline', async (t) => {
  invalidatePublicReleaseCache();
  t.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.startsWith('/api/local-run/status?')) {
      return new Response(JSON.stringify({ message: 'offline' }), { status: 503 });
    }
    if (url.endsWith('/releases/tags/local-run')) {
      return new Response(JSON.stringify({ id: 44 }));
    }
    if (url.includes('/releases/44/assets?')) {
      return new Response(JSON.stringify([{
        name: 'database_mysql.jar',
        label: `${MODULE} · fingerprint:${FP}`,
        browser_download_url: 'https://github.com/phuongnguyenit93/java-learning/releases/download/local-run/database_mysql.jar',
      }]));
    }
    throw new Error(`Unexpected URL: ${url}`);
  });
  const status = localRunApi.getBuildStatus(RUN_ID, MODULE);
  const asset = localRunApi.getArtifact(MODULE, FP);
  await assert.rejects(status, (error: unknown) => error instanceof LocalRunHttpError && error.status === 503);
  assert.equal((await asset).available, true, 'public Release does not require a live Worker status API');
  invalidatePublicReleaseCache();
});

test('temporary 503 and network errors reconnect without losing progress', async () => {
  const controller = new AbortController();
  let requests = 0;
  let clock = 0;
  const statuses: string[] = [];
  const result = await watchLocalRunBuild(
    async () => {
      requests++;
      if (requests === 1) throw new TypeError('network offline');
      if (requests === 2) throw new LocalRunHttpError(503, 'Service unavailable');
      return response(requests === 3 ? 'BUILDING' : 'SUCCESS');
    },
    (reply) => statuses.push(reply.status),
    { signal: controller.signal, now: () => clock, wait: async (ms) => { clock += ms; } },
  );
  assert.equal(result.status, 'SUCCESS');
  assert.equal(requests, 4);
  assert.deepEqual(statuses, ['BUILDING', 'SUCCESS']);
});

test('long connection outage ends in recoverable pause rather than FAILED', async () => {
  const controller = new AbortController();
  let clock = 0;
  let calls = 0;
  await assert.rejects(
    watchLocalRunBuild(
      async () => { calls++; throw new TypeError('offline'); },
      () => assert.fail('no terminal status should be emitted'),
      { signal: controller.signal, now: () => clock, wait: async (ms) => { clock += ms; } },
    ),
    (error: unknown) => error instanceof LocalRunTrackingInterruptedError && /Connection lost/.test(error.message),
  );
  assert.ok(calls < 30, 'retry backoff must prevent a request stampede');
  assert.ok(clock >= 90_000);
});

test('tracking deadline stops stale polling without changing server state', async () => {
  const controller = new AbortController();
  let clock = 0;
  await assert.rejects(
    watchLocalRunBuild(
      async () => response('BUILDING'), () => {},
      { signal: controller.signal, now: () => clock, wait: async (ms) => { clock += ms; } },
    ),
    (error: unknown) => error instanceof LocalRunTrackingInterruptedError && /timed out/.test(error.message),
  );
});

test('terminal FAILED is retained with no retry or new Build', async () => {
  let calls = 0;
  const result = await watchLocalRunBuild(
    async () => { calls++; return { ...response('FAILED'), message: 'GitHub Actions failed' }; },
    () => {}, { signal: new AbortController().signal, wait: async () => {} },
  );
  assert.equal(result.status, 'FAILED');
  assert.equal(result.message, 'GitHub Actions failed');
  assert.equal(calls, 1);
});

test('Release metadata appearing late is found after a few forced retries', async () => {
  let calls = 0;
  const delays: number[] = [];
  const seen: boolean[] = [];
  const getArtifact = async (): Promise<LocalRunArtifactResponse> => ({
    moduleId: MODULE, fileName: 'database_mysql.jar',
    available: ++calls >= 3, downloadUrl: calls >= 3 ? 'https://github.com/example.jar' : undefined,
  });
  const artifact = await waitForLocalRunArtifact(getArtifact, (value) => seen.push(value.available), {
    signal: new AbortController().signal, wait: async (ms) => { delays.push(ms); },
  });
  assert.equal(artifact?.available, true);
  assert.equal(calls, 3);
  assert.deepEqual(delays, [1000, 2000]);
  assert.deepEqual(seen, [false, false, true]);
});

test('Release never appearing stops after bounded retries, preserving success state', async () => {
  let calls = 0;
  let elapsed = 0;
  const artifact = await waitForLocalRunArtifact(async () => {
    calls++;
    return { moduleId: MODULE, fileName: 'database_mysql.jar', available: false };
  }, () => {}, {
    signal: new AbortController().signal, wait: async (ms) => { elapsed += ms; },
  });
  assert.equal(artifact?.available, false);
  assert.equal(calls, 8);
  assert.equal(elapsed, 45_000);
});

test('abort on unmount prevents further polling', async () => {
  const controller = new AbortController();
  let calls = 0;
  await assert.rejects(watchLocalRunBuild(
    async () => { calls++; return response('BUILDING'); },
    () => {},
    { signal: controller.signal, wait: async () => { controller.abort(); } },
  ), (error: unknown) => error instanceof Error && error.name === 'AbortError');
  assert.equal(calls, 1);
});
