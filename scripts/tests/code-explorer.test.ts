import assert from 'node:assert/strict';
import { test } from 'node:test';
import { findCodeReference, loadCodeExplorer, loadCodeExplorerFile } from '../../src/data/codeExplorer';

function fixture(route: string, groupID = 1, caseIndex = 1) {
  const index = `/module/${route}/code-explorer/casestudy/groups/${groupID}/cases/${caseIndex}/index.json`;
  const base = `/language/java/module/${route}/code-explorer/casestudy/groups/${groupID}/cases/${caseIndex}/`;
  const controller = 'sample/controller/Group1Controller.java';
  const service = 'sample/service/Group1Service.java';
  const method = 'sample.service.Group1Service#executeCase1()';
  const files = [
    { path: controller, bytes: 32, sha256: 'a'.repeat(64) },
    { path: service, bytes: 64, sha256: 'b'.repeat(64) },
  ];
  const responses: Record<string, unknown> = {
    [base + 'index.json']: {
      version: 1, type: 'CODE_EXPLORER', id: `casestudy-g${groupID}-c${caseIndex}`,
      language: 'java', files, tree: [], symbols: 'symbols.json',
      references: 'references.json',
    },
    [base + 'symbols.json']: {
      version: 1, symbols: [
        { id: method, kind: 'METHOD', name: 'executeCase1', file: service,
          line: 9, column: 12, endLine: 9, endColumn: 23 },
      ],
    },
    [base + 'references.json']: {
      version: 1, references: [
        { file: controller, kind: 'METHOD_CALL', text: 'executeCase1', line: 21,
          column: 18, endLine: 21, endColumn: 29, status: 'RESOLVED', targets: [method] },
        { file: controller, kind: 'METHOD_CALL', text: 'other', line: 23,
          column: 18, endLine: 23, endColumn: 22, status: 'UNRESOLVED', targets: [] },
      ],
    },
    [base + 'files/' + controller]: 'public class Group1Controller {}',
    [base + 'files/' + service]: 'public class Group1Service {}',
  };
  return { index, base, controller, service, method, responses };
}

test('Case Study Explorer loads only scoped index, symbols and references, then source on demand', async (t) => {
  const data = fixture('TEST_CASE_EXPLORER_ALPHA');
  const requested: string[] = [];
  t.mock.method(globalThis, 'fetch', async (path: RequestInfo | URL) => {
    requested.push(String(path));
    const value = data.responses[String(path)];
    return value === undefined
      ? new Response('Not found', { status: 404 })
      : new Response(typeof value === 'string' ? value : JSON.stringify(value), { status: 200 });
  });
  const material = await loadCodeExplorer(data.index);
  assert.equal(material.files.length, 2);
  assert.equal(material.symbols[0].id, data.method);
  assert.deepEqual(requested.sort(), [
    data.base + 'index.json', data.base + 'symbols.json', data.base + 'references.json',
  ].sort(), 'legacy API map is no longer fetched');
  assert.deepEqual(findCodeReference(material.references, data.controller, 21, 21)?.targets, [data.method]);
  assert.equal(findCodeReference(material.references, data.controller, 21, 17), undefined);
  assert.equal(findCodeReference(material.references, data.controller, 23, 19)?.status, 'UNRESOLVED');
  assert.equal(await loadCodeExplorerFile(material, data.service), 'public class Group1Service {}');
  await loadCodeExplorerFile(material, data.service);
  assert.equal(requested.length, 4, 'source should load once and be cached');
  assert.throws(() => loadCodeExplorerFile(material, '../outside.java'), /Invalid Code Explorer source path/);
  await assert.rejects(loadCodeExplorerFile(material, 'sample/Unpublished.java'), /not included/);
  assert.equal(requested.length, 4, 'invalid paths must not fetch');
});

test('Case Study Explorer rejects cross-case, module-wide, and malformed material', async (t) => {
  const data = fixture('TEST_CASE_EXPLORER_BETA');
  (data.responses[data.base + 'symbols.json'] as { symbols: { file: string }[] }).symbols[0].file =
    'other/NotIncluded.java';
  t.mock.method(globalThis, 'fetch', async (url: RequestInfo | URL) =>
    new Response(JSON.stringify(data.responses[String(url)]), { status: 200 }));
  await assert.rejects(loadCodeExplorer(data.index), /missing source file/);
  assert.throws(() => loadCodeExplorer('/module/TEST_CASE_EXPLORER_BETA/code-explorer/index.json'),
    /Invalid Code Explorer material URL/);
  assert.throws(() => loadCodeExplorer('/module/TEST_CASE_EXPLORER_BETA/code-explorer/casestudy/groups/1/cases/0/index.json'),
    /Invalid Code Explorer material URL/);
  assert.throws(() => loadCodeExplorer('/module/../../private/index.json'),
    /Invalid Code Explorer material URL/);
});

test('Case Study Explorer accepts any explicitly scoped group/case path', async (t) => {
  const data = fixture('TEST_CASE_EXPLORER_G3', 3, 7);
  t.mock.method(globalThis, 'fetch', async (url: RequestInfo | URL) => {
    const value = data.responses[String(url)];
    return value === undefined
      ? new Response('Not found', { status: 404 })
      : new Response(typeof value === 'string' ? value : JSON.stringify(value), { status: 200 });
  });
  const material = await loadCodeExplorer(data.index);
  assert.equal(material.files.length, 2);
  assert.equal(await loadCodeExplorerFile(material, data.service), 'public class Group1Service {}');
});
