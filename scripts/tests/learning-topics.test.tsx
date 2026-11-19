import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LearningTopicsPage } from '../../src/pages/LearningTopicsPage';
import { createCategory, updateTopic } from '../../src/data/learningCatalog';
import { LanguageProvider } from '../../src/state/LanguageContext';

const backend = 'https://api.nguyendodinhphuong.name.vn/api/v1';
const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#0074BD" d="M1 1h20"/></svg>';

const categories = [
  { id: 7, code: 'FRONTEND', name: 'Frontend', sortOrder: 2 },
  { id: 3, code: 'BACKEND', name: 'Backend', sortOrder: 1 },
];
const topics = [
  {
    id: 4, code: 'JAVASCRIPT', slug: 'javascript', name: 'JavaScript',
    description: null, iconSvg: svg, status: 'COMING_SOON', sortOrder: 2,
    category: categories[1],
  },
  {
    id: 3, code: 'JAVA', slug: 'java', name: 'Java',
    description: 'Java programming language', iconSvg: svg,
    status: 'AVAILABLE', sortOrder: 1, category: categories[1],
  },
  {
    id: 10, code: 'HIDDEN', slug: 'hidden', name: 'Hidden topic',
    description: null, iconSvg: svg, status: 'HIDDEN', sortOrder: 3, category: categories[0],
  },
  {
    id: 8, code: 'REACT', slug: 'react', name: 'React',
    description: null, iconSvg: svg, status: 'COMING_SOON', sortOrder: 1,
    category: categories[0],
  },
  {
    id: 11, code: 'NODEJS', slug: 'nodejs', name: 'NodeJS',
    description: null, iconSvg: null, status: 'COMING_SOON', sortOrder: 3,
    category: categories[1],
  },
];

async function withTopicsPage(
  respond: (url: string, init?: RequestInit) => Promise<Response> | Response,
  verify: (host: HTMLElement, requests: Array<{ url: string; cache?: RequestCache; method?: string; body?: string }>) => Promise<void>,
  admin = false,
) {
  const browser = new Window({ url: 'http://localhost:5173' });
  const globals = {
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, HTMLInputElement: browser.HTMLInputElement,
    HTMLTextAreaElement: browser.HTMLTextAreaElement, Node: browser.Node,
    KeyboardEvent: browser.KeyboardEvent, Event: browser.Event, DOMParser: browser.DOMParser,
    MutationObserver: browser.MutationObserver, IS_REACT_ACT_ENVIRONMENT: true,
  };
  const previous = Object.fromEntries(Object.keys(globals).map((key) =>
    [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }

  const requests: Array<{ url: string; cache?: RequestCache; method?: string; body?: string }> = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    requests.push({ url: String(url), cache: init?.cache,
      ...(init?.method ? { method: init.method } : {}),
      ...(init?.body ? { body: String(init.body) } : {}),
    });
    if (String(url).endsWith('/api/auth/config')) return json({ googleLoginEnabled: true });
    if (String(url).endsWith('/api/auth/me')) {
      return admin ? json({ id: 1, email: 'admin@example.com', roles: ['ADMIN'], displayName: 'Admin', avatarUrl: null })
        : new Response(null, { status: 401 });
    }
    if (String(url).endsWith('/api/auth/csrf')) {
      return json({ token: 'test-csrf', headerName: 'X-CSRF-TOKEN' });
    }
    return respond(String(url), init);
  }) as typeof fetch;

  const host = browser.document.createElement('div');
  browser.document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/learning']}>
          <Routes>
            <Route path="/learning" element={<LearningTopicsPage />} />
            <Route path="/learning/java/knowledge" element={<p>Java Knowledge page</p>} />
          </Routes>
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

const json = (value: unknown) => new Response(JSON.stringify(value), {
  status: 200, headers: { 'Content-Type': 'application/json' },
});

test('topics are grouped and sorted by database categories; available topics navigate by slug', async () => {
  await withTopicsPage((url) => {
    if (url === `${backend}/categories`) return json(categories);
    if (url === `${backend}/topics`) return json(topics);
    throw new Error(`Unexpected request: ${url}`);
  }, async (host, requests) => {
    assert.deepEqual(requests.filter(({ url }) => url.startsWith(backend)), [
      { url: `${backend}/categories`, cache: 'no-store' },
      { url: `${backend}/topics`, cache: 'no-store' },
    ]);
    const sections = [...host.querySelectorAll<HTMLElement>('.learning-topic-category')];
    assert.deepEqual(sections.map((section) => section.querySelector('h2')?.textContent),
      ['Backend', 'Frontend']);
    assert.deepEqual([...sections[0].querySelectorAll('.learning-topic-card__name')].map((el) => el.textContent),
      ['Java', 'JavaScript', 'NodeJS']);
    assert.equal(host.textContent?.includes('Hidden topic'), false);
    assert.equal(sections[0].querySelector<HTMLAnchorElement>('a.learning-topic-card')?.getAttribute('href'),
      '/learning/java/knowledge');
    assert.match(sections[0].textContent ?? '', /Java programming language/);

    // Oracle allows a Topic to have no SVG; the card must render its fallback.
    assert.equal(sections[0].querySelector('.learning-topic-card__logo-fallback')?.textContent, 'N');

    const logo = sections[0].querySelector<HTMLImageElement>('.learning-topic-card__logo');
    assert.ok(logo?.src.startsWith('data:image/svg+xml;charset=utf-8,'));
    assert.match(decodeURIComponent(logo.src.split(',')[1]), /<path/);
    await act(async () => sections[0].querySelector<HTMLAnchorElement>('a.learning-topic-card')?.click());
    assert.match(host.textContent ?? '', /Java Knowledge page/);
  });
});

test('coming-soon card still opens and closes the existing dialog', async () => {
  await withTopicsPage((url) => json(url.endsWith('/categories') ? categories : topics), async (host) => {
    const comingSoon = host.querySelector<HTMLButtonElement>('button.learning-topic-card');
    assert.ok(comingSoon);
    await act(async () => comingSoon.click());
    assert.equal(host.querySelector('.learning-coming-soon__eyebrow')?.textContent, 'JavaScript');
    assert.match(host.querySelector('.learning-coming-soon')?.textContent ?? '', /Nội dung chưa được cập nhật/);
    await act(async () => host.querySelector<HTMLButtonElement>('.learning-coming-soon__close')?.click());
    assert.equal(host.querySelector('.learning-coming-soon'), null);
    assert.equal(host.ownerDocument.activeElement, comingSoon);
  });
});

test('SVG injected from database is sanitized before being used as an image', async () => {
  const unsafeSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" onload="alert(1)">'
    + '<script>alert(1)</script><foreignObject><div>evil</div></foreignObject>'
    + '<path d="M1 1" fill="red" /></svg>';
  await withTopicsPage((url) => json(url.endsWith('/categories')
    ? [categories[1]]
    : [{ ...topics[1], iconSvg: unsafeSvg }]), async (host) => {
    const source = host.querySelector<HTMLImageElement>('.learning-topic-card__logo')?.src;
    if (source) {
      const markup = decodeURIComponent(source.split(',')[1]).toLowerCase();
      assert.match(markup, /<svg/);
      assert.doesNotMatch(markup, /onload|<script|foreignobject|<div/);
    } else {
      // Sanitizers can discard the entire malformed SVG, in which case the
      // component must display a text fallback rather than untrusted markup.
      assert.equal(host.querySelector('.learning-topic-card__logo-fallback')?.textContent, 'J');
    }
    assert.equal(host.querySelector('script'), null);
  });
});

test('network failures show a retry button instead of old hardcoded topics', async () => {
  let failed = true;
  await withTopicsPage((url) => {
    if (failed && url.endsWith('/topics')) return new Response('unavailable', { status: 503 });
    return json(url.endsWith('/categories') ? categories : topics);
  }, async (host) => {
    assert.match(host.textContent ?? '', /Không thể tải danh sách chủ đề/);
    assert.equal(host.querySelectorAll('.learning-topic-card').length, 0);
    failed = false;
    await act(async () => host.querySelector<HTMLButtonElement>('.learning-topics-retry')?.click());
    assert.equal(host.querySelectorAll('.learning-topic-card').length, 4);
  });
});

test('admin sees empty categories and hidden topics with separate create/edit forms', async () => {
  const adminCategories = [
    ...categories.map((category) => ({ ...category, active: true })),
    { id: 50, code: 'EMPTY', name: 'Empty Category', sortOrder: 3, active: false },
  ];
  await withTopicsPage((url) => {
    if (url.endsWith('/api/admin/categories')) return json(adminCategories);
    if (url.endsWith('/api/admin/topics')) return json(topics);
    throw new Error(`Unexpected request: ${url}`);
  }, async (host, requests) => {
    assert.deepEqual(requests.filter(({ url }) => url.includes('/api/admin/')).map(({ url }) => url), [
      'https://api.nguyendodinhphuong.name.vn/api/admin/categories',
      'https://api.nguyendodinhphuong.name.vn/api/admin/topics',
    ]);
    const sections = [...host.querySelectorAll<HTMLElement>('.learning-topic-category')];
    assert.deepEqual(sections.map((section) => section.querySelector('h2')?.textContent),
      ['Backend', 'Frontend', 'Empty Category']);
    assert.match(sections[1].textContent ?? '', /Hidden topic/);
    assert.match(sections[2].textContent ?? '', /INACTIVE/);
    assert.match(sections[2].textContent ?? '', /chưa có Topic/);

    const createCategoryButton = host.querySelector<HTMLButtonElement>('.learning-admin-toolbar button');
    assert.ok(createCategoryButton);
    await act(async () => createCategoryButton.click());
    let dialog = host.querySelector<HTMLElement>('[role="dialog"].catalog-editor');
    assert.ok(dialog);
    assert.equal(dialog.querySelector('input')?.value, '');
    assert.match(dialog.textContent ?? '', /Tạo Category/);

    await act(async () => dialog?.querySelector<HTMLButtonElement>('.catalog-editor__close')?.click());
    assert.equal(host.querySelector('.catalog-editor'), null);

    await act(async () => sections[0].querySelector<HTMLButtonElement>('.catalog-admin-btn--ghost')?.click());
    dialog = host.querySelector<HTMLElement>('[role="dialog"].catalog-editor');
    assert.equal(dialog?.querySelector('input')?.value, 'BACKEND');
    await act(async () => dialog?.querySelector<HTMLButtonElement>('.catalog-editor__close')?.click());

    await act(async () => sections[2].querySelector<HTMLButtonElement>('.learning-topic-category__header-actions .catalog-admin-btn:not(.catalog-admin-btn--ghost)')?.click());
    dialog = host.querySelector<HTMLElement>('[role="dialog"].catalog-editor');
    assert.match(dialog?.textContent ?? '', /Empty Category/);
    assert.equal(dialog?.querySelectorAll('input').length, 3);
    assert.match(dialog?.textContent ?? '', /ICON_SVG/);
    await act(async () => dialog?.querySelector<HTMLButtonElement>('.catalog-editor__close')?.click());

    const hiddenCard = [...sections[1].querySelectorAll<HTMLElement>('.learning-topic-card-shell')]
      .find((card) => card.querySelector('.learning-topic-card__name')?.textContent === 'Hidden topic');
    await act(async () => hiddenCard?.querySelector<HTMLButtonElement>('.catalog-admin-topic-edit')?.click());
    dialog = host.querySelector<HTMLElement>('[role="dialog"].catalog-editor');
    assert.equal(dialog?.querySelector('input')?.value, 'HIDDEN');
  }, true);
});

test('admin writes include cookies, a CSRF header and the requested payload', async () => {
  const originalFetch = globalThis.fetch;
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    if (String(url).endsWith('/api/auth/csrf')) {
      return json({ token: 'csrf-token', headerName: 'X-CSRF-TOKEN' });
    }
    return json({ id: 99, code: 'NEW', name: 'New category', sortOrder: 4, active: true });
  }) as typeof fetch;
  try {
    await createCategory({ code: 'NEW', name: 'New category' });
    await updateTopic(20, { code: 'JAVA', slug: 'java', name: 'Java', description: '' });
    assert.deepEqual(calls.map((call) => call.url), [
      'https://api.nguyendodinhphuong.name.vn/api/auth/csrf',
      'https://api.nguyendodinhphuong.name.vn/api/admin/categories',
      'https://api.nguyendodinhphuong.name.vn/api/auth/csrf',
      'https://api.nguyendodinhphuong.name.vn/api/admin/topics/20',
    ]);
    assert.equal(calls[1].init?.method, 'POST');
    assert.equal(calls[3].init?.method, 'PUT');
    assert.equal(calls[1].init?.credentials, 'include');
    assert.equal(new Headers(calls[1].init?.headers).get('X-CSRF-TOKEN'), 'csrf-token');
    assert.deepEqual(JSON.parse(String(calls[3].init?.body)),
      { code: 'JAVA', slug: 'java', name: 'Java', description: '' });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
