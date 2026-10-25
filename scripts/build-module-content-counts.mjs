/**
 * Materialize one small frontend-side summary after the verified Java data
 * release is synced. The browser must not fetch/parse 600+ YAML/JSON files
 * merely to render navigation badges on every Learning page visit.
 *
 * This derived index lives OUTSIDE dist/language/java so it never changes
 * producer-owned, checksum-verified Java Release files.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

function safeJavaPath(root, value) {
  if (typeof value !== 'string' || !value.startsWith('/module/')) {
    throw new Error('Invalid module content path in Java catalog');
  }
  const path = resolve(root, value.slice(1));
  if (!path.startsWith(root + sep)) throw new Error('Module content path escapes Java root');
  return path;
}

function visit(node, modules) {
  if (node.kind === 'MODULE' && node.routeId) modules.push(node);
  for (const child of node.children ?? []) visit(child, modules);
}

export async function buildModuleContentCounts(javaRoot = 'dist/language/java', output = 'dist/module-content-counts.json') {
  const root = resolve(javaRoot);
  const catalog = JSON.parse(await readFile(join(root, 'module-catalog.json'), 'utf8'));
  if (catalog.version !== 1 || !catalog.root) throw new Error('Invalid Java catalog for content counts');
  const modules = [];
  visit(catalog.root, modules);
  const readCounts = new Map();

  async function count(value, type) {
    if (!value) return 0;
    const source = safeJavaPath(root, type === 'api' ? `${value}/api-descriptions.yml` : value);
    const cacheKey = `${type}:${source}`;
    if (!readCounts.has(cacheKey)) {
      readCounts.set(cacheKey, (async () => {
        // Interview/Quiz releases now publish per-chapter question.yml files
        // and a compact index.json with the total. Older releases contain one
        // module-wide YAML; support both during the producer transition.
        if (type === 'quiz' || type === 'interview') {
          const indexPath = source.replace(/question\.yml$/, 'index.json');
          let indexContent;
          if (indexPath === source && source.endsWith('.json')) {
            indexContent = await readFile(indexPath, 'utf8');
          } else if (indexPath !== source) {
            try {
              indexContent = await readFile(indexPath, 'utf8');
            } catch (error) {
              if (error?.code !== 'ENOENT') throw error;
            }
          }
          if (indexContent !== undefined) {
            const index = JSON.parse(indexContent);
            if (!Array.isArray(index.chapters) || !Number.isSafeInteger(index.totalQuestions)
              || index.totalQuestions < 0
              || index.chapters.some((chapter) => !Number.isSafeInteger(chapter.questionCount) || chapter.questionCount < 0)
              || index.chapters.reduce((sum, chapter) => sum + chapter.questionCount, 0) !== index.totalQuestions) {
              throw new Error(`Invalid ${type} index at ${indexPath}`);
            }
            return index.totalQuestions;
          }
        }
        const content = await readFile(source, 'utf8');
        if (type === 'knowledge') {
          const index = JSON.parse(content);
          if (!Number.isSafeInteger(index.sectionCount) || index.sectionCount < 0) {
            throw new Error(`Invalid Knowledge sectionCount at ${source}`);
          }
          return index.sectionCount;
        }
        const parsed = parseYaml(content);
        if (type === 'api') {
          return Object.values(parsed ?? {}).reduce((sum, methods) => (
            sum + Object.values(methods ?? {}).filter((item) => item && item.usage !== false).length
          ), 0);
        }
        if (!Array.isArray(parsed?.questions)) throw new Error(`Invalid ${type} questions at ${source}`);
        return parsed.questions.length;
      })());
    }
    return readCounts.get(cacheKey);
  }

  const locales = {};
  for (const language of ['vi', 'en']) {
    const counts = {};
    for (const module of modules) {
      counts[module.routeId] = {
        knowledge: await count(module.knowledge?.[language], 'knowledge'),
        quiz: await count(module.quiz?.[language], 'quiz'),
        interview: await count(module.interview?.[language], 'interview'),
        apiDocs: await count(module.api?.[language], 'api'),
      };
    }
    locales[language] = counts;
  }
  const summary = { version: 1, locales };
  await writeFile(resolve(output), JSON.stringify(summary));
  console.log(`MODULE COUNTS BUILT: ${modules.length} modules, ${Buffer.byteLength(JSON.stringify(summary))} bytes`);
  return summary;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildModuleContentCounts().catch((error) => {
    console.error(`MODULE COUNTS FAILED: ${error.message}`);
    process.exitCode = 1;
  });
}
