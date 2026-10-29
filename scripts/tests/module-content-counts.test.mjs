import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildModuleContentCounts } from '../build-module-content-counts.mjs';

test('one derived content summary preserves numeric badges without browser document fan-out', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'java-content-counts-'));
  t.after(() => rm(root, { force: true, recursive: true }));
  const javaRoot = join(root, 'language', 'java');
  const folder = join(javaRoot, 'module', 'EXAMPLE');
  await mkdir(join(folder, 'api', 'vi'), { recursive: true });
  await mkdir(join(folder, 'api', 'en'), { recursive: true });
  await writeFile(join(folder, 'knowledge.json'), JSON.stringify({ sectionCount: 4 }));
  await writeFile(join(folder, 'quiz.yml'), 'questions:\n  - id: Q1\n  - id: Q2\n');
  await writeFile(join(folder, 'interview.yml'), 'questions:\n  - question: A\n');
  for (const language of ['vi', 'en']) {
    await writeFile(join(folder, 'api', language, 'api-descriptions.yml'),
      'ExampleController:\n  enabled():\n    usage: true\n  disabled():\n    usage: false\n');
  }
  const localized = (value) => ({ vi: value, en: value });
  const module = {
    kind: 'MODULE', routeId: 'EXAMPLE', children: [],
    knowledge: localized('/module/EXAMPLE/knowledge.json'),
    quiz: localized('/module/EXAMPLE/quiz.yml'),
    interview: localized('/module/EXAMPLE/interview.yml'),
    api: { vi: '/module/EXAMPLE/api/vi', en: '/module/EXAMPLE/api/en' },
  };
  await writeFile(join(javaRoot, 'module-catalog.json'), JSON.stringify({
    version: 1, root: { kind: 'GROUP', children: [module] },
  }));
  const originalCatalog = await readFile(join(javaRoot, 'module-catalog.json'), 'utf8');
  const output = join(root, 'module-content-counts.json');
  const result = await buildModuleContentCounts(javaRoot, output);
  assert.deepEqual(result.locales.vi.EXAMPLE, { knowledge: 4, quiz: 2, interview: 1, casestudy: 0, apiDocs: 1 });
  assert.deepEqual(result.locales.vi, result.locales.en);
  assert.deepEqual(JSON.parse(await readFile(output, 'utf8')), result);
  assert.equal(await readFile(join(javaRoot, 'module-catalog.json'), 'utf8'), originalCatalog,
    'derived frontend metadata must not modify the verified Java release');
});
