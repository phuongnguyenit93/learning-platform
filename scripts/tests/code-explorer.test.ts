import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  findCodeExplorerApi,
  findCodeReference,
  loadCodeExplorer,
  loadCodeExplorerFile,
} from '../../src/data/codeExplorer';

function fixture(route: string) {
  const index = '/module/' + route + '/code-explorer/index.json';
  const base = '/language/java/module/' + route + '/code-explorer/';
  const controller = 'sample/controller/SampleController.java';
  const service = 'sample/service/SampleService.java';
  const method = 'sample.service.SampleService#search(String)';
  const files = [
    { path: controller, bytes: 32, sha256: 'a'.repeat(64) },
    { path: service, bytes: 64, sha256: 'b'.repeat(64) },
  ];
  const responses: Record<string, unknown> = {
    [base + 'index.json']: {
      version: 1, type: 'CODE_EXPLORER', language: 'java', files, tree: [],
      symbols: 'symbols.json', references: 'references.json', apiMap: 'api-map.json',
    },
    [base + 'symbols.json']: {
      version: 1, symbols: [
        { id: method, kind: 'METHOD', name: 'search', file: service,
          line: 9, column: 12, endLine: 9, endColumn: 17 },
      ],
    },
    [base + 'references.json']: {
      version: 1, references: [
        { file: controller, kind: 'METHOD_CALL', text: 'search', line: 21, column: 18,
          endLine: 21, endColumn: 23, status: 'RESOLVED', targets: [method] },
        { file: controller, kind: 'METHOD_CALL', text: 'trim', line: 23, column: 18,
          endLine: 23, endColumn: 21, status: 'UNRESOLVED', targets: [] },
      ],
    },
    [base + 'api-map.json']: {
      version: 1, endpoints: [
        { id: 'sample', controller: 'SampleController', signature: 'search(String)',
          httpMethod: 'POST', path: '/demo/search', status: 'RESOLVED',
          file: controller, targets: [method] },
      ],
    },
    [base + 'files/' + controller]: 'public class SampleController {}',
    [base + 'files/' + service]: 'public class SampleService {}',
  };
  return { index, base, controller, service, method, responses };
}

test('Code Explorer loads the module material, maps an API and resolves Java source on demand', async (t) => {
  const data = fixture('TEST_EXPLORER_ALPHA');
  const requested: string[] = [];
  t.mock.method(globalThis, 'fetch', async (path: RequestInfo | URL) => {
    const value = data.responses[String(path)];
    requested.push(String(path));
    return value === undefined
      ? new Response('Not found', { status: 404 })
      : new Response(typeof value === 'string' ? value : JSON.stringify(value), { status: 200 });
  });
  const material = await loadCodeExplorer(data.index);
  assert.equal(material.files.length, 2);
  assert.equal(material.symbols[0].id, data.method);
  assert.deepEqual(requested.sort(), [
    data.base + 'index.json', data.base + 'symbols.json', data.base + 'references.json',
    data.base + 'api-map.json',
  ].sort());
  const endpoint = findCodeExplorerApi(material, {
    controller: 'SampleController', signature: 'search(String)',
    httpMethod: 'POST', path: '/demo/search',
  });
  assert.equal(endpoint?.status, 'RESOLVED');
  assert.equal(findCodeExplorerApi(material, {
    controller: 'OtherController', signature: 'search(String)',
    httpMethod: 'POST', path: '/demo/search',
  }), undefined);
  assert.deepEqual(findCodeReference(material.references, data.controller, 21, 21)?.targets, [data.method]);
  assert.equal(findCodeReference(material.references, data.controller, 21, 17), undefined);
  assert.equal(findCodeReference(material.references, data.controller, 23, 19)?.status, 'UNRESOLVED');
  assert.equal(findCodeReference(material.references, data.service, 21, 21), undefined);
  assert.equal(await loadCodeExplorerFile(material, data.service), 'public class SampleService {}');
  assert.deepEqual(requested.slice(4), [data.base + 'files/' + data.service]);
  await loadCodeExplorerFile(material, data.service);
  assert.equal(requested.length, 5, 'source should load once and be cached');
  assert.throws(() => loadCodeExplorerFile(material, '../outside.java'), /Invalid Code Explorer source path/);
  await assert.rejects(loadCodeExplorerFile(material, 'sample/Unpublished.java'), /not included/);
  assert.equal(requested.length, 5, 'unsafe or unpublished paths must not issue requests');
});

test('malformed index and cross-material references fail closed', async (t) => {
  const data = fixture('TEST_EXPLORER_BETA');
  (data.responses[data.base + 'symbols.json'] as { symbols: { file: string }[] }).symbols[0].file = 'other/NotIncluded.java';
  t.mock.method(globalThis, 'fetch', async (url: RequestInfo | URL) =>
    new Response(JSON.stringify(data.responses[String(url)]), { status: 200 }));
  await assert.rejects(loadCodeExplorer(data.index), /missing source file/);
  assert.throws(() => loadCodeExplorer('/module/../../private/index.json'), /Invalid Code Explorer material URL/);
});
