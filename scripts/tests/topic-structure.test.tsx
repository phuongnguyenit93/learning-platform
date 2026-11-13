import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { fetchTopicStructure } from '../../src/data/topicStructure';
import { BACKEND_API_BASE_URL } from '../../src/data/backendHealth';
import { TopicStructurePage } from '../../src/pages/TopicStructurePage';
import { LanguageProvider } from '../../src/state/LanguageContext';

const category = { id: 1, code: 'BACKEND', name: 'Backend', sortOrder: 0 };
const topics = [
  { id: 10, code: 'JAVA', slug: 'java', name: 'Java', description: null, iconSvg: '<svg/>', status: 'AVAILABLE', sortOrder: 0, category },
  { id: 20, code: 'SPRING', slug: 'spring', name: 'Spring', description: 'Spring ecosystem', iconSvg: '<svg/>', status: 'AVAILABLE', sortOrder: 1, category },
];

const structures = {
  java: {
    version: 1,
    root: {
      id: 'topic:10', name: 'Java', kind: 'GROUP', slug: 'java', children: [{
        nodeKey: 'JAVA_CORE', name: 'core', kind: 'GROUP', slug: 'java-core',
        path: '/module/java/java-core', children: [{
          nodeKey: 'JAVA_STREAM_API', name: 'stream-api', kind: 'MODULE',
          slug: 'java-stream-api', routeId: 'JAVA_STREAM_API',
          path: '/module/java/java-core/java-stream-api', children: [],
        }],
      }],
    },
  },
  spring: {
    version: 1,
    root: {
      id: 'topic:20', name: 'Spring', kind: 'GROUP', slug: 'spring', children: [{
        nodeKey: 'SPRING_BOOT', name: 'spring-boot', kind: 'GROUP', slug: 'spring-boot',
        path: '/module/spring/spring-boot', children: [{
          nodeKey: 'SPRING_BOOT_FUNDAMENTALS', name: 'fundamentals', kind: 'MODULE',
          slug: 'spring-boot-fundamentals', routeId: 'SPRING_BOOT_FUNDAMENTALS',
          path: '/module/spring/spring-boot/spring-boot-fundamentals', children: [],
        }],
      }],
    },
  },
};

function mockApi(requests: string[], structure = structures) {
  return (async (request: RequestInfo | URL) => {
    const url = String(request);
    requests.push(url);
    if (url === `${BACKEND_API_BASE_URL}/topics`) {
      return new Response(JSON.stringify(topics), { status: 200 });
    }
    if (url === `${BACKEND_API_BASE_URL}/topics/10/structure`) {
      return new Response(JSON.stringify(structure.java), { status: 200 });
    }
    if (url === `${BACKEND_API_BASE_URL}/topics/20/structure`) {
      return new Response(JSON.stringify(structure.spring), { status: 200 });
    }
    throw new Error(`Unexpected request: ${url}`);
  }) as typeof fetch;
}

test('loads only the selected topic and navigates using SLUG, never backend NODE_KEY', async () => {
  const oldFetch = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = mockApi(requests);
  try {
    const tree = await fetchTopicStructure('spring', new AbortController().signal);
    assert.equal(tree.root.name, 'Spring');
    assert.equal(tree.root.children[0].kind, 'GROUP');
    const module = tree.root.children[0].children[0];
    assert.equal(module.id, 'SPRING_BOOT_FUNDAMENTALS');
    assert.equal(module.nodeKey, 'SPRING_BOOT_FUNDAMENTALS');
    assert.equal(module.routeId, 'spring-boot-fundamentals');
    assert.equal(module.slug, 'spring-boot-fundamentals');
    assert.equal(module.knowledge, undefined);
    assert.equal(module.children.length, 0);
    assert.deepEqual(requests, [
      `${BACKEND_API_BASE_URL}/topics`,
      `${BACKEND_API_BASE_URL}/topics/20/structure`,
    ]);
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test('unknown Topic and duplicate structure slug fail closed rather than falling back to Java', async () => {
  const oldFetch = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = mockApi(requests);
  try {
    await assert.rejects(fetchTopicStructure('react', new AbortController().signal), /Topic not found: react/);
    assert.deepEqual(requests, [`${BACKEND_API_BASE_URL}/topics`]);
  } finally {
    globalThis.fetch = oldFetch;
  }

  const duplicate = structuredClone(structures);
  duplicate.spring.root.children.push({
    nodeKey: 'SPRING_SECOND_GROUP', name: 'another', kind: 'GROUP', slug: 'spring-boot',
    path: '/module/spring/spring-boot', children: [],
  });
  globalThis.fetch = mockApi([], duplicate);
  try {
    await assert.rejects(fetchTopicStructure('spring', new AbortController().signal), /Duplicate module slug/);
  } finally {
    globalThis.fetch = oldFetch;
  }
});

function PathProbe() {
  const { pathname } = useLocation();
  return <output data-testid="pathname">{pathname}</output>;
}

async function renderPage(path: string, verify: (host: HTMLElement, requests: string[]) => Promise<void>) {
  const browser = new Window({ url: 'http://localhost:5173' });
  const globals = {
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, Event: browser.Event,
    MutationObserver: browser.MutationObserver, ResizeObserver: class { observe() {} disconnect() {} },
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const previous = Object.fromEntries(Object.keys(globals).map((key) =>
    [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  const oldFetch = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = mockApi(requests);
  const host = browser.document.createElement('div');
  browser.document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[path]}>
          <PathProbe />
          <Routes>
            <Route path="/learning/:topicSlug/knowledge" element={<TopicStructurePage />} />
            <Route path="/learning/:topicSlug/knowledge/:moduleSlug" element={<TopicStructurePage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    ));
    await verify(host, requests);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    globalThis.fetch = oldFetch;
    for (const [key, descriptor] of Object.entries(previous)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

test('Spring Knowledge page selects database module by slug and never requests static Java documents', async () => {
  await renderPage('/learning/spring/knowledge', async (host, requests) => {
    assert.equal(host.querySelector('[data-testid="pathname"]')?.textContent,
      '/learning/spring/knowledge/spring-boot-fundamentals');
    assert.equal(host.querySelector('.module-id-badge')?.textContent, 'spring-boot-fundamentals');
    assert.match(host.textContent ?? '', /Spring Boot/);
    assert.match(host.textContent ?? '', /Nội dung đang được đồng bộ/);
    assert.equal(host.querySelector('.sidebar-module-count-notice'), null);
    assert.ok(host.querySelector('.module-tree'));
    assert.deepEqual(requests, [
      `${BACKEND_API_BASE_URL}/topics`,
      `${BACKEND_API_BASE_URL}/topics/20/structure`,
    ]);
  });
});

test('invalid slug does not redirect to a different module', async () => {
  await renderPage('/learning/java/knowledge/JAVA_STREAM_API', async (host) => {
    assert.equal(host.querySelector('[data-testid="pathname"]')?.textContent,
      '/learning/java/knowledge/JAVA_STREAM_API');
    assert.match(host.textContent ?? '', /Không tìm thấy module theo slug/);
  });
});
