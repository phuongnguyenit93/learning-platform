import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveAssessmentKnowledgeLinks } from '../../src/data/knowledge';
import type { KnowledgeIndex } from '../../src/types/learning';

const index: KnowledgeIndex = {
  version: 1,
  moduleId: 'OOP',
  language: 'vi',
  categoryCount: 2,
  sectionCount: 2,
  tree: [
    { kind: 'FOLDER', id: 'design', title: 'Design', children: [
      { kind: 'CATEGORY', id: 'solid', title: 'Nguyên lý SOLID', sourcePath: 'solid', sections: [
        { id: 'solid-002', title: '2. Single Responsibility Principle',
          content: '/module/OOP/knowledge/solid-002.md', difficulty: 'BASIC' },
      ] },
    ] },
    { kind: 'CATEGORY', id: 'oop-basic', title: 'Tư duy OOP', sourcePath: 'oop-basic', sections: [
      { id: 'oop-basic-001', title: '1. OOP là gì?',
        content: '/module/OOP/knowledge/oop-basic-001.md', difficulty: 'BASIC' },
    ] },
  ],
};

test('assessment Knowledge links resolve module-wide, retaining authored order and removing duplicates', () => {
  const resolved = resolveAssessmentKnowledgeLinks(index, {
    file: '', anchor: '',
    anchorList: ['solid-002', 'oop-basic-001', 'missing', 'solid-002'],
  });
  assert.deepEqual(resolved.map((section) => section.id), ['solid-002', 'oop-basic-001']);
  assert.deepEqual(resolved.map((section) => section.categoryTitle), ['Nguyên lý SOLID', 'Tư duy OOP']);
  assert.equal(resolved[1].categoryId, 'oop-basic');
});

test('legacy file+anchor references remain compatible, while empty links remain empty', () => {
  const legacy = resolveAssessmentKnowledgeLinks(index, { file: 'solid', anchor: 'solid-002' });
  assert.equal(legacy.length, 1);
  assert.equal(legacy[0].title, '2. Single Responsibility Principle');
  assert.deepEqual(resolveAssessmentKnowledgeLinks(index, { file: '', anchor: '', anchorList: [] }), []);
  assert.deepEqual(resolveAssessmentKnowledgeLinks(null, { file: '', anchor: 'solid-002' }), []);
});

test('duplicate Knowledge IDs across chapters are ambiguous, never guessed', () => {
  const ambiguous: KnowledgeIndex = {
    ...index,
    tree: [...index.tree, {
      kind: 'CATEGORY', id: 'other', title: 'Other chapter', sourcePath: 'other',
      sections: [{ id: 'solid-002', title: 'Different lesson',
        content: '/module/OOP/knowledge/other.md', difficulty: 'INTERMEDIATE' }],
    }],
  };
  assert.deepEqual(resolveAssessmentKnowledgeLinks(ambiguous,
    { file: '', anchor: '', anchorList: ['solid-002'] }), []);
  assert.equal(resolveAssessmentKnowledgeLinks(ambiguous,
    { file: 'solid', anchor: 'solid-002' })[0].categoryId, 'solid');
});
