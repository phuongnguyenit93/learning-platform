import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../../src/components/Header';
import { LanguageProvider } from '../../src/state/LanguageContext';
import { ThemeProvider } from '../../src/state/ThemeContext';

const origin = 'https://api.nguyendodinhphuong.name.vn';

test('desktop header navigation is centered on the viewport, independent of right controls', () => {
  const css = readFileSync(new URL('../../src/styles/index.css', import.meta.url), 'utf8');
  const rule = (selector: string) => {
    const begin = css.indexOf(selector + ' {');
    assert.ok(begin >= 0, 'missing CSS selector ' + selector);
    return css.slice(begin, css.indexOf('}', begin));
  };
  assert.match(rule('.topbar'), /grid-template-columns:\s*minmax\(0, 1fr\) auto minmax\(0, 1fr\)/,
    'equal-width side tracks keep the center menu at 50% of screen width');
  assert.match(rule('.topbar__nav'), /justify-self:\s*center/,
    'navigation must occupy the center of the middle track');
  assert.match(rule('.topbar__actions'), /justify-self:\s*end/,
    'account controls stay on the right edge without shifting the menu');
  assert.match(css, /@media \(max-width: 1280px\)\s*\{\s*\.topbar\s*\{\s*grid-template-columns:\s*auto minmax\(0, 1fr\) auto/,
    'narrow desktop falls back before account controls overlap the center menu');
});

type RequestRecord = { url: string; method: string; credentials?: RequestCredentials; headers?: HeadersInit };

const json = (value: unknown) => new Response(JSON.stringify(value), {
  status: 200, headers: { 'Content-Type': 'application/json' },
});

async function withHeader(
  respond: (url: string, init?: RequestInit) => Promise<Response> | Response,
  verify: (host: HTMLElement, requests: RequestRecord[]) => Promise<void>,
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

  const requests: RequestRecord[] = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ url: String(url), method: init?.method ?? 'GET', credentials: init?.credentials, headers: init?.headers });
    return respond(String(url), init);
  }) as typeof fetch;

  const host = browser.document.createElement('div');
  browser.document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(
      <ThemeProvider>
        <LanguageProvider>
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        </LanguageProvider>
      </ThemeProvider>,
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

test('anonymous header navigates to Google OAuth with credentials-based session check and translations', async () => {
  await withHeader((url) => {
    if (url === `${origin}/api/auth/config`) return json({ googleLoginEnabled: true });
    if (url === `${origin}/api/auth/me`) return new Response(null, { status: 401 });
    throw new Error(`Unexpected request: ${url}`);
  }, async (host, requests) => {
    assert.deepEqual(requests.map(({ url, method, credentials }) => ({ url, method, credentials })), [
      { url: `${origin}/api/auth/config`, method: 'GET', credentials: 'include' },
      { url: `${origin}/api/auth/me`, method: 'GET', credentials: 'include' },
    ]);
    const signIn = host.querySelector<HTMLAnchorElement>('.header-auth__google');
    assert.equal(signIn?.getAttribute('href'), `${origin}/oauth2/authorization/google`);
    assert.match(signIn?.textContent ?? '', /Đăng nhập Google/);
    await act(async () => host.querySelector<HTMLButtonElement>('.language-toggle')?.click());
    assert.match(host.querySelector('.header-auth__google')?.textContent ?? '', /Sign in with Google/);
  });
});

test('signed-in header displays user and logs out using returned CSRF header', async () => {
  await withHeader((url, init) => {
    if (url === `${origin}/api/auth/config`) return json({ googleLoginEnabled: true });
    if (url === `${origin}/api/auth/me`) return json({
      id: 1, email: 'student@example.com', displayName: 'Student User',
      avatarUrl: null, roles: ['USER'],
    });
    if (url === `${origin}/api/auth/csrf`) return json({ token: 'csrf-value', headerName: 'X-CSRF-TOKEN' });
    if (url === `${origin}/api/auth/logout`) {
      assert.equal(init?.method, 'POST');
      assert.deepEqual(init?.headers, { 'X-CSRF-TOKEN': 'csrf-value' });
      return new Response(null, { status: 204 });
    }
    throw new Error(`Unexpected request: ${url}`);
  }, async (host, requests) => {
    assert.equal(host.querySelector('.header-auth__name')?.textContent, 'Student User');
    assert.ok(host.querySelector('.header-auth__avatar--fallback'));
    await act(async () => host.querySelector<HTMLButtonElement>('.header-auth__logout')?.click());
    assert.equal(host.querySelector('.header-auth__name'), null);
    assert.ok(host.querySelector<HTMLAnchorElement>('.header-auth__google'));
    assert.deepEqual(requests.slice(2).map(({ url, method, credentials }) => ({ url, method, credentials })), [
      { url: `${origin}/api/auth/csrf`, method: 'GET', credentials: 'include' },
      { url: `${origin}/api/auth/logout`, method: 'POST', credentials: 'include' },
    ]);
  });
});

test('configuration disabled and network outage provide an informative disabled login and retry', async () => {
  await withHeader((url) => {
    if (url === `${origin}/api/auth/config`) return json({ googleLoginEnabled: false });
    if (url === `${origin}/api/auth/me`) return new Response(null, { status: 401 });
    throw new Error(`Unexpected request: ${url}`);
  }, async (host) => {
    assert.equal(host.querySelector<HTMLButtonElement>('.header-auth__google')?.disabled, true);
    assert.match(host.textContent ?? '', /Chưa cấu hình Google/);
    assert.equal(host.querySelector('.header-auth__retry'), null);
  });

  let recovered = false;
  await withHeader((url) => {
    if (!recovered) throw new Error('Server unreachable');
    if (url === `${origin}/api/auth/config`) return json({ googleLoginEnabled: true });
    if (url === `${origin}/api/auth/me`) return new Response(null, { status: 401 });
    throw new Error(`Unexpected request: ${url}`);
  }, async (host, requests) => {
    assert.equal(host.querySelector<HTMLButtonElement>('.header-auth__google')?.disabled, true);
    assert.match(host.textContent ?? '', /Không thể kết nối đăng nhập/);
    recovered = true;
    await act(async () => host.querySelector<HTMLButtonElement>('.header-auth__retry')?.click());
    assert.ok(host.querySelector<HTMLAnchorElement>('.header-auth__google'));
    assert.equal(requests.length, 4);
  });
});
