import assert from 'node:assert/strict';
import test from 'node:test';
import { collectApiKnowledgeRelations, resolveOperationKnowledgeKeys } from '../../src/data/apiDocs';
import type { ApiDocsDocument, KnowledgeIndex } from '../../src/types/learning';

const index = {
  tree: [{
    kind: 'CATEGORY',
    id: 'chapter',
    sourcePath: 'chapter.md',
    sections: [{ id: 'class-001' }, { id: 'solid-002' }],
  }],
} as unknown as KnowledgeIndex;

const document: ApiDocsDocument = {
  operationCount: 1,
  controllers: [{
    name: 'Group1Controller',
    title: 'Group 1',
    description: '',
    descriptionHtml: '',
    chapterOrder: null,
    readmeRelated: {},
    operations: [{
      id: 'Group1Controller:executeCase1()',
      controllerName: 'Group1Controller',
      methodSignature: 'executeCase1()',
      methodName: 'executeCase1',
      httpMethod: 'GET',
      path: '/case-studies/group/1/case/1/execute',
      summary: 'Situation',
      description: '<p>Resolution</p>',
      executionHtml: '',
      consumes: [],
      produces: [],
      params: [],
      readmeRelated: { anchorList: ['class-001', 'solid-002'] },
    }],
  }],
};

test('Swagger anchorList resolves every module-wide Knowledge id without a file path', () => {
  const controller = document.controllers[0];
  const operation = controller.operations[0];
  assert.deepEqual(resolveOperationKnowledgeKeys(controller, operation, index),
    ['chapter.md#class-001', 'chapter.md#solid-002']);
  assert.deepEqual(collectApiKnowledgeRelations(document, index).map((link) => link.anchor),
    ['class-001', 'solid-002']);
});

test('legacy file/anchor remains readable', () => {
  const controller = document.controllers[0];
  const operation = {
    ...controller.operations[0],
    readmeRelated: { file: 'chapter.md', anchor: 'class-001' },
  };
  assert.deepEqual(resolveOperationKnowledgeKeys(controller, operation, index), ['chapter.md#class-001']);
});

test('unknown Knowledge ids are ignored rather than linked to the wrong chapter', () => {
  const controller = document.controllers[0];
  const operation = {
    ...controller.operations[0],
    readmeRelated: { anchorList: ['does-not-exist', 'solid-002'] },
  };
  assert.deepEqual(resolveOperationKnowledgeKeys(controller, operation, index), ['chapter.md#solid-002']);
});
