import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validatePublishedModule } from '../local-run/catalog';
import { LocalRunError } from '../local-run/types';

const fp = 'a'.repeat(40);
const env = {
  ASSETS: {
    async fetch() {
      return new Response(JSON.stringify({ root: {
        kind: 'GROUP', children: [
          { kind: 'MODULE', routeId: 'THREAD', serviceName: 'THREAD', moduleType: 'SERVLET', sourceFingerprint: fp },
          { kind: 'MODULE', routeId: 'GRADLE_CACHE', moduleType: 'LIBRARY', sourceFingerprint: fp },
        ],
      } }), { headers: { 'content-type': 'application/json' } });
    },
  },
};

test('published runnable module and exact fingerprint are required', async () => {
  await validatePublishedModule(env as never, 'https://example.workers.dev/', 'THREAD', fp);
  await assert.rejects(validatePublishedModule(env as never, 'https://example.workers.dev/', 'THREAD', 'b'.repeat(40)),
    (err: unknown) => err instanceof LocalRunError && err.statusCode === 409);
  await assert.rejects(validatePublishedModule(env as never, 'https://example.workers.dev/', 'GRADLE_CACHE', fp),
    (err: unknown) => err instanceof LocalRunError && err.statusCode === 404);
  await assert.rejects(validatePublishedModule(env as never, 'https://example.workers.dev/', 'NOT_REAL', fp),
    (err: unknown) => err instanceof LocalRunError && err.statusCode === 404);
});

test('Fingerprint V2 (64-character SHA-256) is accepted without needing new Worker semantics', async () => {
  const v2 = 'c'.repeat(64);
  const v2env = {
    ASSETS: {
      async fetch() {
        return new Response(JSON.stringify({ root: {
          kind: 'GROUP', children: [
            { kind: 'MODULE', routeId: 'THREAD', moduleType: 'SERVLET', sourceFingerprint: v2 },
          ],
        } }), { headers: { 'content-type': 'application/json' } });
      },
    },
  };
  await validatePublishedModule(v2env as never, 'https://example.workers.dev/', 'THREAD', v2);
  await assert.rejects(validatePublishedModule(v2env as never, 'https://example.workers.dev/', 'THREAD', fp),
    (error: unknown) => error instanceof LocalRunError && error.statusCode === 409);
});
