import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MermaidMarkdown } from '../../src/components/MermaidMarkdown';

const fence = String.fromCharCode(96).repeat(3);
const tick = String.fromCharCode(96);

function render(markdown: string): string {
  return renderToStaticMarkup(createElement(MermaidMarkdown, null, markdown));
}

test('Mermaid fences use the diagram renderer instead of a source code block', () => {
  const html = render('Before\n\n' + fence + 'mermaid\nflowchart TD\nA["Start"] --> B["Done"]\n' + fence + '\n\nAfter');
  assert.match(html, /class="mermaid-diagram"/);
  assert.match(html, /Rendering diagram/);
  assert.doesNotMatch(html, /language-mermaid/);
  assert.match(html, /Before/);
  assert.match(html, /After/);
});

test('Other fenced languages and inline code retain the default Markdown renderer', () => {
  const html = render('Use ' + tick + 'mermaid' + tick + ' inline.\n\n' + fence + 'java\nSystem.out.println("Hello");\n' + fence);
  assert.match(html, /<pre><code class="language-java">/);
  assert.match(html, /System\.out\.println/);
  assert.match(html, /<code>mermaid<\/code>/);
  assert.doesNotMatch(html, /mermaid-diagram/);
});

test('Mermaid syntax in a plain code block is not rendered as a diagram', () => {
  const html = render(fence + '\nflowchart TD\nA --> B\n' + fence);
  assert.match(html, /<pre><code>/);
  assert.doesNotMatch(html, /mermaid-diagram/);
});