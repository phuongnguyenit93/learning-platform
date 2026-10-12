/**
 * Post-deploy gate: the public custom domain must serve the bytes from the
 * exact verified dist artifact GitHub Actions just deployed.
 * A SPA fallback 200, old release or stale CDN content must fail this check.
 */
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkPreview } from './check-preview.mjs';

export const productionAssetPaths = [
  '/language/java/module-catalog.json',
  '/module-navigation.json',
  '/module-details/OBJECT_ORIENTED_PROGRAMMING.json',
  '/module-content-counts.json',
  '/language/java/search/knowledge-search.vi.json',
  '/language/java/search/knowledge-search.en.json',
  '/language/java/module/OBJECT_ORIENTED_PROGRAMMING/knowledge/vi/content/ObjectOrientedProgramming/sections/oop-what.md',
  '/language/java/module/OBJECT_ORIENTED_PROGRAMMING/knowledge/en/content/ObjectOrientedProgramming/sections/oop-what.md',
];

const digest = (data) => createHash('sha256').update(data).digest('hex');

export async function verifyProductionOnce(url, directory = 'dist', fetchImpl = fetch) {
  await checkPreview(url, fetchImpl);
  const bundles = (await readdir(resolve(directory, 'assets')))
    .filter((name) => name.endsWith('.js') || name.endsWith('.css'))
    .map((name) => `/assets/${name}`);
  if (!bundles.some((path) => path.endsWith('.js')) || !bundles.some((path) => path.endsWith('.css'))) {
    throw new Error('Deployment artifact has no Vite JavaScript or CSS bundle');
  }
  const checkedPaths = [...productionAssetPaths, ...bundles];
  for (const path of checkedPaths) {
    const expected = await readFile(resolve(directory, path.substring(1)));
    const expectedHash = digest(expected);
    const target = new URL(path, url);
    // An immutable query key prevents a CDN/browser cache from hiding stale
    // content after publication. URL paths remain the original asset paths.
    target.searchParams.set('verification', expectedHash.substring(0, 16));
    const response = await fetchImpl(target, {
      cache: 'no-store',
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`Production HTTP ${response.status}: ${path}`);
    const actualHash = digest(Buffer.from(await response.arrayBuffer()));
    if (actualHash !== expectedHash) {
      throw new Error(`Production asset mismatch: ${path} (expected ${expectedHash}, got ${actualHash})`);
    }
  }
  console.log(`PRODUCTION VERIFIED: ${new URL(url).origin}, HTML + JSON endpoints and ${checkedPaths.length} exact artifact files (including Vite JS/CSS)`);
}

export async function verifyProduction(url, directory = 'dist', options = {}) {
  const { attempts = 8, intervalMs = 10_000, fetchImpl = fetch } = options;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await verifyProductionOnce(url, directory, fetchImpl);
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      console.warn(`Production not yet verified (attempt ${attempt}/${attempts}): ${error.message}`);
      await new Promise((done) => setTimeout(done, intervalMs));
    }
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const url = process.argv[2];
  if (!url || !/^https:\/\//.test(url)) {
    console.error('Usage: node scripts/check-production.mjs https://your-domain.example [dist]');
    process.exitCode = 1;
  } else {
    verifyProduction(url, process.argv[3]).catch((error) => {
      console.error(`PRODUCTION VERIFICATION FAILED: ${error.message}`);
      process.exitCode = 1;
    });
  }
}
