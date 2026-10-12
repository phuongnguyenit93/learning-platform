/** Isolated Cloudflare Preview-only rate limit probe. Never imports build dispatch. */
interface ProbeEnv {
  BUILD_RATE_LIMITER: RateLimit;
  RATE_LIMIT_PROBE_NONCE: string;
}

export default {
  async fetch(request: Request, env: ProbeEnv): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (request.method !== 'POST' || path !== '/__p1-rate-limit-check' ||
        !env.RATE_LIMIT_PROBE_NONCE ||
        request.headers.get('x-probe-nonce') !== env.RATE_LIMIT_PROBE_NONCE) {
      return new Response('Not found.', { status: 404 });
    }

    // Unique random key: never spend real user rate-limit quota or dispatch Actions.
    const result = await env.BUILD_RATE_LIMITER.limit({
      key: `p1-preview-probe:${env.RATE_LIMIT_PROBE_NONCE}`,
    });
    return new Response(JSON.stringify({ accepted: result.success }), {
      status: result.success ? 200 : 429,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store',
        ...(result.success ? {} : { 'retry-after': '60' }) },
    });
  },
};
