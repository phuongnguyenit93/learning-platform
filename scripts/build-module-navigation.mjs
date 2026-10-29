/**
 * Build-time derivatives of the checksum-verified Java catalog.
 * Navigation only contains the tree needed for immediate sidebar rendering;
 * each module's full references/metadata is fetched independently on demand.
 * No producer-owned file under dist/language/java is modified.
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const NAVIGATION_FIELDS = ['id', 'name', 'kind', 'routeId', 'moduleType', 'currentStep', 'description'];
const ROUTE_ID = /^[A-Z0-9][A-Z0-9_-]{0,127}$/;

export async function buildModuleNavigation(javaRoot = 'dist/language/java', outputRoot = 'dist') {
  const source = resolve(javaRoot);
  const destination = resolve(outputRoot);
  if (destination === source || destination.startsWith(source + sep)) {
    throw new Error('Derived frontend metadata must not be written under the Java Release directory');
  }
  const catalog = JSON.parse(await readFile(join(source, 'module-catalog.json'), 'utf8'));
  if (catalog.version !== 1 || !catalog.root || !Array.isArray(catalog.root.children)) {
    throw new Error('Invalid Java catalog for navigation');
  }
  const details = new Map();
  function project(node) {
    if (!node || !Array.isArray(node.children)) throw new Error('Invalid catalog tree node');
    const thin = {};
    for (const field of NAVIGATION_FIELDS) {
      if (node[field] !== undefined) thin[field] = node[field];
    }
    // Only the presence of a roadmap is required for navigation badges.
    if (node.roadmap) {
      thin.roadmap = Object.fromEntries(Object.keys(node.roadmap).map((language) => [language, 'available']));
    }
    thin.hasContent = Boolean(node.knowledge || node.quiz || node.interview || node.casestudy || node.api || node.roadmap || node.codeExplorer);
    thin.children = node.children.map(project);
    if (node.kind === 'MODULE' && node.routeId) {
      if (!ROUTE_ID.test(node.routeId) || details.has(node.routeId)) {
        throw new Error(`Invalid or duplicate routeId in catalog: ${node.routeId}`);
      }
      const { children: _children, ...metadata } = node;
      details.set(node.routeId, metadata);
    }
    return thin;
  }
  const navigation = { version: 1, root: project(catalog.root) };
  const detailsRoot = join(destination, 'module-details');
  await mkdir(detailsRoot, { recursive: true });
  for (const [routeId, detail] of details) {
    await writeFile(join(detailsRoot, `${routeId}.json`), JSON.stringify(detail));
  }
  await writeFile(join(destination, 'module-navigation.json'), JSON.stringify(navigation));
  console.log(`MODULE NAVIGATION BUILT: ${details.size} detail files, ${Buffer.byteLength(JSON.stringify(navigation))} navigation bytes`);
  return { navigation, details };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildModuleNavigation().catch((error) => {
    console.error(`MODULE NAVIGATION FAILED: ${error.message}`);
    process.exitCode = 1;
  });
}
