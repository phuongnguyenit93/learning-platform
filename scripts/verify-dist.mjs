/**
 * Verify the final deployment artifact after Vite build and Java data sync.
 * Cloudflare must never receive a frontend-only/incomplete dist directory.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

function ensure(value, message) {
  if (!value) throw new Error(message);
}

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function validAsset(path) {
  try {
    const entry = await stat(path);
    if (entry.isFile()) return entry.size > 0;
    if (!entry.isDirectory()) return false;
    const entries = await readdir(path);
    return entries.some((name) => name.endsWith('.yml') || name.endsWith('.yaml'));
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function localReference(javaRoot, value) {
  ensure(typeof value === 'string' && value.startsWith('/module/'), 'Invalid module asset reference');
  const path = decodeURIComponent(new URL(value, 'https://local.invalid').pathname);
  const candidate = resolve(javaRoot, path.substring(1));
  ensure(candidate.startsWith(javaRoot + sep), `Unsafe module reference: ${value}`);
  return candidate;
}

function visitModules(node, javaRoot, references) {
  ensure(node && typeof node === 'object' && Array.isArray(node.children), 'Invalid catalog node');
  if (node.kind === 'MODULE') {
    for (const kind of ['overview', 'knowledge', 'roadmap', 'video', 'quiz', 'interview', 'api', 'reference']) {
      const field = node[kind];
      if (!field) continue;
      const values = typeof field === 'object' ? Object.values(field) : [field];
      for (const ref of values) {
        if (typeof ref === 'string' && ref.startsWith('/module/')) {
          references.add(localReference(javaRoot, ref));
        }
      }
    }
  }
  for (const child of node.children) visitModules(child, javaRoot, references);
}

export async function verifyDist(directory = 'dist') {
  const root = resolve(directory);
  const java = join(root, 'language', 'java');
  ensure(await isFile(join(root, 'index.html')), 'Missing dist/index.html');
  ensure(!(await isFile(join(root, 'module-catalog.json'))), 'Unexpected unprefixed Java catalog');

  const assets = await readdir(join(root, 'assets'));
  ensure(assets.some((name) => name.endsWith('.js')), 'Missing compiled JavaScript');
  ensure(assets.some((name) => name.endsWith('.css')), 'Missing compiled CSS');

  const catalog = JSON.parse(await readFile(join(java, 'module-catalog.json'), 'utf8'));
  ensure(catalog.version === 1, 'Unexpected Java catalog version');
  const references = new Set();
  visitModules(catalog.root, java, references);
  ensure(references.size > 0, 'No Java catalog asset references');
  for (const ref of references) ensure(await validAsset(ref), `Missing Java catalog asset: ${ref}`);

  for (const language of ['vi', 'en']) {
    const search = JSON.parse(await readFile(join(java, 'search', `knowledge-search.${language}.json`), 'utf8'));
    ensure(search.version === 1 && Array.isArray(search.documents), `Invalid Java search index: ${language}`);
  }
  console.log(`DIST VERIFIED: Java catalog v${catalog.version}, ${references.size} module asset references, VI/EN search, Vite JS/CSS present`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  verifyDist().catch((error) => {
    console.error(`DIST VERIFICATION FAILED: ${error.message}`);
    process.exitCode = 1;
  });
}
