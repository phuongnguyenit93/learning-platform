import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createGroup, editGroup, editModule, fetchAdminStructure, moveTreeNode, projectAdminNodes, saveAdminStructure,
  type AdminTreeNode,
} from '../../src/data/groupAdmin';

const tree: AdminTreeNode[] = [
  { kind: 'GROUP', id: 1, name: 'A', slug: 'a', active: true, children: [
    { kind: 'GROUP', id: 2, name: 'B', slug: 'b', active: false, children: [] },
    { kind: 'MODULE', id: 10, name: 'Java', slug: 'java', active: true, children: [] },
  ] },
  { kind: 'MODULE', id: 11, name: 'Spring', slug: 'spring', active: false, children: [] },
];

test('moves groups and modules into other groups, to topic root and among siblings', () => {
  const into = moveTreeNode(tree, { kind: 'MODULE', id: 11 }, { kind: 'GROUP', id: 2 }, 'inside');
  assert.ok(into);
  assert.deepEqual(into[0].children[0].children.map((node) => node.id), [11]);
  assert.equal(tree[0].children[0].children.length, 0, 'moving must not mutate source');

  const toRoot = moveTreeNode(tree, { kind: 'GROUP', id: 2 }, null, 'inside');
  assert.ok(toRoot);
  assert.deepEqual(toRoot.map((node) => node.id), [1, 11, 2]);
  const reorder = moveTreeNode(tree, { kind: 'MODULE', id: 10 }, { kind: 'GROUP', id: 2 }, 'before');
  assert.ok(reorder);
  assert.deepEqual(reorder[0].children.map((node) => node.id), [10, 2]);
  const after = moveTreeNode(tree, { kind: 'GROUP', id: 2 }, { kind: 'MODULE', id: 11 }, 'after');
  assert.ok(after);
  assert.deepEqual(after.map((node) => node.id), [1, 11, 2]);
});

test('rejects self/descendant targets and prevents moving into a module', () => {
  assert.equal(moveTreeNode(tree, { kind: 'GROUP', id: 1 }, { kind: 'GROUP', id: 2 }, 'inside'), null);
  assert.equal(moveTreeNode(tree, { kind: 'GROUP', id: 2 }, { kind: 'GROUP', id: 2 }, 'after'), null);
  assert.equal(moveTreeNode(tree, { kind: 'GROUP', id: 2 }, { kind: 'MODULE', id: 11 }, 'inside'), null);
  assert.equal(moveTreeNode(tree, { kind: 'MODULE', id: 42 }, null, 'inside'), null);
});

test('admin nodes map to sidebar nodes with G/M identity and inactive state', () => {
  const projected = projectAdminNodes(tree);
  assert.equal(projected[0].id, 'GROUP_1');
  assert.equal(projected[0].children[0].active, false);
  assert.equal(projected[0].children[1].kind, 'MODULE');
  assert.equal(projected[0].children[1].routeId, 'java');
  assert.equal(projected[1].id, 'PLACEMENT_11');
});

test('admin group calls include cookie/CSRF and save only compact positional nodes', async () => {
  const originalFetch = globalThis.fetch;
  const calls: Array<{ url: string; init: RequestInit }> = [];
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    if (String(url).endsWith('/api/auth/csrf')) {
      return new Response(JSON.stringify({ token: 'csrf-example', headerName: 'X-CSRF-TOKEN' }), { status: 200 });
    }
    return new Response(JSON.stringify({ topicId: 60, revision: 'abc', nodes: tree }), { status: 200 });
  }) as typeof fetch;
  try {
    await fetchAdminStructure(60);
    await createGroup(60, { name: 'New', slug: 'new', active: true }, 'abc');
    await editGroup(1, { name: 'Edited', slug: 'edited', active: false }, 'abc');
    await saveAdminStructure(60, 'old-revision', tree);
    assert.deepEqual(calls.filter((call) => call.url.includes('/api/admin/')).map((call) => call.url), [
      'https://api.nguyendodinhphuong.name.vn/api/admin/topics/60/structure',
      'https://api.nguyendodinhphuong.name.vn/api/admin/topics/60/groups',
      'https://api.nguyendodinhphuong.name.vn/api/admin/groups/1',
      'https://api.nguyendodinhphuong.name.vn/api/admin/topics/60/structure',
    ]);
    assert.equal(calls[0].init.credentials, 'include');
    const writes = calls.filter((call) => call.init.method === 'POST' || call.init.method === 'PUT');
    assert.equal(writes.length, 3);
    assert.ok(writes.every((call) => call.init.credentials === 'include'
      && new Headers(call.init.headers).get('X-CSRF-TOKEN') === 'csrf-example'));
    assert.ok(writes.slice(0, 2).every((call) => JSON.parse(String(call.init.body)).revision === 'abc'));
    const saved = JSON.parse(String(writes[2].init.body));
    assert.equal(saved.revision, 'old-revision');
    assert.deepEqual(Object.keys(saved.nodes[0]).sort(), ['children', 'id', 'kind']);
    assert.deepEqual(Object.keys(saved.nodes[0].children[0]).sort(), ['children', 'id', 'kind']);
  } finally { globalThis.fetch = originalFetch; }
});

test('a 409 conflict is surfaced without retrying or overwriting the tree', async () => {
  const originalFetch = globalThis.fetch;
  let mutations = 0;
  globalThis.fetch = (async (url: RequestInfo | URL) => {
    if (String(url).endsWith('/api/auth/csrf')) {
      return new Response(JSON.stringify({ token: 'token', headerName: 'X-CSRF-TOKEN' }), { status: 200 });
    }
    mutations += 1;
    return new Response(null, { status: 409 });
  }) as typeof fetch;
  try {
    await assert.rejects(saveAdminStructure(60, 'stale', tree), /tải lại/);
    assert.equal(mutations, 1);
  } finally { globalThis.fetch = originalFetch; }
});

test('editing Module metadata uses placement ID, CSRF/revision, and only name and slug', async () => {
  const originalFetch = globalThis.fetch;
  const writes: Array<{ url: string; init?: RequestInit }> = [];
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    if (String(url).endsWith('/api/auth/csrf')) {
      return new Response(JSON.stringify({ token: 'module-csrf', headerName: 'X-CSRF-TOKEN' }), { status: 200 });
    }
    writes.push({ url: String(url), init });
    return new Response(JSON.stringify({ moduleId: 101, placementId: 301, topicId: 60,
      name: 'Module C updated', slug: 'module-c-updated' }), { status: 200 });
  }) as typeof fetch;
  try {
    const result = await editModule(301, { name: 'Module C updated', slug: 'module-c-updated' }, 'rev-1');
    assert.equal(result.slug, 'module-c-updated');
    assert.equal(result.placementId, 301);
    assert.equal(writes.length, 1);
    assert.equal(writes[0].url, 'https://api.nguyendodinhphuong.name.vn/api/admin/module-placements/301/module');
    assert.equal(writes[0].init?.method, 'PUT');
    assert.equal(writes[0].init?.credentials, 'include');
    assert.equal(new Headers(writes[0].init?.headers).get('X-CSRF-TOKEN'), 'module-csrf');
    assert.deepEqual(JSON.parse(String(writes[0].init?.body)),
      { name: 'Module C updated', slug: 'module-c-updated', revision: 'rev-1' });
  } finally { globalThis.fetch = originalFetch; }
});

test('editing Module with a stale revision returns conflict without retry', async () => {
  const originalFetch = globalThis.fetch;
  let mutations = 0;
  globalThis.fetch = (async (url: RequestInfo | URL) => {
    if (String(url).endsWith('/api/auth/csrf')) {
      return new Response(JSON.stringify({ token: 'token', headerName: 'X-CSRF-TOKEN' }), { status: 200 });
    }
    mutations += 1;
    return new Response(null, { status: 409 });
  }) as typeof fetch;
  try {
    await assert.rejects(editModule(301, { name: 'Changed', slug: 'changed' }, 'stale'), /tải lại/);
    assert.equal(mutations, 1);
  } finally { globalThis.fetch = originalFetch; }
});
