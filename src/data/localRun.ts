import { findPublicReleaseAsset, invalidatePublicReleaseCache, PublicGithubFallbackError } from './githubPublicRelease';

export type LocalRunBuildStatus = 'QUEUED' | 'BUILDING' | 'SUCCESS' | 'FAILED';
export type LocalRunBuildResult = 'AVAILABLE' | 'REUSED' | 'DISPATCHED';

export interface LocalRunBuildRequest {
  moduleId: string;
  sourceFingerprint: string;
}

export interface LocalRunBuildResponse {
  runId?: string;
  moduleId: string;
  status: LocalRunBuildStatus;
  result: LocalRunBuildResult;
}

export interface LocalRunStatusResponse {
  runId: string;
  moduleId: string;
  status: LocalRunBuildStatus;
  message?: string;
}

export interface LocalRunArtifactResponse {
  moduleId: string;
  available: boolean;
  stale?: boolean;
  fileName: string;
  downloadUrl?: string;
}

export interface LocalRunApi {
  startBuild(request: LocalRunBuildRequest, signal?: AbortSignal): Promise<LocalRunBuildResponse>;
  getBuildStatus(runId: string, moduleId: string, signal?: AbortSignal): Promise<LocalRunStatusResponse>;
  getArtifact(moduleId: string, sourceFingerprint: string, refresh?: boolean): Promise<LocalRunArtifactResponse>;
}

export class LocalRunHttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = 'LocalRunHttpError';
  }
}

/** Tracking IDs are stable per module + source version, even after a browser reload. */
export function localRunTrackingId(sourceFingerprint: string): string {
  if (!/^[0-9a-f]{40,64}$/.test(sourceFingerprint)) throw new Error('Invalid Local Run fingerprint.');
  return `job-${sourceFingerprint}`;
}

function jarName(moduleId: string): string {
  const slug = moduleId.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return `${slug || 'module'}.jar`;
}

async function readApiError(response: Response): Promise<string> {
  try {
    const payload = await response.json() as { message?: unknown };
    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
  } catch {
    // Fall through to the generic status message.
  }

  return `Local Run API returned ${response.status} ${response.statusText}`.trim();
}

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  init?.signal?.addEventListener('abort', abort, { once: true });
  if (init?.signal?.aborted) abort();
  const timeout = setTimeout(abort, 12_000);
  try {
    const response = await fetch(input, { cache: 'no-store', ...init, signal: controller.signal });
    if (!response.ok) throw new LocalRunHttpError(response.status, await readApiError(response));
    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
    init?.signal?.removeEventListener('abort', abort);
  }
}

const httpLocalRunApi: LocalRunApi = {
  startBuild({ moduleId, sourceFingerprint }, signal) {
    return requestJson<LocalRunBuildResponse>('/api/local-run/build', {
      method: 'POST',
      signal,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ moduleId, sourceFingerprint }),
    });
  },

  getBuildStatus(runId, moduleId, signal) {
    const search = new URLSearchParams({ runId, moduleId });
    return requestJson<LocalRunStatusResponse>(`/api/local-run/status?${search}`, { signal });
  },

  async getArtifact(moduleId, sourceFingerprint, refresh = false) {
    if (refresh) invalidatePublicReleaseCache();
    const fileName = jarName(moduleId);
    try {
      const asset = await findPublicReleaseAsset(fileName);
      if (!asset) return { moduleId, available: false, stale: false, fileName };
      if (asset.label !== `${moduleId} · fingerprint:${sourceFingerprint}`) {
        return { moduleId, available: false, stale: true, fileName };
      }
      return { moduleId, available: true, stale: false, fileName, downloadUrl: asset.browser_download_url };
    } catch (error) {
      if (!(error instanceof PublicGithubFallbackError)) throw error;
      const search = new URLSearchParams({ moduleId, sourceFingerprint });
      return requestJson<LocalRunArtifactResponse>(`/api/local-run/artifact?${search}`);
    }
  },
};

export const localRunApi: LocalRunApi = httpLocalRunApi;
