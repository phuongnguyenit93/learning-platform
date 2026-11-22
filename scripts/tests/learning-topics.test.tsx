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

const moduleProgress = [
  { topicId: 3, totalModules: 3, completedModules: 2, partialModules: 1, notStartedModules: 0 },
  { topicId: 4, totalModules: 4, completedModules: 1, partialModules: 1, notStartedModules: 2 },
  { topicId: 10, totalModules: 0, completedModules: 0, partialModules: 0, notStartedModules: 0 },
  { topicId: 8, totalModules: 2, completedModules: 2, partialModules: 0, notStartedModules: 0 },
  { topicId: 11, totalModules: 0, completedModules: 0, partialModules: 0, notStartedModules: 0 },
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
    if (String(url).endsWith('/topics/progress')) {
      return json(admin ? moduleProgress : moduleProgress
        .filter((row) => row.topicId !== 10)
        .map(({ topicId, totalModules, completedModules }) => ({ topicId, totalModules, completedModules })));
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

test('categories remain in the left sidebar; selecting one replaces the right topic list', async () => {
  await withTopicsPage((url) => {
    if (url === `${backend}/categories`) return json(categories);
    if (url === `${backend}/topics`) return json(topics);
    throw new Error(`Unexpected request: ${url}`);
  }, async (host, requests) => {
    assert.deepEqual(requests.filter(({ url }) => url.startsWith(backend)), [
      { url: `${backend}/categories`, cache: 'no-store' },
      { url: `${backend}/topics`, cache: 'no-store' },
      { url: `${backend}/topics/progress`, cache: 'no-store' },
    ]);
    const nav = [...host.querySelectorAll<HTMLButtonElement>('.learning-topics-sidebar__item')];
    assert.deepEqual(nav.map((item) => item.querySelector('.learning-topics-sidebar__item-name')?.textContent),
      ['Backend', 'Frontend']);
    assert.equal(nav[0].getAttribute('aria-pressed'), 'true');
    assert.equal(host.querySelectorAll('.learning-topic-category').length, 1);
    assert.equal(host.querySelector('.learning-topic-category h2')?.textContent, 'Backend');
    assert.deepEqual([...host.querySelectorAll('.learning-topic-card__name')].map((el) => el.textContent),
      ['Java', 'JavaScript', 'NodeJS']);
    assert.equal(host.textContent?.includes('LEARNING PATHS'), false);
    assert.equal(host.textContent?.includes('What would you like to learn?'), false);
    assert.equal(host.textContent?.includes('Hidden topic'), false);
    assert.equal(host.querySelector<HTMLAnchorElement>('a.learning-topic-card')?.getAttribute('href'),
      '/learning/java/knowledge');
    assert.match(host.textContent ?? '', /Java programming language/);
    assert.match(host.textContent ?? '', /Total modules|T.ng Module/);
    assert.equal(host.querySelector('.topic-progress-admin'), null);
    assert.equal(host.querySelector('.learning-topic-card__logo-fallback')?.textContent, 'N');
    const logo = host.querySelector<HTMLImageElement>('.learning-topic-card__logo');
    assert.ok(logo?.src.startsWith('data:image/svg+xml;charset=utf-8,'));
    assert.match(decodeURIComponent(logo.src.split(',')[1]), /<path/);

    await act(async () => nav[1].click());
    assert.equal(nav[1].getAttribute('aria-pressed'), 'true');
    assert.equal(nav[0].getAttribute('aria-pressed'), 'false');
    assert.equal(host.querySelector('.learning-topic-category h2')?.textContent, 'Frontend');
    assert.deepEqual([...host.querySelectorAll('.learning-topic-card__name')].map((el) => el.textContent), ['React']);
    assert.equal(host.querySelector('.learning-topic-category__scroll') !== null, true);

    await act(async () => nav[0].click());
    assert.deepEqual([...host.querySelectorAll('.learning-topic-card__name')].map((el) => el.textContent),
      ['Java', 'JavaScript', 'NodeJS']);
    await act(async () => host.querySelector<HTMLAnchorElement>('a.learning-topic-card')?.click());
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
    assert.equal(host.querySelectorAll('.learning-topic-card').length, 3);
  });
});

test('admin can manage empty categories and hidden topics from the selected pane', async () => {
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
      'https://api.nguyendodinhphuong.name.vn/api/admin/topics/progress',
    ]);
    const nav = [...host.querySelectorAll<HTMLButtonElement>('.learning-topics-sidebar__item')];
    assert.deepEqual(nav.map((item) => item.querySelector('.learning-topics-sidebar__item-name')?.textContent),
      ['Backend', 'Frontend', 'Empty CategoryINACTIVE']);
    assert.equal(host.querySelector('.learning-topic-category h2')?.textContent, 'Backend');

    const createCategoryButton = host.querySelector<HTMLButtonElement>('.learning-topics-sidebar__header button');
    assert.ok(createCategoryButton);
    await act(async () => createCategoryButton.click());
    let dialog = host.querySelector<HTMLElement>('[role="dialog"].catalog-editor');
    assert.ok(dialog);
    assert.equal(dialog.querySelector('input')?.value, '');
    await act(async () => dialog?.querySelector<HTMLButtonElement>('.catalog-editor__close')?.click());
    assert.equal(host.querySelector('.catalog-editor'), null);

    await act(async () => host.querySelector<HTMLButtonElement>('.catalog-admin-btn--ghost')?.click());
    dialog = host.querySelector<HTMLElement>('[role="dialog"].catalog-editor');
    assert.equal(dialog?.querySelector('input')?.value, 'BACKEND');
    await act(async () => dialog?.querySelector<HTMLButtonElement>('.catalog-editor__close')?.click());

    await act(async () => nav[2].click());
    assert.equal(host.querySelector('.learning-topic-category h2')?.textContent, 'Empty Category');
    assert.equal(host.querySelectorAll('.learning-topic-card').length, 0);
    assert.match(host.querySelector('.learning-topic-category__empty')?.textContent ?? '', /Topic/);
    await act(async () => host.querySelector<HTMLButtonElement>('.learning-topic-category__header-actions .catalog-admin-btn:not(.catalog-admin-btn--ghost)')?.click());
    dialog = host.querySelector<HTMLElement>('[role="dialog"].catalog-editor');
    assert.match(dialog?.textContent ?? '', /Empty Category/);
    assert.equal(dialog?.querySelectorAll('input').length, 3);
    assert.match(dialog?.textContent ?? '', /ICON_SVG/);
    await act(async () => dialog?.querySelector<HTMLButtonElement>('.catalog-editor__close')?.click());

    await act(async () => nav[1].click());
    assert.match(host.textContent ?? '', /Hidden topic/);
    const hiddenCard = [...host.querySelectorAll<HTMLElement>('.learning-topic-card-shell')]
      .find((card) => card.querySelector('.learning-topic-card__name')?.textContent === 'Hidden topic');
    assert.ok(hiddenCard);
    await act(async () => hiddenCard.querySelector<HTMLButtonElement>('.catalog-admin-topic-edit')?.click());
    dialog = host.querySelector<HTMLElement>('[role="dialog"].catalog-editor');
    assert.equal(dialog?.querySelector('input')?.value, 'HIDDEN');
    assert.equal(dialog?.querySelector('select')?.value, 'HIDDEN');
    assert.deepEqual([...dialog!.querySelectorAll('select option')].map((option) => option.value),
      ['AVAILABLE', 'COMING_SOON', 'HIDDEN']);
  }, true);
});

test('admin module readiness details are lazy, scoped to one Topic and contain SERVICE_NAMEs', async () => {
  const names = ['SECURITY_AUTHENTICATION_PASSWORD', 'SECURITY_AUTHENTICATION_TOKEN'];
  await withTopicsPage((url) => {
    if (url.endsWith('/api/admin/categories')) return json(categories.map((category) => ({ ...category, active: true })));
    if (url.endsWith('/api/admin/topics')) return json(topics);
    if (url.endsWith('/api/admin/topics/4/module-progress?status=NOT_STARTED')) return json(names);
    throw new Error(`Unexpected request: ${url}`);
  }, async (host, requests) => {
    const javascriptCard = [...host.querySelectorAll<HTMLElement>('.learning-topic-card-shell')]
      .find((card) => card.querySelector('.learning-topic-card__name')?.textContent === 'JavaScript');
    assert.ok(javascriptCard);
    assert.equal(javascriptCard.querySelector('.topic-progress-admin')?.textContent?.includes('Đang dang dở'), true);
    assert.equal(javascriptCard.querySelector('.topic-progress-admin')?.textContent?.includes('Chưa làm'), true);
    assert.equal(javascriptCard.querySelectorAll('.topic-progress-admin button').length, 2);
    assert.equal(requests.filter(({ url }) => url.includes('/module-progress?')).length, 0);
    const notStartedButton = javascriptCard.querySelectorAll<HTMLButtonElement>('.topic-progress-admin button')[1];
    await act(async () => notStartedButton.click());
    const detailRequests = requests.filter(({ url }) => url.includes('/module-progress?'));
    assert.equal(detailRequests.length, 1);
    assert.equal(detailRequests[0].url, 'https://api.nguyendodinhphuong.name.vn/api/admin/topics/4/module-progress?status=NOT_STARTED');
    const list = host.querySelectorAll('.topic-progress-dialog__list li');
    assert.deepEqual([...list].map((item) => item.textContent), names);
    assert.equal(host.querySelector('.topic-progress-dialog__count')?.textContent?.trim(), '2 Module');
    await act(async () => host.querySelector<HTMLButtonElement>('.topic-progress-dialog__close')?.click());
    assert.equal(host.querySelector('.topic-progress-dialog'), null);
    assert.equal(host.ownerDocument.activeElement, notStartedButton);
  }, true);
});

test('admin can switch Topic status and sends status in update without changing other metadata', async () => {
  let updated = false;
  await withTopicsPage((url, init) => {
    if (url.endsWith('/api/admin/categories')) return json(categories.map((category) => ({ ...category, active: true })));
    if (url.endsWith('/api/admin/topics') && !init?.method) return json(topics);
    if (url.endsWith('/api/admin/topics/4') && init?.method === 'PUT') {
      const body = JSON.parse(String(init.body));
      assert.deepEqual(body, {
        code: 'JAVASCRIPT', slug: 'javascript', name: 'JavaScript', description: '', status: 'AVAILABLE',
      });
      updated = true;
      return json({ ...topics[0], ...body });
    }
    throw new Error(`Unexpected request: ${url}`);
  }, async (host, requests) => {
    const javascriptCard = [...host.querySelectorAll<HTMLElement>('.learning-topic-card-shell')]
      .find((card) => card.querySelector('.learning-topic-card__name')?.textContent === 'JavaScript');
    assert.ok(javascriptCard);
    await act(async () => javascriptCard.querySelector<HTMLButtonElement>('.catalog-admin-topic-edit')?.click());
    const select = host.querySelector<HTMLSelectElement>('.catalog-editor select');
    assert.ok(select);
    assert.equal(select.value, 'COMING_SOON');
    await act(async () => {
      select.value = 'AVAILABLE';
      select.dispatchEvent(new window.Event('change', { bubbles: true }));
    });
    assert.equal(select.value, 'AVAILABLE');
    await act(async () => host.querySelector<HTMLButtonElement>('.catalog-editor button[type="submit"]')?.click());
    assert.equal(updated, true);
    assert.equal(requests.filter(({ method }) => method === 'PUT').length, 1);
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
    await updateTopic(20, { code: 'JAVA', slug: 'java', name: 'Java', description: '', status: 'COMING_SOON' });
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
      { code: 'JAVA', slug: 'java', name: 'Java', description: '', status: 'COMING_SOON' });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
