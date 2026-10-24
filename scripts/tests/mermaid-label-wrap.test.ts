import assert from 'node:assert/strict';
import { test } from 'node:test';
import { wrapMermaidLabel } from '../../src/data/mermaidLabelWrap';

const width = (text: string, size: number) => Array.from(text).reduce((sum, char) =>
  sum + (char === ' ' ? 0.34 : /[MW]/.test(char) ? 0.9 : 0.56) * size, 0);

test('long Vietnamese OOP lifecycle labels are wrapped inside the Mermaid node bounds', () => {
  const label = 'Chạy khởi tạo trường, khối khởi tạo và constructor theo quy tắc Java';
  const result = wrapMermaidLabel([label], 328, 100, width);
  assert.ok(result.lines.length >= 2, 'long text must wrap');
  assert.equal(result.lines.join(' '), label);
  for (const line of result.lines) assert.ok(width(line, result.fontSize) <= 312);
  assert.ok(result.lines.length * result.lineHeight <= 94);
});

test('short labels remain on one line and deliberate line breaks are preserved', () => {
  const short = wrapMermaidLabel(['Khởi tạo chuỗi lớp cha → lớp con'], 328, 100, width);
  assert.deepEqual(short.lines, ['Khởi tạo chuỗi lớp cha → lớp con']);
  assert.equal(short.fontSize, 16);
  const split = wrapMermaidLabel(['Parent constructor', 'Child constructor'], 328, 100, width);
  assert.deepEqual(split.lines, ['Parent constructor', 'Child constructor']);
});

test('unbroken class names are divided rather than rendered across adjacent boxes', () => {
  const result = wrapMermaidLabel(['ExtremelyLongJavaIdentifierWithoutAnySpaces'], 96, 90, width);
  assert.ok(result.lines.length > 1);
  assert.equal(result.lines.join(''), 'ExtremelyLongJavaIdentifierWithoutAnySpaces');
  for (const line of result.lines) assert.ok(width(line, result.fontSize) <= 80);
});
