import { DurableObject } from 'cloudflare:workers';
import { BuildCoordinatorEngine } from './engine';
import { GithubLocalRun } from './github';
import { LocalRunError, type BuildRecord, type BuildReply, type CoordinatorRpcResult, type StatusReply } from './types';
import type { WorkerEnv } from '../types';

class SqliteRecordStore {
  constructor(private readonly sql: SqlStorage, private readonly key = 'build') {
    this.sql.exec('CREATE TABLE IF NOT EXISTS build_state (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
  }

  read(): BuildRecord | null {
    const row = this.sql.exec<{ value: string }>('SELECT value FROM build_state WHERE key = ?', this.key).toArray()[0];
    return row ? JSON.parse(row.value) as BuildRecord : null;
  }

  write(value: BuildRecord): void {
    this.sql.exec(
      'INSERT INTO build_state (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      this.key, JSON.stringify(value),
    );
  }
}

/** One Durable Object instance is named by moduleId (not fingerprint). */
export class LocalRunCoordinator extends DurableObject<WorkerEnv> {
  private readonly engine: BuildCoordinatorEngine;
  private readonly sourceEngine: BuildCoordinatorEngine;

  constructor(ctx: DurableObjectState, env: WorkerEnv) {
    super(ctx, env);
    this.engine = new BuildCoordinatorEngine(
      new SqliteRecordStore(ctx.storage.sql),
      new GithubLocalRun(env.GITHUB_ACTION_TOKEN ?? ''),
      { limit: async (actor) => (await env.BUILD_RATE_LIMITER.limit({ key: actor })).success },
    );
    this.sourceEngine = new BuildCoordinatorEngine(
      new SqliteRecordStore(ctx.storage.sql, 'source'),
      new GithubLocalRun(env.GITHUB_ACTION_TOKEN ?? '', 'source'),
      { limit: async (actor) => (await env.BUILD_RATE_LIMITER.limit({ key: actor })).success },
      Date.now,
      'source',
    );
  }

  private async wrap<T>(task: () => Promise<T>): Promise<CoordinatorRpcResult<T>> {
    try {
      return { ok: true, value: await task() };
    } catch (error) {
      if (error instanceof LocalRunError) {
        return { ok: false, statusCode: error.statusCode, message: error.message };
      }
      console.error('Local Run Coordinator internal error:', error instanceof Error ? error.name : 'unknown');
      return { ok: false, statusCode: 502, message: 'Build coordinator temporarily unavailable.' };
    }
  }

  async startBuild(moduleId: string, fingerprint: string, actor: string): Promise<CoordinatorRpcResult<BuildReply>> {
    return this.wrap(() => this.engine.start(moduleId, fingerprint, actor));
  }

  async getBuildStatus(moduleId: string, jobId: string): Promise<CoordinatorRpcResult<StatusReply>> {
    return this.wrap(() => this.engine.status(moduleId, jobId));
  }

  async startSourceBuild(moduleId: string, fingerprint: string, actor: string): Promise<CoordinatorRpcResult<BuildReply>> {
    return this.wrap(() => this.sourceEngine.start(moduleId, fingerprint, actor));
  }

  async getSourceBuildStatus(moduleId: string, jobId: string): Promise<CoordinatorRpcResult<StatusReply>> {
    return this.wrap(() => this.sourceEngine.status(moduleId, jobId));
  }
}
