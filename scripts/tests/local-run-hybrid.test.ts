import assert from 'node:assert/strict';
import { test, type TestContext } from 'node:test';
import { invalidatePublicReleaseCache, PUBLIC_RELEASE_CACHE_TTL_MS } from '../../src/data/githubPublicRelease';
import { localRunApi } from '../../src/data/localRun';
import { shouldRefreshLocalRunOnReturn } from '../../src/data/localRunRefresh';

const FP = 'a'.repeat(40);
const OTHER_FP = 'b'.repeat(40);
const V2_FP = 'c'.repeat(64);
const PUBLIC = 'https://api.github.com/repos/phuongnguyenit93/java-learning';
const DOWNLOAD = 'https://github.com/phuongnguyenit93/java-learning/releases/download/local-run/thread.jar';
let testClock = Date.now();

function json(value: unknown, status = 200, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(value), { status, headers });
}

function asset(moduleId: string, fingerprint: string, url = DOWNLOAD) {
  return {
    name: `${moduleId.toLowerCase()}.jar`,
    label: `${moduleId} · fingerprint:${fingerprint}`,
    browser_download_url: url,
  };
}

function harness(t: TestContext, handler: (url: string, init: RequestInit | undefined) => Response | Promise<Response>) {
  testClock += 20 * 60_000;
  let now = testClock;
  const calls: string[] = [];
  t.mock.method(Date, 'now', () => now);
  t.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push(url);
    return handler(url, init);
  });
  invalidatePublicReleaseCache();
  return { calls, advance(ms: number) { now += ms; } };
}

function githubApi(assets: unknown[], releaseId = 45) {
  return (url: string, init?: RequestInit) => {
    if (url.startsWith(PUBLIC)) {
      assert.equal((init?.headers as Record<string, string>)?.accept, 'application/vnd.github+json');
      assert.equal((init?.headers as Record<string, string>)?.authorization, undefined);
      if (url.endsWith('/releases/tags/local-run')) return json({ id: releaseId });
      if (url.includes(`/releases/${releaseId}/assets?`)) {
        const page = Number(new URL(url).searchParams.get('page'));
        return json(assets.slice((page - 1) * 100, page * 100));
      }
    }
    throw new Error(`Unexpected API call: ${url}`);
  };
}

test('public GitHub asset is AVAILABLE and multiple modules share a cached release index', async (t) => {
  const serve = githubApi([asset('THREAD', FP), asset('ASPECT', FP, DOWNLOAD.replace('thread.jar', 'aspect.jar'))]);
  const h = harness(t, serve);
  const thread = await localRunApi.getArtifact('THREAD', FP);
  assert.deepEqual(thread, {
    moduleId: 'THREAD', fileName: 'thread.jar', available: true, stale: false, downloadUrl: DOWNLOAD,
  });
  assert.equal((await localRunApi.getArtifact('ASPECT', FP)).available, true);
  assert.equal(h.calls.length, 2, 'one release metadata lookup and one asset page, not per module');
  assert.ok(h.calls.every((url) => url.startsWith(PUBLIC)), 'no Worker request for a public success');
});

test('Source ZIP uses a separate release asset and exact source-fingerprint label', async (t) => {
  const zip = 'https://github.com/phuongnguyenit93/java-learning/releases/download/local-run/thread_source.zip';
  const source = {
    name: 'thread_source.zip',
    label: `THREAD · source-fingerprint:${FP}`,
    browser_download_url: zip,
  };
  const h = harness(t, githubApi([asset('THREAD', FP), source]));
  assert.deepEqual(await localRunApi.getSourceArtifact('THREAD', FP), {
    moduleId: 'THREAD', fileName: 'thread_source.zip', available: true, stale: false, downloadUrl: zip,
  });
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).available, true);
  assert.equal(h.calls.length, 2, 'JAR and Source share the public release index, not build state');
});

test('Source ZIP cannot be downloaded with an outdated source fingerprint', async (t) => {
  const h = harness(t, githubApi([{
    name: 'thread_source.zip',
    label: `THREAD · source-fingerprint:${OTHER_FP}`,
    browser_download_url: DOWNLOAD.replace('thread.jar', 'thread_source.zip'),
  }]));
  assert.deepEqual(await localRunApi.getSourceArtifact('THREAD', FP), {
    moduleId: 'THREAD', fileName: 'thread_source.zip', available: false, stale: true,
  });
  assert.equal(h.calls.length, 2);
});

test('Source API dispatch and status URLs are isolated from JAR endpoints', async (t) => {
  const h = harness(t, (url, init) => {
    if (url === '/api/local-run/source/build') {
      assert.equal(init?.method, 'POST');
      assert.deepEqual(JSON.parse(String(init.body)), { moduleId: 'THREAD', sourceFingerprint: FP });
      return json({ moduleId: 'THREAD', status: 'QUEUED', result: 'DISPATCHED', runId: `job-${FP}` });
    }
    assert.ok(url.startsWith('/api/local-run/source/status?'));
    const query = new URL(url, 'https://example.test').searchParams;
    assert.equal(query.get('moduleId'), 'THREAD');
    assert.equal(query.get('runId'), `job-${FP}`);
    return json({ moduleId: 'THREAD', runId: `job-${FP}`, status: 'BUILDING' });
  });
  assert.equal((await localRunApi.startSourceBuild({ moduleId: 'THREAD', sourceFingerprint: FP })).result, 'DISPATCHED');
  assert.equal((await localRunApi.getSourceBuildStatus(`job-${FP}`, 'THREAD')).status, 'BUILDING');
  assert.equal(h.calls.length, 2);
});

test('V2 fingerprint rejects old V1 JAR label but accepts a newly published V2 label', async (t) => {
  let v2Published = false;
  const h = harness(t, (url, init) => githubApi([asset('THREAD', v2Published ? V2_FP : FP)])(url, init));
  const stale = await localRunApi.getArtifact('THREAD', V2_FP);
  assert.equal(stale.available, false);
  assert.equal(stale.stale, true);
  v2Published = true;
  const latest = await localRunApi.getArtifact('THREAD', V2_FP, true);
  assert.equal(latest.available, true);
  assert.equal(h.calls.length, 4);
});

test('mismatched label is stale; absent asset is missing, without Worker fallback', async (t) => {
  const h = harness(t, githubApi([asset('THREAD', OTHER_FP)]));
  assert.deepEqual(await localRunApi.getArtifact('THREAD', FP), {
    moduleId: 'THREAD', fileName: 'thread.jar', available: false, stale: true,
  });
  assert.deepEqual(await localRunApi.getArtifact('ASPECT', FP), {
    moduleId: 'ASPECT', fileName: 'aspect.jar', available: false, stale: false,
  });
  assert.equal(h.calls.length, 2);
});

test('Release 404 is an authoritative missing result, not an authenticated fallback', async (t) => {
  const h = harness(t, (url) => {
    assert.equal(url, `${PUBLIC}/releases/tags/local-run`);
    return json({ message: 'Not Found' }, 404);
  });
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).available, false);
  assert.equal(h.calls.length, 1);
});

test('a generic 403 is not treated as a rate limit, and does not use the Worker', async (t) => {
  const h = harness(t, () => json({ message: 'Forbidden' }, 403));
  await assert.rejects(localRunApi.getArtifact('THREAD', FP), /HTTP 403/);
  assert.equal(h.calls.length, 1);
});

test('secondary 403 rate limit falls back even if primary GitHub quota remains', async (t) => {
  const h = harness(t, (url) => url.startsWith(PUBLIC)
    ? json({ message: 'You have exceeded a secondary rate limit.' }, 403, { 'x-ratelimit-remaining': '42' })
    : json({ moduleId: 'THREAD', fileName: 'thread.jar', available: false, stale: true }));
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).stale, true);
  assert.equal(h.calls.length, 2);
});

test('rate-limited 403 falls back to Worker, and cooldown avoids hammering public GitHub', async (t) => {
  const h = harness(t, (url) => {
    if (url.startsWith(PUBLIC)) return json({ message: 'rate limit' }, 403, { 'x-ratelimit-remaining': '0' });
    assert.ok(url.startsWith('/api/local-run/artifact?'));
    const params = new URLSearchParams(url.split('?')[1]);
    assert.equal(params.get('sourceFingerprint'), FP);
    return json({ moduleId: 'THREAD', fileName: 'thread.jar', available: true, stale: false, downloadUrl: DOWNLOAD });
  });
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).available, true);
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).available, true);
  assert.equal(h.calls.filter((url) => url.startsWith(PUBLIC)).length, 1);
  assert.equal(h.calls.filter((url) => url.startsWith('/api/')).length, 2);
});

test('429 falls back to Worker and honors cooldown', async (t) => {
  const h = harness(t, (url) => url.startsWith(PUBLIC)
    ? json({ message: 'slow down' }, 429, { 'retry-after': '60' })
    : json({ moduleId: 'THREAD', fileName: 'thread.jar', available: false, stale: true }));
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).stale, true);
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).stale, true);
  assert.equal(h.calls.filter((url) => url.startsWith(PUBLIC)).length, 1);
  h.advance(61_000);
  await localRunApi.getArtifact('THREAD', FP);
  assert.equal(h.calls.filter((url) => url.startsWith(PUBLIC)).length, 2);
});

test('network/CORS failure and 5xx fall back to Worker', async (t) => {
  let attempts = 0;
  const h = harness(t, (url) => {
    if (url.startsWith(PUBLIC)) {
      attempts++;
      if (attempts === 1) throw new TypeError('Failed to fetch');
      return json({ message: 'upstream unavailable' }, 503);
    }
    return json({ moduleId: 'THREAD', fileName: 'thread.jar', available: false, stale: false });
  });
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).available, false);
  h.advance(61_000);
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).available, false);
  assert.equal(h.calls.filter((url) => url.startsWith(PUBLIC)).length, 2);
  assert.equal(h.calls.filter((url) => url.startsWith('/api/')).length, 2);
});

test('invalid public download URL fails closed to the Worker', async (t) => {
  const serve = githubApi([asset('THREAD', FP, 'https://example.invalid/fake.jar')]);
  const h = harness(t, (url, init) => url.startsWith(PUBLIC)
    ? serve(url, init)
    : json({ moduleId: 'THREAD', fileName: 'thread.jar', available: false, stale: true }));
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).stale, true);
  assert.equal(h.calls.length, 3);
});

test('100+ release assets paginate and parallel module checks share one in-flight load', async (t) => {
  const all = Array.from({ length: 100 }, (_, i) => ({
    name: `other-${i}.jar`, label: 'unrelated', browser_download_url: DOWNLOAD,
  }));
  all.push(asset('THREAD', FP));
  const h = harness(t, githubApi(all));
  const result = await Promise.all(Array.from({ length: 25 }, () => localRunApi.getArtifact('THREAD', FP)));
  assert.ok(result.every((item) => item.available));
  assert.equal(h.calls.length, 3, 'release, first asset page, second asset page');
});

test('refresh after build ignores cached missing JAR and reads newly published assets', async (t) => {
  let published = false;
  const h = harness(t, (url, init) => githubApi(published ? [asset('THREAD', FP)] : [])(url, init));
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).available, false);
  published = true;
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).available, false, 'normal lookup remains cached');
  assert.equal((await localRunApi.getArtifact('THREAD', FP, true)).available, true, 'completed build forces refresh');
  assert.equal(h.calls.length, 4);
});

test('public asset index expires after five minutes without using the Worker', async (t) => {
  let published = false;
  const h = harness(t, (url, init) => githubApi(published ? [asset('THREAD', FP)] : [])(url, init));
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).available, false);
  published = true;
  h.advance(5 * 60_000 - 1);
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).available, false);
  h.advance(2);
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).available, true);
  assert.equal(h.calls.length, 4);
  assert.ok(h.calls.every((url) => url.startsWith(PUBLIC)));
});

test('returning to Local Run or a visible browser tab rechecks only after cache TTL', () => {
  const lastCheck = 1_000_000;
  assert.equal(shouldRefreshLocalRunOnReturn(0, lastCheck, false), true);
  assert.equal(shouldRefreshLocalRunOnReturn(lastCheck, lastCheck + PUBLIC_RELEASE_CACHE_TTL_MS - 1, false), false);
  assert.equal(shouldRefreshLocalRunOnReturn(lastCheck, lastCheck + PUBLIC_RELEASE_CACHE_TTL_MS, false), true);
  assert.equal(shouldRefreshLocalRunOnReturn(lastCheck, lastCheck + PUBLIC_RELEASE_CACHE_TTL_MS, true), false,
    'visibility and focus events must not interfere with an in-flight check/build');
});

test('manual refresh fetches new Release metadata even before cache expires', async (t) => {
  let uploaded = false;
  const h = harness(t, (url, init) => githubApi(uploaded ? [asset('THREAD', FP)] : [])(url, init));
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).available, false);
  uploaded = true;
  assert.equal((await localRunApi.getArtifact('THREAD', FP)).available, false);
  assert.equal((await localRunApi.getArtifact('THREAD', FP, true)).available, true);
  assert.equal(h.calls.length, 4, 'manual refresh bypasses cached missing state');
});

test('Worker error after fallback is not reported as a missing JAR', async (t) => {
  const h = harness(t, (url) => url.startsWith(PUBLIC)
    ? json({ message: 'slow down' }, 429)
    : json({ message: 'Worker not configured' }, 503));
  await assert.rejects(localRunApi.getArtifact('THREAD', FP), /Worker not configured/);
  assert.equal(h.calls.length, 2);
});
