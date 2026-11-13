import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { LearningLayout } from '../../src/pages/LearningLayout';
import { OverviewPage } from '../../src/pages/OverviewPage';
import { LearningPage } from '../../src/pages/LearningPage';
import { TopicIndexRedirect } from '../../src/pages/TopicIndexRedirect';
import {
  isTopicKnowledgePath,
  topicFromPathname,
  topicKnowledgePath,
  topicOverviewPath,
} from '../../src/data/topicRoutes';
import { LanguageProvider } from '../../src/state/LanguageContext';

const moduleNode = {
  id: 'JAVA_EXAMPLE', name: 'java-example', kind: 'MODULE',
  routeId: 'JAVA_EXAMPLE', path: '/module/java/example',
  hasContent: true, children: [],
};

function PathProbe() {
  const location = useLocation();
  return <output data-testid="pathname">{`${location.pathname}${location.search}${location.hash}`}</output>;
}

async function withApp(path: string, verify: (host: HTMLElement) => Promise<void>) {
  const browser = new Window({ url: 'http://localhost:5173' });
  const globals = {
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, Event: browser.Event, DOMParser: browser.DOMParser,
    MutationObserver: browser.MutationObserver, ResizeObserver: class { observe() {} disconnect() {} },
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const previous = Object.fromEntries(Object.keys(globals).map((key) =>
    [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }

  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url === '/module-navigation.json') {
      return new Response(JSON.stringify({
        version: 1, root: { id: 'root', name: 'root', kind: 'GROUP', children: [moduleNode] },
      }), { status: 200 });
    }
    if (url === '/module-details/JAVA_EXAMPLE.json') {
      return new Response(JSON.stringify(moduleNode), { status: 200 });
    }
    if (url === '/module-content-counts.json') {
      return new Response(JSON.stringify({ version: 1, locales: { vi: {}, en: {} } }), { status: 200 });
    }
    throw new Error(`Unexpected request: ${url}`);
  }) as typeof fetch;

  const host = browser.document.createElement('div');
  browser.document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[path]}>
          <PathProbe />
          <Routes>
            <Route path="/learning/:topicSlug" element={<LearningLayout />}>
              <Route index element={<TopicIndexRedirect />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="knowledge" element={<LearningPage />} />
              <Route path="knowledge/:moduleId" element={<LearningPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    ));
    await verify(host);
  } finally {
    await act(async () => root.unmount());
    await browser.happyDOM.abort();
    globalThis.fetch = originalFetch;
    for (const [key, descriptor] of Object.entries(previous)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

const pathOf = (host: HTMLElement) => host.querySelector('[data-testid="pathname"]')?.textContent;

test('topic route helpers preserve topic slug and reject malformed paths', () => {
  assert.equal(topicOverviewPath('nextjs'), '/learning/nextjs/overview');
  assert.equal(topicKnowledgePath('spring', 'JAVA_EXAMPLE'), '/learning/spring/knowledge/JAVA_EXAMPLE');
  assert.equal(topicFromPathname('/learning/react/overview'), 'react');
  assert.equal(topicFromPathname('/learning/react/knowledge/JAVA_EXAMPLE'), 'react');
  assert.equal(topicFromPathname('/learning/%XX/knowledge'), null);
  assert.equal(isTopicKnowledgePath('/learning/react/knowledge/JAVA_EXAMPLE'), true);
  assert.equal(isTopicKnowledgePath('/learning'), false);
});

test('Spring/React overview reuse the current Java overview while retaining topic navigation', async () => {
  for (const slug of ['spring', 'react']) {
    await withApp(`/learning/${slug}/overview`, async (host) => {
      assert.equal(pathOf(host), `/learning/${slug}/overview`);
      assert.match(host.textContent ?? '', /Roadmap của Java và Spring/);
      assert.equal(host.querySelector<HTMLAnchorElement>('.java-section-nav__tab[href$="/overview"]')?.getAttribute('href'),
        `/learning/${slug}/overview`);
      assert.equal(host.querySelector<HTMLAnchorElement>('.java-section-nav__tab[href$="/knowledge"]')?.getAttribute('href'),
        `/learning/${slug}/knowledge`);
      assert.equal(host.querySelector('.java-section-nav__context')?.textContent, slug.toUpperCase());
    });
  }
});

test('direct Spring Knowledge URL loads the current Java catalog but stays under Spring slug', async () => {
  await withApp('/learning/spring/knowledge', async (host) => {
    assert.equal(pathOf(host), '/learning/spring/knowledge/JAVA_EXAMPLE');
    assert.ok(host.querySelector('.learning-layout'));
    assert.equal(host.querySelector<HTMLAnchorElement>('.java-section-nav__tab[href$="/overview"]')?.getAttribute('href'),
      '/learning/spring/overview');
    assert.equal(host.querySelector<HTMLAnchorElement>('.java-section-nav__tab[aria-current="page"]')?.getAttribute('href'),
      '/learning/spring/knowledge/JAVA_EXAMPLE');
    await act(async () => host.querySelector<HTMLAnchorElement>('.java-section-nav__tab[href$="/overview"]')?.click());
    assert.equal(pathOf(host), '/learning/spring/overview');
    await act(async () => host.querySelector<HTMLAnchorElement>('.java-section-nav__tab[href*="/knowledge"]')?.click());
    assert.equal(pathOf(host), '/learning/spring/knowledge/JAVA_EXAMPLE');
  });
});

test('legacy uppercase module route stays compatible with Java Knowledge', async () => {
  await withApp('/learning/JAVA_EXAMPLE?tab=knowledge', async (host) => {
    assert.equal(pathOf(host), '/learning/java/knowledge/JAVA_EXAMPLE?tab=knowledge');
  });
});
