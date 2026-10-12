import { freshAsset, githubRunUrl } from './github';
import {
  GithubRejectedError, LocalRunError, trackingId, workflowTitle,
  type BuildPhase, type BuildRecord, type BuildReply, type BuildStatus,
  type DispatchLimiter, type GithubRun, type GithubService, type RecordStore,
  type StatusReply,
} from './types';

const STATUS_POLL_CACHE_MS = 8000;
const UNKNOWN_DISPATCH_POLL_MS = 12000;
const CHECKING_TIMEOUT_MS = 90000;
const UNKNOWN_DISPATCH_TIMEOUT_MS = 20 * 60_000;
const MAX_BUILD_AGE_MS = 45 * 60_000;

const active = (phase: BuildPhase): boolean => (
  phase === 'CHECKING' || phase === 'DISPATCHING' || phase === 'QUEUED' || phase === 'BUILDING'
);

function publicStatus(record: BuildRecord): BuildStatus {
  return record.phase === 'BUILDING' ? 'BUILDING'
    : record.phase === 'FAILED' ? 'FAILED'
      : record.phase === 'SUCCESS' ? 'SUCCESS' : 'QUEUED';
}

function statusForRun(run: GithubRun): BuildStatus {
  if (run.status === 'completed') return run.conclusion === 'success' ? 'SUCCESS' : 'FAILED';
  return run.status === 'in_progress' ? 'BUILDING' : 'QUEUED';
}

export class BuildCoordinatorEngine {
  constructor(
    private readonly store: RecordStore,
    private readonly github: GithubService,
    private readonly limiter: DispatchLimiter,
    private readonly now: () => number = Date.now,
  ) {}

  private save(record: BuildRecord, change: Partial<BuildRecord>): BuildRecord {
    const current = this.store.read();
    // Ignore late responses from an older job after the slot has moved on.
    if (!current || current.jobId !== record.jobId || current.createdAt !== record.createdAt) {
      throw new LocalRunError(409, 'The module build has been superseded.');
    }
    // An older concurrent GitHub reply must not regress a terminal state.
    if (!active(current.phase) && active(record.phase)) return current;
    const updated = { ...current, ...change };
    this.store.write(updated);
    return updated;
  }

  async start(moduleId: string, fingerprint: string, actor: string): Promise<BuildReply> {
    const old = this.store.read();
    if (old && active(old.phase)) {
      if (this.now() - old.createdAt > MAX_BUILD_AGE_MS) {
        // An abandoned slot does not dispatch again without first being reconciled.
        // The caller can query status; the next request can retry only after failure.
        this.save(old, { phase: 'FAILED', message: 'Build tracking expired. Please retry.', checkedAt: this.now() });
      } else if (old.fingerprint === fingerprint) {
        return {
          moduleId,
          status: publicStatus(old),
          result: 'REUSED',
          runId: old.jobId,
          runUrl: old.runUrl,
        };
      } else {
        throw new LocalRunError(409, `Another source version of ${moduleId} is building. Please wait.`);
      }
    }

    // The durable, per-module reservation is written BEFORE any GitHub I/O.
    // SQLite operations in a Durable Object do not yield and cannot interleave.
    const record: BuildRecord = {
      moduleId,
      fingerprint,
      jobId: trackingId(fingerprint),
      phase: 'CHECKING',
      createdAt: this.now(),
      checkedAt: 0,
    };
    this.store.write(record);

    try {
      const asset = await this.github.findAsset(moduleId);
      if (freshAsset(asset, moduleId, fingerprint)) {
        this.save(record, { phase: 'SUCCESS', checkedAt: this.now() });
        return { moduleId, status: 'SUCCESS', result: 'AVAILABLE' };
      }

      const existing = await this.github.findMatchingRun(moduleId, fingerprint);
      if (existing && existing.status !== 'completed') {
        this.save(record, {
          phase: statusForRun(existing),
          runId: String(existing.id),
          runUrl: existing.html_url ?? githubRunUrl(existing.id),
          checkedAt: this.now(),
        });
        return { moduleId, status: statusForRun(existing), result: 'REUSED', runId: record.jobId, runUrl: existing.html_url ?? githubRunUrl(existing.id) };
      }

      if (!await this.limiter.limit(actor)) {
        this.save(record, { phase: 'FAILED', checkedAt: this.now(), message: 'Build requests are rate limited. Try again later.' });
        throw new LocalRunError(429, 'Too many new build requests. Please retry in one minute.');
      }

      // Dispatch may succeed even if our request times out. Never blindly retry.
      this.save(record, { phase: 'DISPATCHING', checkedAt: this.now() });
      try {
        const dispatched = await this.github.dispatch(moduleId, fingerprint);
        this.save(record, {
          phase: 'QUEUED',
          runId: String(dispatched.id),
          runUrl: dispatched.url,
          checkedAt: this.now(),
        });
        return { moduleId, status: 'QUEUED', result: 'DISPATCHED', runId: record.jobId, runUrl: dispatched.url };
      } catch (error) {
        if (error instanceof GithubRejectedError) {
          this.save(record, { phase: 'FAILED', checkedAt: this.now(), message: error.message });
          throw error;
        }
        // Preserve the DISPATCHING claim; poll GitHub for a matching run before
        // permitting another dispatch. This is the uncertain-outcome state.
        return { moduleId, status: 'QUEUED', result: 'DISPATCHED', runId: record.jobId };
      }
    } catch (error) {
      if (this.store.read()?.jobId === record.jobId && this.store.read()?.phase === 'CHECKING') {
        this.save(record, { phase: 'FAILED', checkedAt: this.now(), message: 'Unable to check GitHub build availability.' });
      }
      throw error;
    }
  }

  async status(moduleId: string, jobId: string): Promise<StatusReply> {
    const record = this.store.read();
    if (!record || record.moduleId !== moduleId || record.jobId !== jobId) {
      throw new LocalRunError(404, 'Build job was not found for this module.');
    }

    const reply = (value: BuildRecord): StatusReply => ({
      moduleId,
      runId: jobId,
      status: publicStatus(value),
      runUrl: value.runUrl ?? (value.runId && /^\d+$/.test(value.runId)
        ? githubRunUrl(Number(value.runId)) : undefined),
      message: value.message,
    });

    if (!active(record.phase)) return reply(record);

    if (record.phase === 'CHECKING') {
      if (this.now() - record.createdAt <= CHECKING_TIMEOUT_MS) return reply(record);
      return reply(this.save(record, { phase: 'FAILED', checkedAt: this.now(), message: 'Build preparation timed out; please retry.' }));
    }

    if (record.phase === 'DISPATCHING') {
      if (this.now() - record.checkedAt < UNKNOWN_DISPATCH_POLL_MS) return reply(record);
      // Claim the polling window before external I/O; avoid a GitHub API stampede.
      this.save(record, { checkedAt: this.now() });
      try {
        const run = await this.github.findMatchingRun(moduleId, record.fingerprint, record.createdAt);
        if (run) return reply(this.save(record, {
          runId: String(run.id),
          runUrl: run.html_url ?? githubRunUrl(run.id),
          phase: statusForRun(run),
          checkedAt: this.now(),
          message: run.status === 'completed' && run.conclusion !== 'success' ? 'GitHub Actions build failed.' : undefined,
        }));
      } catch {
        // Avoid turning a transient GitHub failure into a duplicate build.
      }
      if (this.now() - record.createdAt >= UNKNOWN_DISPATCH_TIMEOUT_MS) {
        return reply(this.save(record, {
          phase: 'FAILED', checkedAt: this.now(),
          message: 'GitHub dispatch could not be confirmed. Check Actions before retrying.',
        }));
      }
      return reply(this.store.read() ?? record);
    }

    if (!record.runId) {
      return reply(this.save(record, { phase: 'FAILED', message: 'Missing GitHub workflow run id.' }));
    }
    if (this.now() - record.checkedAt < STATUS_POLL_CACHE_MS) return reply(record);
    // Other browsers now see a fresh cached status until this fetch completes.
    this.save(record, { checkedAt: this.now() });
    try {
      const run = await this.github.getRun(record.runId);
      // Status endpoint must never accept an unrelated GitHub run.
      if (run.display_title !== workflowTitle(moduleId, record.fingerprint) || run.head_branch !== 'main') {
        throw new LocalRunError(502, 'GitHub workflow identity does not match this build.');
      }
      return reply(this.save(record, {
        phase: statusForRun(run),
        runUrl: run.html_url ?? githubRunUrl(run.id),
        checkedAt: this.now(),
        message: run.status === 'completed' && run.conclusion !== 'success'
          ? `GitHub Actions finished with conclusion: ${run.conclusion ?? 'unknown'}.`
          : undefined,
      }));
    } catch (error) {
      if (error instanceof LocalRunError && error.message.includes('identity')) throw error;
      // Preserve tracking if GitHub is temporarily unreachable.
      if (this.now() - record.createdAt >= MAX_BUILD_AGE_MS) {
        return reply(this.save(record, { phase: 'FAILED', message: 'Build status expired; please inspect GitHub Actions.' }));
      }
      return reply(record);
    }
  }
}
