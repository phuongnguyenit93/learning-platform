import assert from 'node:assert/strict';
import test from 'node:test';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { Window } from 'happy-dom';
import { ModuleSidebar } from '../../src/components/ModuleSidebar';
import { LanguageProvider } from '../../src/state/LanguageContext';
import type { ModuleCatalogNode } from '../../src/types/learning';

const structure = {
  topicId: 60, revision: 'revision-1', nodes: [
    { kind: 'GROUP', id: 200, name: 'Group A', slug: 'group-a', active: true, children: [
      { kind: 'GROUP', id: 201, name: 'Group B', slug: 'group-b', active: false, children: [] },
    ] },
    { kind: 'MODULE', id: 301, name: 'Module C', slug: 'module-c', active: false, children: [] },
  ],
};
const publicNodes: ModuleCatalogNode[] = [
  { id: 'GROUP_200', name: 'Group A', kind: 'GROUP', children: [] },
];

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
    assert.deepEqual(payload.nodes.map((node: { id: number }) => node.id), [301, 200]);
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
