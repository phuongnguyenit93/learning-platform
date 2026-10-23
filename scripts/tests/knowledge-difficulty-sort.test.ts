import assert from 'node:assert/strict';
import test from 'node:test';
import {
  collectKnowledgeSections,
  sortKnowledgeSectionsByDifficulty,
} from '../../src/data/knowledge';
import type { KnowledgeCategoryNode, KnowledgeSection } from '../../src/types/learning';

const lesson = (id: string, difficulty: KnowledgeSection['difficulty']): KnowledgeSection => ({
  id,
  title: id,
  content: '/' + id + '.md',
  difficulty,
  aiGenerated: false,
  reviewed: false,
});

test('groups BASIC, INTERMEDIATE, ADVANCED without changing authored order within each level', () => {
  const source = [
    lesson('advanced-1', 'ADVANCED'),
    lesson('basic-1', 'BASIC'),
    lesson('intermediate-1', 'INTERMEDIATE'),
    lesson('basic-2', 'BASIC'),
    lesson('advanced-2', 'ADVANCED'),
    lesson('intermediate-2', 'INTERMEDIATE'),
  ];

  const result = sortKnowledgeSectionsByDifficulty(source);
  assert.deepEqual(result.map(({ id }) => id), [
    'basic-1', 'basic-2',
    'intermediate-1', 'intermediate-2',
    'advanced-1', 'advanced-2',
  ]);
  assert.deepEqual(source.map(({ id }) => id), [
    'advanced-1', 'basic-1', 'intermediate-1',
    'basic-2', 'advanced-2', 'intermediate-2',
  ], 'sorting must not mutate the source index');
  assert.notStrictEqual(result, source);
});

test('sorts within each chapter only, preserving chapter sequence and stable IDs', () => {
  const chapters: KnowledgeCategoryNode[] = [
    {
      kind: 'CATEGORY',
      id: 'chapter-one',
      title: 'Chapter One',
      sourcePath: '/one',
      sections: [lesson('a-advanced', 'ADVANCED'), lesson('a-basic', 'BASIC')],
    },
    {
      kind: 'CATEGORY',
      id: 'chapter-two',
      title: 'Chapter Two',
      sourcePath: '/two',
      sections: [lesson('b-intermediate', 'INTERMEDIATE'), lesson('b-basic', 'BASIC')],
    },
  ];

  const raw = collectKnowledgeSections(chapters);
  assert.deepEqual(raw.map(({ id }) => id), [
    'a-advanced', 'a-basic', 'b-intermediate', 'b-basic',
  ], 'default collection keeps the original order for other feature integrations');

  const sorted = collectKnowledgeSections(chapters, { sortByDifficulty: true });
  assert.deepEqual(sorted.map(({ id }) => id), [
    'a-basic', 'a-advanced', 'b-basic', 'b-intermediate',
  ]);
  assert.deepEqual(sorted.map(({ categoryId }) => categoryId), [
    'chapter-one', 'chapter-one', 'chapter-two', 'chapter-two',
  ]);
  assert.deepEqual(chapters[0].sections.map(({ id }) => id), ['a-advanced', 'a-basic']);
  assert.deepEqual(chapters[1].sections.map(({ id }) => id), ['b-intermediate', 'b-basic']);
});
