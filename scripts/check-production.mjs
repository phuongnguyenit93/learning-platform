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
  '/language/java/module/OBJECT_ORIENTED_PROGRAMMING/knowledge/vi/index.json',
  '/language/java/module/OBJECT_ORIENTED_PROGRAMMING/knowledge/en/index.json',
];

const digest = (data) => createHash('sha256').update(data).digest('hex');

const OOP_MODULE_ID = 'OBJECT_ORIENTED_PROGRAMMING';

function firstKnowledgeLesson(index, language) {
  if (index?.version !== 1 || index.moduleId !== OOP_MODULE_ID ||
      index.language !== language || !Array.isArray(index.tree)) {
    throw new Error(`Invalid OOP Knowledge index for ${language}`);
  }

  const nodes = [...index.tree];
  while (nodes.length) {
    const node = nodes.shift();
    if (Array.isArray(node?.sections)) {
      for (const section of node.sections) {
        if (typeof section?.content !== 'string') continue;
        const prefix = `/module/${OOP_MODULE_ID}/knowledge/${language}/content/`;
        const contentPath = decodeURIComponent(section.content);
        const relative = contentPath.startsWith(prefix) ? contentPath.slice(prefix.length) : '';
        if (!relative.endsWith('.md') ||
            relative.split('/').some((part) => !part || part === '.' || part === '..' || part.includes('\\')) ||
            /[?#]/.test(relative)) {
          throw new Error(`Invalid OOP ${language} Knowledge lesson path: ${section.content}`);
        }
        return `/language/java${contentPath}`;
      }
    }
    if (Array.isArray(node?.children)) nodes.push(...node.children);
  }
  throw new Error(`OOP Knowledge index has no lessons for ${language}`);
}

async function knowledgeLessonPaths(directory) {
  const paths = [];
  for (const language of ['vi', 'en']) {
    const indexPath = `/language/java/module/${OOP_MODULE_ID}/knowledge/${language}/index.json`;
    const index = JSON.parse(await readFile(resolve(directory, indexPath.substring(1)), 'utf8'));
    paths.push(firstKnowledgeLesson(index, language));
  }
  return paths;
}

export async function verifyProductionOnce(url, directory = 'dist', fetchImpl = fetch) {
  await checkPreview(url, fetchImpl);
  const bundles = (await readdir(resolve(directory, 'assets')))
    .filter((name) => name.endsWith('.js') || name.endsWith('.css'))
    .map((name) => `/assets/${name}`);
  if (!bundles.some((path) => path.endsWith('.js')) || !bundles.some((path) => path.endsWith('.css'))) {
    throw new Error('Deployment artifact has no Vite JavaScript or CSS bundle');
  }
  // Resolve real lesson paths from the exact artifact's Knowledge indices.
  // Module content is generated and lesson names change between releases.
  const checkedPaths = [...productionAssetPaths, ...await knowledgeLessonPaths(directory), ...bundles];
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
