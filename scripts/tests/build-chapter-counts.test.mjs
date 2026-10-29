import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { buildModuleContentCounts } from '../build-module-content-counts.mjs';

test('content counts read chapter indexes and accept a legacy YAML release', async () => {
  const workspace = await mkdtemp(join(process.cwd(), 'scripts/tests/.tmp-chapter-counts-'));
  const javaRoot = join(workspace, 'java');
  const output = join(workspace, 'counts.json');
  const save = async (file, contents) => {
    const full = join(javaRoot, file);
    await mkdir(dirname(full), { recursive: true });
    await writeFile(full, contents);
  };
  try {
    const paths = Object.fromEntries(['quiz', 'interview'].map((kind) => [kind, {
      vi: `/module/TEST/${kind}/vi/index.json`,
      en: `/module/TEST/${kind}/en/question.yml`,
    }]));
    await save('module-catalog.json', JSON.stringify({ version: 1,
      root: { kind: 'GROUP', children: [{ kind: 'MODULE', routeId: 'TEST', children: [], ...paths }] },
    }));
    for (const [kind, count] of [['quiz', 3], ['interview', 2]]) {
      await save(`module/TEST/${kind}/vi/index.json`, JSON.stringify({
        chapters: [{ id: 'Chapter', title: 'Chapter', path: 'menu/Chapter/question.yml', questionCount: count }],
        totalQuestions: count,
      }));
      await save(`module/TEST/${kind}/en/question.yml`, 'questions:\n  - question: One\n');
    }
    const result = await buildModuleContentCounts(javaRoot, output);
    assert.deepEqual(result.locales.vi.TEST, { knowledge: 0, quiz: 3, interview: 2, casestudy: 0, apiDocs: 0 });
    assert.deepEqual(result.locales.en.TEST, { knowledge: 0, quiz: 1, interview: 1, casestudy: 0, apiDocs: 0 });
    assert.deepEqual(JSON.parse(await readFile(output, 'utf8')), result);
  } finally {
    await rm(workspace, { force: true, recursive: true });
  }
});
