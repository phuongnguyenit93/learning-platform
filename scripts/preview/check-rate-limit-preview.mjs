/**
 * HTTP smoke test for the isolated Cloudflare Preview rate-limit probe.
 * Never requests /api/local-run/build and never dispatches GitHub Actions.
 */
export async function checkRateLimitPreview(baseUrl, nonce, fetchImpl = fetch) {
  if (!/^https:\/\//.test(baseUrl) || !/^[0-9a-f-]{32,64}$/.test(nonce)) {
    throw new Error('Require a HTTPS Preview URL and a random probe nonce.');
  }
  const url = new URL('/__p1-rate-limit-check', baseUrl);
  const probe = async (key) => fetchImpl(url, {
    method: 'POST', headers: { 'x-probe-nonce': key },
    cache: 'no-store', signal: AbortSignal.timeout(12_000),
  });
  if ((await probe('invalid-probe-key')).status !== 404) {
    throw new Error('Preview probe authentication is not enforced.');
  }
  let accepted = 0;
  let rateLimited = 0;
  // Cloudflare's binding counters are eventually consistent; avoid assuming
  // the fourth immediate request must be rejected on the same edge.
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const reply = await probe(nonce);
    if (reply.status === 200) accepted += 1;
    else if (reply.status === 429) {
      rateLimited += 1;
      if (reply.headers.get('retry-after') !== '60') throw new Error('429 lacks Retry-After: 60');
      break;
    } else {
      throw new Error(`Unexpected Preview response: HTTP ${reply.status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (rateLimited === 0) {
    throw new Error(`Cloudflare Preview did not return HTTP 429 within 20 attempts (accepted=${accepted}).`);
  }
  console.log(`CLOUDFLARE_PREVIEW_429_PASS: ${accepted} accepted in this run, then HTTP 429 + Retry-After: 60; no GitHub dispatch.`);
}

if (process.argv[1]?.endsWith('check-rate-limit-preview.mjs')) {
  checkRateLimitPreview(process.argv[2], process.env.RATE_LIMIT_PROBE_NONCE ?? '')
    .catch((error) => { console.error(error.message); process.exitCode = 1; });
}
