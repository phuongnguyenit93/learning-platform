export type BuildStatus = 'QUEUED' | 'BUILDING' | 'SUCCESS' | 'FAILED';
export type BuildResult = 'AVAILABLE' | 'REUSED' | 'DISPATCHED';
export type BuildPhase = 'CHECKING' | 'DISPATCHING' | BuildStatus;

export interface BuildRecord {
  moduleId: string;
  fingerprint: string;
  jobId: string;
  phase: BuildPhase;
  createdAt: number;
  checkedAt: number;
  runId?: string;
  runUrl?: string;
  message?: string;
}

export interface BuildReply {
  moduleId: string;
  status: BuildStatus;
  result: BuildResult;
  runId?: string;
  runUrl?: string;
}

export interface StatusReply {
  moduleId: string;
  status: BuildStatus;
  runId: string;
  runUrl?: string;
  message?: string;
}

/** RPC transport: never rely on custom Error instanceof across a DO boundary. */
export type CoordinatorRpcResult<T> =
  | { ok: true; value: T }
  | { ok: false; statusCode: number; message: string };

export interface ReleaseAsset {
  name: string;
  label?: string | null;
  browser_download_url: string;
}

export interface GithubRun {
  id: number;
  status: string;
  conclusion?: string | null;
  display_title?: string;
  head_branch?: string;
  created_at?: string;
  html_url?: string;
}

export interface GithubService {
  findAsset(moduleId: string): Promise<ReleaseAsset | null>;
  findMatchingRun(moduleId: string, fingerprint: string, since?: number): Promise<GithubRun | null>;
  dispatch(moduleId: string, fingerprint: string): Promise<{ id: number; url?: string }>;
  getRun(runId: string): Promise<GithubRun>;
}

export interface RecordStore {
  read(): BuildRecord | null;
  write(value: BuildRecord): void;
}

export interface DispatchLimiter {
  limit(actor: string): Promise<boolean>;
}

export class LocalRunError extends Error {
  constructor(readonly statusCode: number, message: string) {
    super(message);
    this.name = 'LocalRunError';
  }
}

/** An explicit GitHub 4xx rejection proves no new workflow was accepted. */
export class GithubRejectedError extends LocalRunError {
  constructor(status: number) {
    super(502, `GitHub rejected the build request (HTTP ${status}).`);
    this.name = 'GithubRejectedError';
  }
}

export const MODULE_ID_PATTERN = /^[A-Z0-9][A-Z0-9_-]{0,63}$/;
export const FINGERPRINT_PATTERN = /^[0-9a-f]{40,64}$/;

export function normalizeModuleId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toUpperCase();
  return MODULE_ID_PATTERN.test(normalized) ? normalized : null;
}

export function normalizeFingerprint(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  return FINGERPRINT_PATTERN.test(normalized) ? normalized : null;
}

export function jarName(moduleId: string): string {
  return `${moduleId.toLowerCase().replace(/[^a-z0-9._-]+/g, '-')}.jar`;
}

export function sourceZipName(moduleId: string): string {
  return `${moduleId.toLowerCase().replace(/[^a-z0-9._-]+/g, '-')}_source.zip`;
}

export function assetLabel(moduleId: string, fingerprint: string): string {
  return `${moduleId} · fingerprint:${fingerprint}`;
}

export function sourceAssetLabel(moduleId: string, fingerprint: string): string {
  return `${moduleId} · source-fingerprint:${fingerprint}`;
}

export function workflowTitle(moduleId: string, fingerprint: string): string {
  return `Local Run ${moduleId} · fingerprint:${fingerprint}`;
}

export function sourceWorkflowTitle(moduleId: string, fingerprint: string): string {
  return `Local Run Source ${moduleId} · source-fingerprint:${fingerprint}`;
}

export function trackingId(fingerprint: string): string {
  return `job-${fingerprint}`;
}

export function json(payload: unknown, status = 200, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      ...headers,
    },
  });
}
