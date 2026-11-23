import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, MemoryRouter, useLocation } from 'react-router-dom';
import { Header } from '../../src/components/Header';
import { PageMetadata } from '../../src/components/PageMetadata';
import { useTopicBrandingIcon } from '../../src/data/useTopicBrandingIcon';
import { LanguageProvider } from '../../src/state/LanguageContext';
import { ThemeProvider } from '../../src/state/ThemeContext';

const api = 'https://api.nguyendodinhphuong.name.vn';
const category = { id: 1, code: 'BACKEND', name: 'Backend', sortOrder: 1 };
const springSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
  + '<circle cx="16" cy="16" r="10" fill="#49b96f"/></svg>';
const topics = [
  { id: 1, code: 'SPRING', slug: 'spring', name: 'Spring', description: null,
    iconSvg: springSvg, status: 'AVAILABLE', sortOrder: 1, category },
  { id: 2, code: 'JAVA', slug: 'java', name: 'Java', description: null,
    iconSvg: null, status: 'AVAILABLE', sortOrder: 2, category },
];

function BrandingHarness() {
  const { pathname } = useLocation();
  const topicIconSrc = useTopicBrandingIcon(pathname);
  return <>
    <PageMetadata topicIconSrc={topicIconSrc} />
    <Header topicIconSrc={topicIconSrc} />
    <Link to="/learning/spring/knowledge/spring-core">Spring core</Link>
    <Link to="/learning/spring/knowledge/another-module">Spring module</Link>
    <Link to="/learning/java/overview">Java overview</Link>
    <Link to="/">Home</Link>
  </>;
}

async function withBranding(
  responses: typeof topics,
  verify: (host: HTMLElement, calls: string[]) => Promise<void>,
) {
  const browser = new Window({ url: 'http://localhost:5173' });
  const globals = {
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, Event: browser.Event,
    MutationObserver: browser.MutationObserver, IS_REACT_ACT_ENVIRONMENT: true,
  };
  const previous = Object.fromEntries(Object.keys(globals).map((key) =>
    [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }

  const oldFetch = globalThis.fetch;
  const calls: string[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    calls.push(url);
    if (url === api + '/api/v1/topics') return Response.json(responses);
    if (url === api + '/api/auth/config') return Response.json({ googleLoginEnabled: false });
    if (url === api + '/api/auth/me') return new Response(null, { status: 401 });
    throw new Error('Unexpected request: ' + url);
  }) as typeof fetch;

  const host = browser.document.createElement('div');
  browser.document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(
      <ThemeProvider>
        <LanguageProvider>
          <MemoryRouter initialEntries={['/learning/spring/knowledge/spring-core']}>
            <BrandingHarness />
          </MemoryRouter>
        </LanguageProvider>
      </ThemeProvider>,
    ));
    await verify(host, calls);
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

function getFavicon(host: HTMLElement): string {
  const favicon = host.ownerDocument.querySelector<HTMLLinkElement>('link[rel="icon"]');
  assert.ok(favicon, 'favicon link must exist');
  return favicon.href;
}

async function follow(host: HTMLElement, label: string) {
  const link = [...host.querySelectorAll<HTMLAnchorElement>('a')]
    .find((item) => item.textContent === label);
  assert.ok(link, 'missing navigation link ' + label);
  await act(async () => link.click());
}

test('header logo and browser favicon use the same sanitized Topic SVG, cached across Modules', async () => {
  await withBranding(topics, async (host, calls) => {
    const icon = host.querySelector<HTMLImageElement>('.topbar__brand-icon img');
    assert.ok(icon, 'Spring header should use its database SVG');
    assert.ok(icon.src.startsWith('data:image/svg+xml'));
    const springIconSrc = icon.src;
    assert.equal(getFavicon(host), springIconSrc, 'browser tab and header show the same SVG');
    const markup = decodeURIComponent(springIconSrc.split(',')[1]).toLowerCase();
    assert.match(markup, /<svg/);
    assert.doesNotMatch(markup, /onload|<script|alert\(1\)/);
    assert.match(host.querySelector('.topbar__brand')?.textContent ?? '', /Spring Learning/);
    assert.equal(calls.filter((url) => url.endsWith('/api/v1/topics')).length, 1);

    await follow(host, 'Spring module');
    assert.equal(host.querySelector<HTMLImageElement>('.topbar__brand-icon img')?.src, springIconSrc);
    assert.equal(getFavicon(host), springIconSrc);
    assert.equal(calls.filter((url) => url.endsWith('/api/v1/topics')).length, 1);

    await follow(host, 'Java overview');
    assert.ok(!getFavicon(host).startsWith('data:image/svg+xml'),
      'a Topic without SVG must not keep the previous Topic favicon');
    assert.notEqual(host.querySelector<HTMLImageElement>('.topbar__brand-icon img')?.src, springIconSrc);

    await follow(host, 'Home');
    assert.match(host.querySelector('.topbar__brand')?.textContent ?? '', /Learning Platform/);
    assert.ok(!getFavicon(host).startsWith('data:image/svg+xml'),
      'home page uses the regular site favicon');
    assert.equal(calls.filter((url) => url.endsWith('/api/v1/topics')).length, 1);

    await follow(host, 'Spring core');
    assert.equal(getFavicon(host), springIconSrc);
    assert.equal(host.querySelector<HTMLImageElement>('.topbar__brand-icon img')?.src, springIconSrc);
    assert.equal(calls.filter((url) => url.endsWith('/api/v1/topics')).length, 1);
  });
});

test('invalid Topic icon falls back safely without changing page navigation', async () => {
  await withBranding([{ ...topics[0], iconSvg: 'not an svg' }, topics[1]], async (host) => {
    assert.ok(!getFavicon(host).startsWith('data:image/svg+xml'));
    assert.match(host.querySelector('.topbar__brand')?.textContent ?? '', /Spring Learning/);
  });
});

test('unsafe SVG cannot inject markup into the favicon or page header', async () => {
  const unsafe = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" onload="alert(1)">'
    + '<script>alert(1)</script><circle cx="16" cy="16" r="10" fill="green"/></svg>';
  await withBranding([{ ...topics[0], iconSvg: unsafe }, topics[1]], async (host) => {
    const favicon = getFavicon(host);
    if (favicon.startsWith('data:image/svg+xml')) {
      assert.doesNotMatch(decodeURIComponent(favicon.split(',')[1]), /onload|<script|alert\(1\)/i);
    }
    assert.equal(host.querySelector('script'), null);
  });
});
