import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BACKEND_HEALTH_URL, logBackendHealth } from '../../src/data/backendHealth';

test('logs the response from the public Spring Boot health endpoint', async () => {
  const originalFetch = globalThis.fetch;
  const originalLog = console.log;
  const logged: unknown[][] = [];

  try {
    globalThis.fetch = async (input, init) => {
      assert.equal(input, BACKEND_HEALTH_URL);
      assert.deepEqual(init, { cache: 'no-store' });
      return new Response(JSON.stringify({ service: 'learning-platform-backend', status: 'UP' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };
    console.log = (...args: unknown[]) => { logged.push(args); };

    await logBackendHealth();

    assert.equal(logged.length, 1);
    assert.equal(logged[0][0], '[learning-platform] Spring Boot health:');
    assert.deepEqual(logged[0][1], { service: 'learning-platform-backend', status: 'UP' });
  } finally {
    globalThis.fetch = originalFetch;
    console.log = originalLog;
  }
});

test('logs an error when the health endpoint is unavailable', async () => {
  const originalFetch = globalThis.fetch;
  const originalError = console.error;
  const errors: unknown[][] = [];

  try {
    globalThis.fetch = async () => { throw new Error('Network unreachable'); };
    console.error = (...args: unknown[]) => { errors.push(args); };

    await logBackendHealth();

    assert.equal(errors.length, 1);
    assert.equal(errors[0][0], '[learning-platform] Spring Boot health check failed:');
    assert.match(String(errors[0][1]), /Network unreachable/);
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalError;
  }
});
