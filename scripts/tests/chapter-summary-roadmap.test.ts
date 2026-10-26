import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseChapterSummaryRoadmap } from '../../src/data/chapterSummaryRoadmap';

const sample = `# ĐÓNG GÓI — LIÊN KẾT BÀI HỌC

## 1. Mạch liên kết bài học

### Bài 1 — Ẩn thông tin và ranh giới

Bài này giúp người học **bảo vệ dữ liệu**.

Qua ShoppingCart, người học hiểu trách nhiệm của object.

↓ **Từ ranh giới API → xác định trạng thái phải bảo vệ**

### Bài 2 — Điều kiện bất biến

Bài này định nghĩa *invariant* và kiểm tra trạng thái hợp lệ.

## 2. Bảng đối chiếu các bài học

| Tiêu chí | Bài 1 | Bài 2 |
| --- | --- | --- |
| Kỹ năng | Ẩn thông tin | Giữ bất biến |
`;

test('extracts roadmap cards and connecting arrows without dropping Markdown or comparison table', () => {
  const roadmap = parseChapterSummaryRoadmap(sample);
  assert.ok(roadmap);
  assert.equal(roadmap.heading, 'Mạch liên kết bài học');
  assert.equal(roadmap.steps.length, 2);
  assert.deepEqual(roadmap.steps.map(({ number, title }) => [number, title]), [
    [1, 'Ẩn thông tin và ranh giới'],
    [2, 'Điều kiện bất biến'],
  ]);
  assert.match(roadmap.steps[0].description, /\*\*bảo vệ dữ liệu\*\*/);
  assert.match(roadmap.steps[0].description, /ShoppingCart/);
  assert.equal(roadmap.steps[0].transition, '**Từ ranh giới API → xác định trạng thái phải bảo vệ**');
  assert.equal(roadmap.steps[1].transition, null);
  assert.match(roadmap.comparisonMarkdown, /\| Kỹ năng \| Ẩn thông tin \| Giữ bất biến \|/);
});

test('returns the original Markdown path when outline format is missing or incomplete', () => {
  assert.equal(parseChapterSummaryRoadmap('# Giới thiệu\n\nChương chưa có liên kết bài học.'), null);
  assert.equal(parseChapterSummaryRoadmap(sample.replace('↓ **Từ ranh giới API → xác định trạng thái phải bảo vệ**', '')), null);
  assert.equal(parseChapterSummaryRoadmap(sample.replace('## 2. Bảng đối chiếu các bài học', '## Phần tiếp theo')), null);
});
