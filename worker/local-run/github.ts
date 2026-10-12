import {
  GithubRejectedError, LocalRunError, assetLabel, jarName, workflowTitle,
  type GithubRun, type GithubService, type ReleaseAsset,
} from './types';

const OWNER = 'phuongnguyenit93';
const REPO = 'java-learning';
const WORKFLOW = 'local-run-build.yml';
const RELEASE = 'local-run';
const BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;

/** A trusted, numeric GitHub run ID is sufficient to locate the exact build log. */
export function githubRunUrl(id: number): string {
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Invalid GitHub run ID');
  return `https://github.com/${OWNER}/${REPO}/actions/runs/${id}`;
}

export class GithubLocalRun implements GithubService {
  constructor(private readonly token: string) {}

  private async request(path: string, init: RequestInit = {}, allow404 = false): Promise<Response | null> {
    if (!this.token) throw new LocalRunError(503, 'Local Run is not configured on this Worker.');
    let response: Response;
    try {
      response = await fetch(`${BASE}${path}`, {
        ...init,
        headers: {
          accept: 'application/vnd.github+json',
          authorization: `Bearer ${this.token}`,
          'x-github-api-version': '2026-03-10',
          'user-agent': 'learning-platform-local-run',
          ...(init.body ? { 'content-type': 'application/json' } : {}),
        },
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      // A dispatch may have succeeded upstream even when the connection failed.
      throw new LocalRunError(502, 'GitHub API is temporarily unreachable.');
    }
    if (allow404 && response.status === 404) return null;
    if (!response.ok) {
      // Never forward GitHub's raw response; it may contain internal details.
      if (init.method === 'POST' && response.status >= 400 && response.status < 500) {
        throw new GithubRejectedError(response.status);
      }
      throw new LocalRunError(502, `GitHub API request failed (HTTP ${response.status}).`);
    }
    return response;
  }

  async findAsset(moduleId: string): Promise<ReleaseAsset | null> {
    const releaseResponse = await this.request(`/releases/tags/${RELEASE}`, {}, true);
    if (!releaseResponse) return null;
    const release = await releaseResponse.json() as { id?: number };
    if (!Number.isSafeInteger(release.id)) throw new LocalRunError(502, 'GitHub Release metadata is invalid.');
    for (let page = 1; page <= 10; page += 1) {
      const response = await this.request(`/releases/${release.id}/assets?per_page=100&page=${page}`);
      const assets = await response!.json() as ReleaseAsset[];
      if (!Array.isArray(assets)) throw new LocalRunError(502, 'Invalid GitHub asset list.');
      const asset = assets.find((entry) => entry.name === jarName(moduleId));
      if (asset) return asset;
      if (assets.length < 100) break;
    }
    return null;
  }

  async findMatchingRun(moduleId: string, fingerprint: string, since = 0): Promise<GithubRun | null> {
    const response = await this.request(`/actions/workflows/${WORKFLOW}/runs?event=workflow_dispatch&per_page=100`);
    const payload = await response!.json() as { workflow_runs?: GithubRun[] };
    const runs = payload.workflow_runs;
    if (!Array.isArray(runs)) throw new LocalRunError(502, 'Invalid GitHub workflow list.');
    const title = workflowTitle(moduleId, fingerprint);
    return runs.find((run) => (
      run.display_title === title
      && run.head_branch === 'main'
      && Number.isSafeInteger(run.id)
      && (!since || (Date.parse(run.created_at ?? '') >= since - 60000))
    )) ?? null;
  }

  async dispatch(moduleId: string, fingerprint: string): Promise<{ id: number; url?: string }> {
    const response = await this.request(`/actions/workflows/${WORKFLOW}/dispatches`, {
      method: 'POST',
      body: JSON.stringify({
        ref: 'main',
        return_run_details: true,
        inputs: { moduleId, sourceFingerprint: fingerprint },
      }),
    });
    // GitHub returns HTTP 200 + workflow_run_id with return_run_details=true.
    // If GitHub returns 204 unexpectedly we cannot safely retry a dispatch.
    if (response!.status === 204) {
      throw new LocalRunError(502, 'GitHub accepted the dispatch without run details; reconciling.');
    }
    const body = await response!.json() as { workflow_run_id?: number; html_url?: string };
    if (!Number.isSafeInteger(body.workflow_run_id) || !body.workflow_run_id) {
      throw new LocalRunError(502, 'GitHub dispatch returned no valid run id; reconciling.');
    }
    return { id: body.workflow_run_id, url: body.html_url ?? githubRunUrl(body.workflow_run_id) };
  }

  async getRun(runId: string): Promise<GithubRun> {
    const response = await this.request(`/actions/runs/${encodeURIComponent(runId)}`);
    const run = await response!.json() as GithubRun;
    if (!Number.isSafeInteger(run.id) || String(run.id) !== runId) {
      throw new LocalRunError(502, 'GitHub returned mismatched workflow run details.');
    }
    return run;
  }
}

export function freshAsset(asset: ReleaseAsset | null, moduleId: string, fingerprint: string): boolean {
  return asset?.label === assetLabel(moduleId, fingerprint);
}
