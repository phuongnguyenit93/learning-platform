import assert from 'node:assert/strict';
import test from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { Window } from 'happy-dom';
import { ModuleSidebar } from '../../src/components/ModuleSidebar';
import { dragScrollStep, rowDropPosition } from '../../src/components/GroupAdminDialogs';
import { LanguageProvider } from '../../src/state/LanguageContext';
import type { ModuleCatalogNode } from '../../src/types/learning';

const structure = {
  topicId: 60, revision: 'revision-1', nodes: [
    { kind: 'GROUP', id: 200, name: 'Group A', slug: 'group-a', active: true, children: [
      { kind: 'GROUP', id: 201, name: 'Group B', slug: 'group-b', active: false, children: [] },
    ] },
    { kind: 'MODULE', id: 301, name: 'Module C', slug: 'module-c', active: false, children: [] },
    { kind: 'GROUP', id: 202, name: 'Group D', slug: 'group-d', active: true, children: [
      { kind: 'MODULE', id: 302, name: 'Module E', slug: 'module-e', active: true, children: [] },
    ] },
    { kind: 'MODULE', id: 303, name: 'Module F', slug: 'module-f', active: true, children: [] },
    { kind: 'GROUP', id: 203, name: 'Group G', slug: 'group-g', active: true, children: [] },
    { kind: 'MODULE', id: 304, name: 'Module H', slug: 'module-h', active: true, children: [] },
    { kind: 'MODULE', id: 305, name: 'Module I', slug: 'module-i', active: true, children: [] },
  ],
};
const publicNodes: ModuleCatalogNode[] = [
  { id: 'GROUP_200', name: 'Group A', kind: 'GROUP', children: [] },
];

test('row-wide drop positions and scroll edges are consistent for Groups and Modules', () => {
  assert.equal(rowDropPosition('GROUP', 110, 100, 100), 'before');
  assert.equal(rowDropPosition('GROUP', 150, 100, 100), 'inside');
  assert.equal(rowDropPosition('GROUP', 190, 100, 100), 'after');
  assert.equal(rowDropPosition('MODULE', 120, 100, 100), 'before');
  assert.equal(rowDropPosition('MODULE', 180, 100, 100), 'after');
  assert.ok(dragScrollStep(102, 100, 500) < 0);
  assert.equal(dragScrollStep(300, 100, 500), 0);
  assert.ok(dragScrollStep(498, 100, 500) > 0);
  assert.equal(dragScrollStep(520, 100, 500), 0);
});

test('sidebar only shows Group admin actions for ADMIN and opens add/edit/modify dialogs', async () => {
  const browser = new Window({ url: 'http://localhost:5173' });
  const globals = {
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, Node: browser.Node,
    Event: browser.Event, CustomEvent: browser.CustomEvent, KeyboardEvent: browser.KeyboardEvent,
    MutationObserver: browser.MutationObserver, DOMException: browser.DOMException,
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const originalGlobals = Object.fromEntries(Object.keys(globals).map((key) =>
    [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  const previousFetch = globalThis.fetch;
  let isAdmin = false;
  let reloaded = 0;
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    if (String(url).endsWith('/api/auth/me')) return isAdmin
      ? new Response(JSON.stringify({ id: 1, email: 'admin@example.com', roles: ['ADMIN'], name: 'Admin' }), { status: 200 })
      : new Response(null, { status: 401 });
    if (String(url).endsWith('/api/admin/topics/60/structure') && (!init?.method || init.method === 'GET')) {
      return new Response(JSON.stringify(structure), { status: 200 });
    }
    if (String(url).endsWith('/api/auth/csrf')) {
      return new Response(JSON.stringify({ token: 'csrf', headerName: 'X-CSRF-TOKEN' }), { status: 200 });
    }
    if (String(url).endsWith('/api/admin/topics/60/structure') && init?.method === 'PUT') {
      return new Response(JSON.stringify({ ...structure, revision: 'revision-2' }), { status: 200 });
    }
    throw new Error(`Unexpected API request ${String(url)}`);
  }) as typeof fetch;
  const host = browser.document.createElement('div');
  browser.document.body.append(host);
  const root = createRoot(host);
  const draw = async (topicId: number) => {
    await act(async () => {
      root.render(<MemoryRouter><LanguageProvider><ModuleSidebar
        nodes={publicNodes} topicId={topicId} activeModuleId="" enableRealModulesFilter={false}
        knowledgeCounts={{}} quizCounts={{}} interviewCounts={{}} caseStudyCounts={{}}
        roadmapAvailability={{}} contentCountsState="ready" onRetryContentCounts={() => {}}
        onStructureChanged={() => { reloaded += 1; }}
      /></LanguageProvider></MemoryRouter>);
      await new Promise((resolve) => setTimeout(resolve, 5));
    });
  };
  try {
    await draw(60);
    assert.equal(host.querySelector('.module-group-admin-actions'), null);
    assert.equal(host.querySelector('.group-node-badge')?.textContent, 'G');
    assert.equal(host.querySelector('.module-tree__edit-group'), null);

    isAdmin = true;
    await draw(61);
    await draw(60);
    assert.ok(host.querySelector('.module-group-admin-actions'));
    assert.match(host.textContent ?? '', /Group B/);
    assert.match(host.textContent ?? '', /INACTIVE/);
    assert.ok(host.querySelectorAll('.group-node-badge').length >= 3);

    const add = [...host.querySelectorAll<HTMLButtonElement>('.module-group-admin-actions button')]
      .find((button) => button.textContent?.includes('Add Group'));
    assert.ok(add);
    await act(async () => add.click());
    let dialog = browser.document.querySelector<HTMLElement>('.group-form-dialog');
    assert.ok(dialog);
    assert.match(dialog.textContent ?? '', /Group cấp 1/);
    assert.equal(dialog.querySelector('select'), null);
    await act(async () => dialog?.querySelector<HTMLButtonElement>('.catalog-editor__close')?.click());

    const edit = [...host.querySelectorAll<HTMLButtonElement>('.module-tree__edit-group')]
      .find((button) => button.getAttribute('aria-label') === 'Edit Group Group B');
    assert.ok(edit);
    await act(async () => edit.click());
    dialog = browser.document.querySelector<HTMLElement>('.group-form-dialog');
    assert.ok(dialog);
    assert.equal(dialog.querySelectorAll<HTMLInputElement>('input')[0].value, 'Group B');
    assert.equal(dialog.querySelectorAll<HTMLInputElement>('input')[1].value, 'group-b');
    assert.equal(dialog.querySelector<HTMLInputElement>('input[type=checkbox]')?.checked, false);
    await act(async () => dialog?.querySelector<HTMLButtonElement>('.catalog-editor__close')?.click());

    const modify = [...host.querySelectorAll<HTMLButtonElement>('.module-group-admin-actions button')]
      .find((button) => button.textContent?.includes('Modify Group'));
    assert.ok(modify);
    await act(async () => modify.click());
    const treeDialog = browser.document.querySelector<HTMLElement>('.group-tree-editor');
    assert.ok(treeDialog);
    assert.ok([...treeDialog.querySelectorAll('button')].find((button) => button.textContent === 'Save Changes')?.disabled);
    const groupAToggle = treeDialog.querySelector<HTMLButtonElement>('button[aria-label="Collapse Group A"]');
    assert.ok(groupAToggle);
    await act(async () => groupAToggle.click());
    assert.equal(treeDialog.querySelector('button[aria-label="Expand Group A"]')?.getAttribute('aria-expanded'), 'false');
    assert.doesNotMatch(treeDialog.textContent ?? '', /Group B/);
    assert.ok([...treeDialog.querySelectorAll('button')].find((button) => button.textContent === 'Save Changes')?.disabled);
    await act(async () => treeDialog.querySelector<HTMLButtonElement>('button[aria-label="Expand Group A"]')?.click());
    assert.match(treeDialog.textContent ?? '', /Group B/);
    const collapseAll = [...treeDialog.querySelectorAll<HTMLButtonElement>('.group-tree-editor__tools button')]
      .find((button) => button.textContent?.includes('Thu gọn tất cả'));
    assert.ok(collapseAll);
    await act(async () => collapseAll.click());
    assert.doesNotMatch(treeDialog.textContent ?? '', /Group B/);
    await act(async () => [...treeDialog.querySelectorAll<HTMLButtonElement>('.group-tree-editor__tools button')]
      .find((button) => button.textContent?.includes('Mở tất cả'))?.click());
    assert.match(treeDialog.textContent ?? '', /Group B/);

    // Drag a node at the very bottom of a long tree onto the middle of a Group row.
    // The Group row itself must be a target, not just the narrow gaps around it.
    const fromRow = [...treeDialog.querySelectorAll<HTMLElement>('.group-tree-editor__row')]
      .find((row) => row.textContent?.includes('Module I'));
    const toRow = [...treeDialog.querySelectorAll<HTMLElement>('.group-tree-editor__row')]
      .find((row) => row.textContent?.includes('Group D'));
    assert.ok(fromRow && toRow);
    const eventData = { setData() {}, effectAllowed: 'move', dropEffect: 'move' };
    const dragEvent = (name: string, clientY: number) => {
      const event = new browser.Event(name, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'dataTransfer', { value: eventData });
      Object.defineProperty(event, 'clientY', { value: clientY });
      return event;
    };
    await act(async () => { fromRow.dispatchEvent(dragEvent('dragstart', 200)); });
    const scrollArea = treeDialog.querySelector<HTMLElement>('.group-tree-editor__tree');
    assert.ok(scrollArea);
    scrollArea.getBoundingClientRect = () => ({ top: 100, bottom: 400, left: 0, right: 700,
      width: 700, height: 300, x: 0, y: 100, toJSON() {} });
    await act(async () => {
      scrollArea.dispatchEvent(dragEvent('dragover', 390));
      await new Promise((resolve) => setTimeout(resolve, 55));
    });
    assert.ok(scrollArea.scrollTop > 0, 'dragging near bottom should auto-scroll the tree');
    await act(async () => { toRow.dispatchEvent(dragEvent('drop', 200)); });
    const groupDNode = [...treeDialog.querySelectorAll<HTMLElement>('.group-tree-editor__node')]
      .find((element) => element.querySelector(':scope > .group-tree-editor__row')?.textContent?.includes('Group D'));
    assert.ok(groupDNode);
    assert.match(groupDNode.textContent ?? '', /Module I/);
    assert.equal(treeDialog.querySelector('button[aria-label="Expand Group D"]'), null);
    await act(async () => [...treeDialog.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent === 'Reset Changes')?.click());
    assert.ok([...treeDialog.querySelectorAll('button')].find((button) => button.textContent === 'Save Changes')?.disabled);

    // Collapsed Groups still accept other Groups, including their entire subtree.
    await act(async () => treeDialog.querySelector<HTMLButtonElement>('button[aria-label="Collapse Group A"]')?.click());
    const fromGroup = [...treeDialog.querySelectorAll<HTMLElement>('.group-tree-editor__row')]
      .find((row) => row.textContent?.includes('Group G'));
    const targetGroup = [...treeDialog.querySelectorAll<HTMLElement>('.group-tree-editor__row')]
      .find((row) => row.textContent?.includes('Group A'));
    assert.ok(fromGroup && targetGroup);
    await act(async () => { fromGroup.dispatchEvent(dragEvent('dragstart', 200)); });
    await act(async () => { targetGroup.dispatchEvent(dragEvent('drop', 200)); });
    assert.equal(treeDialog.querySelector('button[aria-label="Expand Group A"]'), null,
      'dropping inside collapsed Group auto-expands it');
    const groupANode = [...treeDialog.querySelectorAll<HTMLElement>('.group-tree-editor__node')]
      .find((element) => element.querySelector(':scope > .group-tree-editor__row')?.textContent?.includes('Group A'));
    assert.ok(groupANode);
    assert.match(groupANode.textContent ?? '', /Group G/);
    await act(async () => [...treeDialog.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent === 'Reset Changes')?.click());

    const up = treeDialog.querySelector<HTMLButtonElement>('button[aria-label="Move Module C up"]');
    assert.ok(up);
    await act(async () => up.click());
    const save = [...treeDialog.querySelectorAll<HTMLButtonElement>('button')]
      .find((button) => button.textContent === 'Save Changes');
    assert.ok(save);
    assert.equal(save.disabled, false);
    await act(async () => save.click());
    const request = calls.find((call) => call.init?.method === 'PUT');
    assert.ok(request);
    const payload = JSON.parse(String(request.init?.body));
    assert.deepEqual(payload.nodes.map((node: { id: number }) => node.id), [301, 200, 202, 303, 203, 304, 305]);
    assert.equal(reloaded, 1);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    globalThis.fetch = previousFetch;
    for (const [key, descriptor] of Object.entries(originalGlobals)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
