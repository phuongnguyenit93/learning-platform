import assert from 'node:assert/strict';
import { test } from 'node:test';
import { legacyChapterSummaryRoadmap } from '../../src/data/legacyChapterSummaryRoadmap';

const markdown = `# TƯ DUY OOP — LIÊN KẾT BÀI HỌC

## 1. Mạch liên kết bài học

### Bài 1 — OOP là gì?

Nhận diện bài toán **tổ chức hệ thống**.

↓ **Từ hệ thống → đối tượng**

### Bài 2 — Đối tượng và trách nhiệm

Phân tích trạng thái và invariant.

## 2. Bảng đối chiếu các bài học

| Tiêu chí | Bài 1 | Bài 2 |
| --- | --- | --- |
| Kỹ năng | OOP | Đối tượng |`;

const summaries = [
  { id: 'oop-basic-001', title: 'OOP là gì?', summary: 'Bài 1' },
  { id: 'oop-basic-002', title: 'Đối tượng', summary: 'Bài 2' },
];

test('older Markdown releases still produce roadmap cards and connectors', () => {
  const parsed = legacyChapterSummaryRoadmap(markdown, summaries);
  assert.ok(parsed);
  assert.equal(parsed.type, 'LEARNING_ROADMAP');
  assert.equal(parsed.roadmapHeading, 'Mạch liên kết bài học');
  assert.equal(parsed.roadmap.length, 2);
  assert.equal(parsed.roadmap[0].id, 'oop-basic-001');
  assert.match(parsed.roadmap[0].description, /\*\*tổ chức hệ thống\*\*/);
  assert.deepEqual(parsed.roadmap[0].transition, {
    to: 'oop-basic-002', description: '**Từ hệ thống → đối tượng**',
  });
  assert.equal(parsed.roadmap[1].transition, null);
  assert.match(parsed.comparisonMarkdown, /\| Kỹ năng \| OOP \| Đối tượng \|/);
});

test('incomplete legacy Markdown cannot silently become a partial roadmap', () => {
  assert.equal(legacyChapterSummaryRoadmap(markdown, summaries.slice(0, 1)), null);
  assert.equal(legacyChapterSummaryRoadmap(markdown.replace('↓ **Từ hệ thống → đối tượng**', ''), summaries), null);
});
