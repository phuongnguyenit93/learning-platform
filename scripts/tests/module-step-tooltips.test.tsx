import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { Window } from 'happy-dom';
import { ModuleSidebar } from '../../src/components/ModuleSidebar';
import { getModuleStepTooltip, MODULE_STEP_TOOLTIPS } from '../../src/data/moduleStepTooltips';
import { LanguageProvider } from '../../src/state/LanguageContext';
import type { ModuleCatalogNode } from '../../src/types/learning';

test('every documented step has VI and EN text; STEP 0 stays hidden', () => {
  const stages = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '12A', '13', '14', '15', 'FINAL'];
  assert.deepEqual(new Set(Object.keys(MODULE_STEP_TOOLTIPS)), new Set(stages));
  for (const step of stages) {
    for (const language of ['vi', 'en'] as const) {
      assert.ok(getModuleStepTooltip(step, language)?.trim(), `${step} missing ${language}`);
    }
  }
  assert.equal(getModuleStepTooltip('0', 'vi'), null);
  assert.equal(getModuleStepTooltip(undefined, 'en'), null);
  assert.match(getModuleStepTooltip('2', 'vi') ?? '', /Roadmap.*Reference/);
  assert.match(getModuleStepTooltip('12A', 'en') ?? '', /Vietnamese.*English/);
  assert.match(getModuleStepTooltip('13', 'en') ?? '', /Vietnamese.*English/);
  assert.match(getModuleStepTooltip('12A', 'vi') ?? '', /mã cũ 12A/);
  assert.match(getModuleStepTooltip('FINAL', 'vi') ?? '', /commit.*push/);
  assert.match(getModuleStepTooltip('8', 'vi') ?? '', /chưa có mô tả chính thức/);
  assert.match(getModuleStepTooltip('99', 'en') ?? '', /No official description/);
});

test('module picker displays per-step hover tooltip without showing Step 0', async () => {
  const browser = new Window({ url: 'http://localhost:5000' });
  const originals = new Map<string, PropertyDescriptor | undefined>();
  for (const [key, value] of Object.entries({
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, Node: browser.Node, Event: browser.Event,
    MouseEvent: browser.MouseEvent, CustomEvent: browser.CustomEvent,
    MutationObserver: browser.MutationObserver, DOMException: browser.DOMException,
    IS_REACT_ACT_ENVIRONMENT: true,
  })) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  const container = browser.document.createElement('div');
  browser.document.body.append(container);
  const root = createRoot(container);
  try {
    const nodes: ModuleCatalogNode[] = [{
      id: 'GROUP', name: 'Paradigm', kind: 'GROUP', children: [
        { id: 'OOP', name: 'object-oriented', kind: 'MODULE', routeId: 'OOP', currentStep: '5', children: [] },
        { id: 'DONE', name: 'complete', kind: 'MODULE', routeId: 'DONE', currentStep: 'FINAL', children: [] },
        { id: 'NEW', name: 'new', kind: 'MODULE', routeId: 'NEW', currentStep: '0', children: [] },
      ],
    }];
    await act(async () => root.render(
      <MemoryRouter><LanguageProvider><ModuleSidebar
        nodes={nodes} activeModuleId="OOP" knowledgeCounts={{ OOP: 1, DONE: 1, NEW: 1 }}
        quizCounts={{}} interviewCounts={{}} apiCounts={{}} roadmapAvailability={{}}
        contentCountsState="ready" onRetryContentCounts={() => {}}
      /></LanguageProvider></MemoryRouter>,
    ));

    const picker = container.querySelector('.module-tree__picker-zone') as HTMLButtonElement | null;
    assert.ok(picker, 'Missing module picker');
    await act(async () => picker.click());
    const popup = browser.document.querySelector('.module-picker');
    assert.ok(popup, 'Picker did not open');
    const stepLabels = [...popup.querySelectorAll('.module-picker__step')].map((node) => node.textContent);
    assert.deepEqual(stepLabels, ['Step 5', 'Finished']);
    const anchor = popup.querySelector('.custom-tooltip-anchor');
    assert.ok(anchor);
    await act(async () => {
      anchor.dispatchEvent(new browser.MouseEvent('mouseover', { bubbles: true }));
    });
    const tooltip = browser.document.querySelector('[role="tooltip"]');
    assert.ok(tooltip, 'Hover did not open tooltip');
    assert.equal(tooltip.textContent, getModuleStepTooltip('5', 'vi'));
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
