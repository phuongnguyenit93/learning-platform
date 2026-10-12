import type { LocalRunCoordinator } from './local-run/coordinator';

export interface WorkerEnv {
  ASSETS: Fetcher;
  /** Use Wrangler secret, never a VITE_ env variable. */
  GITHUB_ACTION_TOKEN?: string;
  /** Server-side dispatch kill switch, independent of the Vite UI flag. */
  LOCAL_RUN_ENABLED?: string;
  LOCAL_RUN_COORDINATOR: DurableObjectNamespace<LocalRunCoordinator>;
  BUILD_RATE_LIMITER: RateLimit;
}
