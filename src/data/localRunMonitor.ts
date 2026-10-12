import {
  LocalRunHttpError, type LocalRunArtifactResponse, type LocalRunStatusResponse,
} from './localRun';

const POLL_INTERVAL_MS = 2500;
const MAX_TRACKING_MS = 47 * 60_000; // DO expires a build at 45 minutes.
const MAX_CONNECTION_FAILURE_MS = 90_000;
const ARTIFACT_RETRY_DELAYS_MS = [1000, 2000, 3000, 5000, 8000, 13000, 13000];

export class LocalRunTrackingInterruptedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LocalRunTrackingInterruptedError';
  }
}

export function isRetryableLocalRunError(error: unknown): boolean {
  return error instanceof LocalRunHttpError
    ? error.status === 408 || error.status === 429 || error.status >= 500
    : true; // Caller checks its own signal first; transport timeouts can also be AbortError.
}

export function isLocalRunNotFound(error: unknown): boolean {
  return error instanceof LocalRunHttpError && error.status === 404;
}

export async function waitLocalRun(ms: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => { signal.removeEventListener('abort', cancel); resolve(); }, ms);
    const cancel = () => { clearTimeout(timer); reject(new DOMException('Cancelled', 'AbortError')); };
    signal.addEventListener('abort', cancel, { once: true });
  });
}

export interface TrackingOptions {
  signal: AbortSignal;
  now?: () => number;
  wait?: (ms: number, signal: AbortSignal) => Promise<void>;
}

/** Read-only recovery and polling. Never dispatches or retries POST /build. */
export async function watchLocalRunBuild(
  getStatus: (signal: AbortSignal) => Promise<LocalRunStatusResponse>,
  onStatus: (reply: LocalRunStatusResponse) => void,
  options: TrackingOptions,
): Promise<LocalRunStatusResponse> {
  const { signal, now = Date.now, wait = waitLocalRun } = options;
  const started = now();
  let connectionFailedAt: number | null = null;
  let failures = 0;
  while (!signal.aborted) {
    if (now() - started >= MAX_TRACKING_MS) {
      throw new LocalRunTrackingInterruptedError('Build tracking timed out. Check GitHub Actions, then resume status tracking.');
    }
    try {
      const reply = await getStatus(signal);
      if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
      connectionFailedAt = null;
      failures = 0;
      onStatus(reply);
      if (reply.status === 'SUCCESS' || reply.status === 'FAILED') return reply;
      await wait(POLL_INTERVAL_MS, signal);
    } catch (error) {
      if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
      if (!isRetryableLocalRunError(error)) throw error;
      connectionFailedAt ??= now();
      if (now() - connectionFailedAt >= MAX_CONNECTION_FAILURE_MS) {
        throw new LocalRunTrackingInterruptedError('Connection lost while tracking the build. Retry status without starting a new build.');
      }
      failures += 1;
      await wait(Math.min(10_000, 1000 * 2 ** Math.min(failures, 4)), signal);
    }
  }
  throw new DOMException('Cancelled', 'AbortError');
}

/** Release uploads can lag behind a successful Actions run. Force bypass cache. */
export async function waitForLocalRunArtifact(
  getArtifact: () => Promise<LocalRunArtifactResponse>,
  onArtifact: (artifact: LocalRunArtifactResponse) => void,
  options: TrackingOptions,
): Promise<LocalRunArtifactResponse | null> {
  const { signal, wait = waitLocalRun } = options;
  let last: LocalRunArtifactResponse | null = null;
  for (let index = 0; index <= ARTIFACT_RETRY_DELAYS_MS.length; index += 1) {
    if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
    try {
      last = await getArtifact();
      if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
      onArtifact(last);
      if (last.available && last.downloadUrl) return last;
    } catch (error) {
      if (signal.aborted) throw new DOMException('Cancelled', 'AbortError');
      if (!isRetryableLocalRunError(error)) throw error;
    }
    if (index < ARTIFACT_RETRY_DELAYS_MS.length) {
      await wait(ARTIFACT_RETRY_DELAYS_MS[index], signal);
    }
  }
  return last;
}
