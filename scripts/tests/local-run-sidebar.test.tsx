import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { Window } from 'happy-dom';
import { ModuleSidebar } from '../../src/components/ModuleSidebar';
import { LanguageProvider } from '../../src/state/LanguageContext';
import type { ModuleCatalogNode } from '../../src/types/learning';

const nodes = ['EMPTY', 'VALID'].map((id) => ({
  id, name: id, kind: 'MODULE', routeId: id, children: [],
  hasContent: true, roadmap: { vi: '/module/roadmap.json' },
} as ModuleCatalogNode));

test('Real modules toggle filters counted entries; errors retain the tree and support Retry', async (t) => {
  const browser = new Window({ url: 'http://localhost:5000' });
  const originals = new Map<string, PropertyDescriptor | undefined>();
  for (const [key, value] of Object.entries({
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, Event: browser.Event,
    MutationObserver: browser.MutationObserver, DOMException: browser.DOMException,
    IS_REACT_ACT_ENVIRONMENT: true,
  })) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  const container = browser.document.createElement('div');
  browser.document.body.append(container);
  const root = createRoot(container);
  t.after(async () => {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });
  let retried = 0;
  const draw = async (state: 'ready' | 'loading' | 'error') => {
    await act(async () => root.render(
      <MemoryRouter><LanguageProvider><ModuleSidebar
        nodes={nodes} activeModuleId="VALID" knowledgeCounts={{ VALID: 1 }}
        quizCounts={{}} interviewCounts={{}} apiCounts={{}} roadmapAvailability={{}}
        contentCountsState={state} onRetryContentCounts={() => { retried++; }}
      /></LanguageProvider></MemoryRouter>,
    ));
  };
  const labels = () => [...container.querySelectorAll('.module-tree__label')].map((node) => node.textContent);
  await draw('ready');
  assert.deepEqual(labels(), ['VALID'], 'a roadmap and hasContent cannot qualify EMPTY');
  const toggle = container.querySelector('[role="switch"]') as HTMLButtonElement;
  await act(async () => toggle.click());
  assert.deepEqual(labels(), ['EMPTY', 'VALID'], 'full tree still includes empty modules');
  await act(async () => toggle.click());
  assert.deepEqual(labels(), ['VALID']);
  await draw('loading');
  assert.deepEqual(labels(), ['EMPTY', 'VALID'], 'unknown is not the same as zero');
  await draw('error');
  assert.deepEqual(labels(), ['EMPTY', 'VALID']);
  assert.match(container.textContent ?? '', /không thể xác minh/i);
  const retry = [...container.querySelectorAll('button')].find((button) => button.textContent === 'Thử lại');
  assert.ok(retry);
  await act(async () => retry.click());
  assert.equal(retried, 1);
  await draw('ready');
  assert.deepEqual(labels(), ['VALID']);
});
