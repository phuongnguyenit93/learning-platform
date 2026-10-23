/**
 * Real HTTP verification of a Cloudflare Preview URL.
 * A SPA fallback 200 HTML must not be mistaken for valid Java JSON/YAML.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function ensure(value, message) {
  if (!value) throw new Error(message);
}

export async function checkPreview(previewUrl, fetchImpl = fetch) {
  ensure(typeof previewUrl === 'string' && /^https?:\/\//.test(previewUrl), 'Missing or invalid Preview URL');
  const base = new URL(previewUrl);
  ensure(!base.pathname.replaceAll('/', ''), 'Preview URL must point to a site root');

  async function get(path) {
    const url = new URL(path, base);
    const response = await fetchImpl(url, { cache: 'no-store', signal: AbortSignal.timeout(30_000) });
    ensure(response.ok, `Preview HTTP ${response.status}: ${path}`);
    return response;
  }

  const index = await (await get('/')).text();
  ensure(index.includes('<html') || index.includes('<!doctype html'), 'Preview root is not HTML');
  const catalog = await (await get('/language/java/module-catalog.json')).json();
  ensure(catalog.version === 1 && Array.isArray(catalog.root?.children), 'Preview Java catalog invalid (or SPA fallback)');

  let selected = null;
  function scan(node) {
    if (selected) return;
    if (node.kind === 'MODULE' && typeof node.knowledge === 'object') {
      selected = Object.values(node.knowledge).find((value) => typeof value === 'string' && value.startsWith('/module/')) ?? null;
    }
    for (const child of node.children ?? []) scan(child);
  }
  scan(catalog.root);
  ensure(selected, 'No Knowledge index in Java catalog for smoke test');
  const knowledge = await (await get(`/language/java${selected}`)).json();
  ensure(knowledge && typeof knowledge === 'object' && !('doctype' in knowledge), 'Preview Knowledge JSON invalid');
  console.log(`PREVIEW VERIFIED: ${base.origin}, React HTML, Java catalog and ${selected}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  checkPreview(process.argv[2]).catch((error) => {
    console.error(`PREVIEW VERIFICATION FAILED: ${error.message}`);
    process.exitCode = 1;
  });
}
