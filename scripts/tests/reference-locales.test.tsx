import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { stringify } from 'yaml';
import { LearningPage } from '../../src/pages/LearningPage';
import { toLearningModule } from '../../src/data/moduleCatalog';
import { LanguageProvider, useLanguage } from '../../src/state/LanguageContext';
import type { ModuleCatalogNode } from '../../src/types/learning';

function SwitchLanguage() {
  const { language, toggleLanguage } = useLanguage();
  return <button type="button" data-testid="switch-language" onClick={toggleLanguage}>{language}</button>;
}

async function withReferencePage(
  route: string,
  reference: ModuleCatalogNode['reference'],
  referenceResponse: (url: string) => Promise<Response> | Response,
  verify: (host: HTMLElement, requests: string[]) => Promise<void>,
) {
  const browser = new Window({ url: 'http://localhost:5000' });
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

  const node: ModuleCatalogNode = {
    id: route, name: 'reference-locales', kind: 'MODULE', routeId: route,
    path: '/module/reference-locales', hasContent: true, reference, children: [],
  };
  const requests: string[] = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (request: RequestInfo | URL) => {
    const url = String(request);
    requests.push(url);
    const json = (value: unknown) => new Response(JSON.stringify(value), { status: 200 });
    if (url === '/module-navigation.json') return json({
      version: 1, root: { id: 'root', name: 'root', kind: 'GROUP', children: [node] },
    });
    if (url === `/module-details/${route}.json`) return json(node);
    if (url === '/module-content-counts.json') return json({
      version: 1, locales: {
        vi: { [route]: { knowledge: 1, quiz: 0, interview: 0, casestudy: 0 } },
        en: { [route]: { knowledge: 1, quiz: 0, interview: 0, casestudy: 0 } },
      },
    });
    if (url.includes('/reference/')) return referenceResponse(url);
    throw new Error(`Unexpected fetch: ${url}`);
  }) as typeof fetch;

  const host = browser.document.createElement('main');
  browser.document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(
      <LanguageProvider>
        <SwitchLanguage />
        <MemoryRouter initialEntries={[`/learning/java/knowledge/${route}`]}>
          <Routes><Route path="/learning/java/knowledge/:moduleId" element={<LearningPage />} /></Routes>
        </MemoryRouter>
      </LanguageProvider>,
    ));
    await verify(host, requests);
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

test('Reference loads the selected locale and never displays previous-language data during a pending request', async () => {
  const route = 'REFERENCE_LOCALES_BOTH';
  const viPath = `/module/${route}/reference/vi/references.yml`;
  const enPath = `/module/${route}/reference/en/references.yml`;
  const reference = { vi: viPath, en: enPath };
  assert.deepEqual(toLearningModule({
    id: route, name: 'test', kind: 'MODULE', routeId: route, children: [], reference,
  }, { knowledge: 0, quiz: 0, interview: 0 }).reference, reference);

  let releaseEnglish!: (value: Response) => void;
  const pendingEnglish = new Promise<Response>((resolve) => { releaseEnglish = resolve; });
  await withReferencePage(route, reference, (url) => {
    if (url.endsWith(viPath)) return new Response(stringify({
      references: [{ title: 'Tài liệu tiếng Việt', url: 'https://vi.example.test' }],
    }), { status: 200 });
    if (url.endsWith(enPath)) return pendingEnglish;
    throw new Error(`Wrong locale request: ${url}`);
  }, async (host, requests) => {
    const referenceTab = () => host.querySelector<HTMLButtonElement>('.module-tabs__button--reference');
    const switchLanguage = () => host.querySelector<HTMLButtonElement>('[data-testid="switch-language"]');

    await act(async () => referenceTab()?.click());
    assert.equal(referenceTab()?.getAttribute('aria-selected'), 'true');
    assert.match(host.querySelector('.reference-panel')?.textContent ?? '', /Tài liệu tiếng Việt/);
    assert.deepEqual(requests.filter((url) => url.includes('/reference/')),
      [`/language/java${viPath}`]);

    await act(async () => switchLanguage()?.click());
    assert.equal(switchLanguage()?.textContent, 'en');
    assert.equal(referenceTab()?.getAttribute('aria-selected'), 'true');
    assert.equal(host.querySelector('.reference-panel'), null,
      'VI content must disappear immediately when EN is still loading');
    assert.match(host.textContent ?? '', /Loading references/);
    assert.deepEqual(requests.filter((url) => url.includes('/reference/')),
      [`/language/java${viPath}`, `/language/java${enPath}`]);

    await act(async () => releaseEnglish(new Response(stringify({
      references: [{ title: 'English documentation', url: 'https://en.example.test' }],
    }), { status: 200 })));
    assert.match(host.querySelector('.reference-panel')?.textContent ?? '', /English documentation/);
    assert.doesNotMatch(host.querySelector('.reference-panel')?.textContent ?? '', /Tài liệu tiếng Việt/);
    await act(async () => switchLanguage()?.click());
    assert.match(host.querySelector('.reference-panel')?.textContent ?? '', /Tài liệu tiếng Việt/);
    assert.equal(requests.filter((url) => url === `/language/java${viPath}`).length, 1,
      'Returning to VI may use the cached VI reference');
  });
});

test('Reference tab disappears when selected locale is unpublished, without falling back to VI', async () => {
  const route = 'REFERENCE_LOCALES_VI_ONLY';
  const viPath = `/module/${route}/reference/vi/references.yml`;
  await withReferencePage(route, { vi: viPath }, (url) => {
    assert.equal(url, `/language/java${viPath}`);
    return new Response(stringify({
      references: [{ title: 'Chỉ có tiếng Việt', url: 'https://vi.example.test' }],
    }), { status: 200 });
  }, async (host, requests) => {
    await act(async () => host.querySelector<HTMLButtonElement>('.module-tabs__button--reference')?.click());
    assert.match(host.querySelector('.reference-panel')?.textContent ?? '', /Chỉ có tiếng Việt/);
    await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="switch-language"]')?.click());
    assert.equal(host.querySelector('.module-tabs__button--reference'), null);
    assert.equal(host.querySelector('.reference-panel'), null);
    assert.equal(host.querySelector('.module-tabs__button--knowledge')?.getAttribute('aria-selected'), 'true');
    assert.deepEqual(requests.filter((url) => url.includes('/reference/')),
      [`/language/java${viPath}`]);
  });
});

test('legacy single-path Reference remains shared across both languages during rollout', async () => {
  const route = 'REFERENCE_LOCALES_LEGACY';
  const legacyPath = `/module/${route}/reference/references.yml`;
  assert.deepEqual(toLearningModule({
    id: route, name: 'test', kind: 'MODULE', routeId: route, children: [], reference: legacyPath,
  }, { knowledge: 0, quiz: 0, interview: 0 }).reference, { vi: legacyPath, en: legacyPath });

  await withReferencePage(route, legacyPath, (url) => {
    assert.equal(url, `/language/java${legacyPath}`);
    return new Response(stringify({
      references: [{ title: 'Shared legacy documentation', url: 'https://shared.example.test' }],
    }), { status: 200 });
  }, async (host, requests) => {
    const tab = () => host.querySelector<HTMLButtonElement>('.module-tabs__button--reference');
    await act(async () => tab()?.click());
    assert.match(host.querySelector('.reference-panel')?.textContent ?? '', /Shared legacy documentation/);
    await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="switch-language"]')?.click());
    assert.equal(tab()?.getAttribute('aria-selected'), 'true');
    assert.match(host.querySelector('.reference-panel')?.textContent ?? '', /Shared legacy documentation/);
    assert.deepEqual(requests.filter((url) => url.includes('/reference/')),
      [`/language/java${legacyPath}`]);
  });
});
