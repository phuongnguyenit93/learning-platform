import assert from 'node:assert/strict';
import test from 'node:test';
import { formatKnowledgeDisplayTitle } from '../../src/data/knowledge';

test('hides complete hierarchical lesson numbers from Knowledge titles', () => {
  assert.equal(formatKnowledgeDisplayTitle('1.1 Lập trình hướng đối tượng (OOP) là gì?'), 'Lập trình hướng đối tượng (OOP) là gì?');
  assert.equal(formatKnowledgeDisplayTitle('2.4.3 Advanced lesson'), 'Advanced lesson');
  assert.equal(formatKnowledgeDisplayTitle('1. Introduction'), 'Introduction');
  assert.equal(formatKnowledgeDisplayTitle('12) Appendix'), 'Appendix');
});

test('preserves numbers within genuine lesson titles', () => {
  assert.equal(formatKnowledgeDisplayTitle('Java 21 features'), 'Java 21 features');
  assert.equal(formatKnowledgeDisplayTitle('OOP 1.1 concepts'), 'OOP 1.1 concepts');
  assert.equal(formatKnowledgeDisplayTitle('  Encapsulation  '), 'Encapsulation');
});