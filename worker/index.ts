import { LocalRunCoordinator } from './local-run/coordinator';
import { GithubLocalRun, freshAsset } from './local-run/github';
import { validatePublishedModule } from './local-run/catalog';
import {
  LocalRunError, jarName, sourceZipName, json, normalizeFingerprint, normalizeModuleId,
  type CoordinatorRpcResult,
} from './local-run/types';
import type { WorkerEnv } from './types';

export { LocalRunCoordinator };

function fromCoordinator<T>(reply: CoordinatorRpcResult<T>): Response {
  if (reply.ok) return json(reply.value);
  return json({ message: reply.message }, reply.statusCode,
    reply.statusCode === 429 ? { 'retry-after': '60' } : undefined);
}

async function readSmallJson(request: Request): Promise<{ moduleId?: unknown; sourceFingerprint?: unknown }> {
  if (!request.body) throw new LocalRunError(400, 'Missing JSON request body.');
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) throw new LocalRunError(413, 'Build request is too large.');
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text) as { moduleId?: unknown; sourceFingerprint?: unknown };
  } catch (error) {
    if (error instanceof LocalRunError) throw error;
    throw new LocalRunError(400, 'Invalid JSON request body.');
  } finally {
    reader.releaseLock();
  }
}

async function respond(request: Request, env: WorkerEnv): Promise<Response> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);

  // Unknown API routes must be JSON 404s, not the SPA's index.html.
  const path = url.pathname;
  if (![
    '/api/local-run/build', '/api/local-run/status', '/api/local-run/artifact',
    '/api/local-run/source/build', '/api/local-run/source/status', '/api/local-run/source/artifact',
  ].includes(path)) {
    return json({ message: 'API route not found.' }, 404);
  }

  const isSource = path.startsWith('/api/local-run/source/');
  const isBuild = path.endsWith('/build');
  if (request.method !== (isBuild ? 'POST' : 'GET')) {
    return json({ message: 'Method not allowed.' }, 405);
  }
  if (!env.GITHUB_ACTION_TOKEN) {
    // Fail closed until a secret is explicitly configured in the Worker.
    return json({ message: 'Local Run API has not been configured.' }, 503);
  }

  if (isBuild) {
    const origin = request.headers.get('origin');
    if (origin && origin !== url.origin) throw new LocalRunError(403, 'Cross-origin builds are not allowed.');
    if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
      throw new LocalRunError(415, 'Expected application/json request.');
    }
    const size = Number(request.headers.get('content-length') ?? 0);
    if (size > 2048) throw new LocalRunError(413, 'Build request is too large.');
    const payload = await readSmallJson(request);
    const moduleId = normalizeModuleId(payload?.moduleId);
    const fingerprint = normalizeFingerprint(payload?.sourceFingerprint);
    if (!moduleId || !fingerprint) throw new LocalRunError(400, 'Invalid moduleId or sourceFingerprint.');
    await validatePublishedModule(env, request.url, moduleId, fingerprint);

    // CF-Connecting-IP is set by Cloudflare at the edge; not supplied by the UI.
    // Anonymous visitors may share an IP (NAT), so this is a conservative limit.
    const actor = `local-run:${request.headers.get('cf-connecting-ip') ?? 'unknown'}`;
    const coordinator = env.LOCAL_RUN_COORDINATOR.getByName(moduleId);
    const response = isSource
      ? await coordinator.startSourceBuild(moduleId, fingerprint, actor)
      : await coordinator.startBuild(moduleId, fingerprint, actor);
    return fromCoordinator(response);
  }

  const moduleId = normalizeModuleId(url.searchParams.get('moduleId'));
  if (!moduleId) throw new LocalRunError(400, 'Invalid moduleId.');

  if (path.endsWith('/status')) {
    const runId = url.searchParams.get('runId');
    if (!runId || !/^job-[0-9a-f]{40,64}$/.test(runId)) {
      throw new LocalRunError(400, 'Invalid Local Run job id.');
    }
    const coordinator = env.LOCAL_RUN_COORDINATOR.getByName(moduleId);
    return fromCoordinator(isSource
      ? await coordinator.getSourceBuildStatus(moduleId, runId)
      : await coordinator.getBuildStatus(moduleId, runId));
  }

  const fingerprint = normalizeFingerprint(url.searchParams.get('sourceFingerprint'));
  if (!fingerprint) throw new LocalRunError(400, 'Invalid sourceFingerprint.');
  const asset = await new GithubLocalRun(env.GITHUB_ACTION_TOKEN, isSource ? 'source' : 'jar').findAsset(moduleId);
  const fileName = isSource ? sourceZipName(moduleId) : jarName(moduleId);
  if (!asset) return json({ moduleId, available: false, stale: false, fileName });
  if (!freshAsset(asset, moduleId, fingerprint, isSource ? 'source' : 'jar')) {
    return json({ moduleId, available: false, stale: true, fileName });
  }
  if (url.searchParams.get('download') === '1') {
    return Response.redirect(asset.browser_download_url, 302);
  }
  return json({ moduleId, available: true, stale: false, fileName, downloadUrl: asset.browser_download_url });
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    try {
      return await respond(request, env);
    } catch (error) {
      if (error instanceof LocalRunError) {
        return json({ message: error.message }, error.statusCode,
          error.statusCode === 429 ? { 'retry-after': '60' } : undefined);
      }
      console.error('Local Run failed:', error instanceof Error ? error.name : 'unknown error');
      return json({ message: 'Local Run temporarily unavailable.' }, 502);
    }
  },
} satisfies ExportedHandler<WorkerEnv>;
