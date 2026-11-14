import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { BACKEND_API_BASE_URL } from '../../src/data/backendHealth';
import { fetchModuleRoadmap } from '../../src/data/moduleRoadmap';
import { fetchModuleReferences } from '../../src/data/moduleReferences';
import { TopicStructurePage } from '../../src/pages/TopicStructurePage';
import { LanguageProvider, useLanguage } from '../../src/state/LanguageContext';

const base = BACKEND_API_BASE_URL;

const viMilestones = {
  slug: 'java-oop', languageCode: 'vi',
  roadmap: [
    { id: 22, title: 'Đóng gói', purpose: 'Encapsulation',
      objectives: ['Ẩn trạng thái', 'Giữ invariant'], sortOrder: 2 },
    { id: 11, title: 'Lớp và đối tượng', purpose: 'Classes and objects',
      objectives: ['Tạo đối tượng'], sortOrder: 1 },
  ],
};

const viReferences = {
  slug: 'java-oop', languageCode: 'vi',
  references: [
    { id: 55, title: 'Tài liệu API Java', url: 'https://docs.oracle.com/javase/21/docs/api/',
      description: 'Xem chi tiết API', sortOrder: 2 },
    { id: 44, title: 'Đặc tả Java', url: 'https://docs.oracle.com/javase/specs/',
      description: '', sortOrder: 1 },
  ],
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status });
}

test('backend Roadmap adapter validates module/locale and translates DB IDs to timeline cards', async () => {
  const original = globalThis.fetch;
  const requested: string[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, options?: RequestInit) => {
    requested.push(String(input));
    assert.equal(options?.cache, 'no-store');
    assert.equal(options?.headers && (options.headers as Record<string, string>).Accept, 'application/json');
    return json(viMilestones);
  }) as typeof fetch;
  try {
    const doc = await fetchModuleRoadmap('java-oop', 'vi', new AbortController().signal);
    assert.deepEqual(requested, [`${base}/modules/java-oop/roadmap?lang=vi`]);
    assert.deepEqual(doc?.roadmap.map((r) => r.title), ['Lớp và đối tượng', 'Đóng gói']);
    assert.deepEqual(doc?.roadmap.map((r) => r.id), ['db-11', 'db-22']);
    assert.deepEqual(doc?.roadmap[0].objectives, ['Tạo đối tượng']);
    assert.deepEqual(doc?.roadmap[0].relatedKnowledge, []);
    assert.deepEqual(doc?.roadmap[0].relatedModules, []);
    assert.deepEqual(doc?.roadmap[0].dependsOn, []);
  } finally {
    globalThis.fetch = original;
  }
});

test('backend Reference adapter keeps localized title, ordered HTTPS links and empty description', async () => {
  const original = globalThis.fetch;
  let requested = '';
  globalThis.fetch = (async (input: RequestInfo | URL, options?: RequestInit) => {
    requested = String(input);
    assert.equal(options?.cache, 'no-store');
    return json(viReferences);
  }) as typeof fetch;
  try {
    const doc = await fetchModuleReferences('java-oop', 'vi', new AbortController().signal);
    assert.equal(requested, `${base}/modules/java-oop/reference?lang=vi`);
    assert.deepEqual(doc?.references.map((r) => r.title), ['Đặc tả Java', 'Tài liệu API Java']);
    assert.deepEqual(doc?.references.map((r) => r.url), [
      'https://docs.oracle.com/javase/specs/',
      'https://docs.oracle.com/javase/21/docs/api/',
    ]);
    assert.equal(doc?.references[0].description, '');
  } finally {
    globalThis.fetch = original;
  }
});

test('both adapters treat 404 as missing, reject 500/mismatched payload and unsafe reference URL', async () => {
  const original = globalThis.fetch;
  let response = new Response('', { status: 404 });
  globalThis.fetch = (async () => response) as typeof fetch;
  try {
    const signal = new AbortController().signal;
    assert.equal(await fetchModuleRoadmap('java-oop', 'en', signal), null);
    assert.equal(await fetchModuleReferences('java-oop', 'en', signal), null);

    response = new Response('', { status: 503 });
    await assert.rejects(fetchModuleRoadmap('java-oop', 'vi', signal), /HTTP 503/);
    await assert.rejects(fetchModuleReferences('java-oop', 'vi', signal), /HTTP 503/);

    response = json({ ...viMilestones, slug: 'wrong-slug' });
    await assert.rejects(fetchModuleRoadmap('java-oop', 'vi', signal), /Invalid Module Roadmap/);
    response = json({ ...viReferences, languageCode: 'en' });
    await assert.rejects(fetchModuleReferences('java-oop', 'vi', signal), /Invalid Module Reference/);
    response = json({
      ...viReferences,
      references: [{ ...viReferences.references[0], url: 'javascript:alert(1)' }],
    });
    await assert.rejects(fetchModuleReferences('java-oop', 'vi', signal), /Invalid Module Reference URL/);
  } finally {
    globalThis.fetch = original;
  }
});

function SwitchLanguage() {
  const { language, toggleLanguage } = useLanguage();
  return <button type="button" data-testid="switch-language" onClick={toggleLanguage}>{language}</button>;
}

function ChangeModule() {
  const navigate = useNavigate();
  return <button type="button" data-testid="change-module"
    onClick={() => navigate('/learning/java/knowledge/java-stream')}>Next module</button>;
}

async function withDbTopic(
  content: (url: string, options?: RequestInit) => Promise<Response> | Response,
  verify: (host: HTMLElement, requests: string[]) => Promise<void>,
) {
  const browser = new Window({ url: 'http://localhost:5173' });
  const globals = {
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, Event: browser.Event, DOMParser: browser.DOMParser,
    MutationObserver: browser.MutationObserver,
    ResizeObserver: class { observe() {} disconnect() {} },
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const previous = Object.fromEntries(Object.keys(globals).map((key) =>
    [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }

  const originalFetch = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, options?: RequestInit) => {
    const url = String(input);
    requests.push(url);
    if (url === `${base}/topics`) return json([{
      id: 1, slug: 'java', code: 'JAVA', name: 'Java', description: 'Java subject',
      iconSvg: '<svg/>', status: 'AVAILABLE', sortOrder: 0,
      category: { id: 1, code: 'BACKEND', name: 'Backend', sortOrder: 0 },
    }]);
    if (url === `${base}/topics/1/structure`) return json({
      version: 1, root: { kind: 'GROUP', children: [
        { kind: 'MODULE', nodeKey: 'JAVA_OOP', slug: 'java-oop',
          name: 'OOP', path: '/java/oop', children: [] },
        { kind: 'MODULE', nodeKey: 'JAVA_STREAM', slug: 'java-stream',
          name: 'Stream', path: '/java/stream', children: [] },
      ] },
    });
    return content(url, options);
  }) as typeof fetch;

  const host = browser.document.createElement('main');
  browser.document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(
      <LanguageProvider>
        <SwitchLanguage />
        <MemoryRouter initialEntries={['/learning/java/knowledge/java-oop']}>
          <ChangeModule />
          <Routes>
            <Route path="/learning/:topicSlug/knowledge/:moduleSlug"
              element={<TopicStructurePage />} />
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


test('real Topic page fetches Roadmap and Reference lazily using database SLUG, never static YAML', async () => {
  await withDbTopic((url) => {
    if (url === `${base}/modules/java-oop/roadmap?lang=vi`) return json(viMilestones);
    if (url === `${base}/modules/java-oop/reference?lang=vi`) return json(viReferences);
    throw new Error(`Unexpected URL: ${url}`);
  }, async (host, requests) => {
    const roadmapTab = host.querySelector<HTMLButtonElement>('.module-tabs__button--roadmap');
    const referenceTab = host.querySelector<HTMLButtonElement>('.module-tabs__button--reference');
    assert.ok(roadmapTab);
    assert.ok(referenceTab);
    assert.equal(requests.filter((url) => url.includes('/roadmap?') || url.includes('/reference?')).length, 0,
      'Content should load on demand, not when opening module navigation');

    await act(async () => roadmapTab.click());
    assert.match(host.querySelector('.roadmap-panel')?.textContent ?? '', /Lớp và đối tượng/);
    assert.match(host.querySelector('.roadmap-panel')?.textContent ?? '', /Đóng gói/);
    const titles = Array.from(host.querySelectorAll('.roadmap-milestone__title'))
      .map((item) => item.textContent);
    assert.deepEqual(titles, ['Lớp và đối tượng', 'Đóng gói']);
    assert.equal(host.querySelectorAll('.roadmap-related__card').length, 0,
      'Oracle does not store relatedModules so the frontend must not invent links');

    await act(async () => referenceTab.click());
    assert.match(host.querySelector('.reference-panel')?.textContent ?? '', /Đặc tả Java/);
    assert.match(host.querySelector('.reference-panel')?.textContent ?? '', /Tài liệu API Java/);
    const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('.reference-card a'))
      .map((item) => item.href);
    assert.deepEqual(links, [
      'https://docs.oracle.com/javase/specs/',
      'https://docs.oracle.com/javase/21/docs/api/',
    ]);
    assert.deepEqual(
      requests.filter((url) => url.includes('/roadmap?') || url.includes('/reference?')),
      [
        `${base}/modules/java-oop/roadmap?lang=vi`,
        `${base}/modules/java-oop/reference?lang=vi`,
      ],
    );
    assert.equal(requests.filter((url) => url.includes('/language/java')).length, 0);
  });
});

test('Reference language switch clears VI immediately, shows EN after completion, no fallback', async () => {
  let releaseEnglish!: (response: Response) => void;
  const english = new Promise<Response>((resolve) => { releaseEnglish = resolve; });

  await withDbTopic((url) => {
    if (url === `${base}/modules/java-oop/reference?lang=vi`) return json(viReferences);
    if (url === `${base}/modules/java-oop/reference?lang=en`) return english;
    throw new Error(`Unexpected URL: ${url}`);
  }, async (host, requests) => {
    await act(async () => host.querySelector<HTMLButtonElement>('.module-tabs__button--reference')?.click());
    assert.match(host.querySelector('.reference-panel')?.textContent ?? '', /Đặc tả Java/);

    await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="switch-language"]')?.click());
    assert.equal(host.querySelector('.reference-panel'), null,
      'The previous VI document must not appear while the English request is unresolved');
    assert.match(host.textContent ?? '', /Loading references/);
    assert.ok(requests.includes(`${base}/modules/java-oop/reference?lang=en`));

    await act(async () => releaseEnglish(json({
      slug: 'java-oop', languageCode: 'en',
      references: [
        { id: 60, title: 'English Java Docs', url: 'https://docs.oracle.com/javase/specs/',
          description: 'English description', sortOrder: 1 },
      ],
    })));
    assert.match(host.querySelector('.reference-panel')?.textContent ?? '', /English Java Docs/);
    assert.doesNotMatch(host.querySelector('.reference-panel')?.textContent ?? '', /Đặc tả Java/);
  });
});

test('new module selects its own Roadmap, while 404 and server failure are visible states', async () => {
  await withDbTopic((url) => {
    if (url === `${base}/modules/java-oop/roadmap?lang=vi`) return json(viMilestones);
    if (url === `${base}/modules/java-stream/roadmap?lang=vi`) return json({
      slug: 'java-stream', languageCode: 'vi',
      roadmap: [{ id: 100, title: 'Stream API', purpose: 'Learn streams',
        objectives: [], sortOrder: 1 }],
    });
    if (url === `${base}/modules/java-stream/reference?lang=vi`)
      return new Response('', { status: 404 });
    if (url === `${base}/modules/java-oop/reference?lang=vi`)
      return new Response('', { status: 503 });
    throw new Error(`Unexpected URL: ${url}`);
  }, async (host, requests) => {
    await act(async () => host.querySelector<HTMLButtonElement>('.module-tabs__button--reference')?.click());
    assert.match(host.textContent ?? '', /HTTP 503/);

    await act(async () => host.querySelector<HTMLButtonElement>('.module-tabs__button--roadmap')?.click());
    assert.match(host.querySelector('.roadmap-panel')?.textContent ?? '', /Lớp và đối tượng/);

    await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="change-module"]')?.click());
    assert.equal(host.querySelector('.roadmap-panel'), null,
      'Old module cards must unmount when the route changes');

    await act(async () => host.querySelector<HTMLButtonElement>('.module-tabs__button--roadmap')?.click());
    assert.match(host.querySelector('.roadmap-panel')?.textContent ?? '', /Stream API/);
    assert.doesNotMatch(host.querySelector('.roadmap-panel')?.textContent ?? '', /Lớp và đối tượng/);
    await act(async () => host.querySelector<HTMLButtonElement>('.module-tabs__button--reference')?.click());
    assert.match(host.textContent ?? '', /Module chưa có tài liệu tham khảo/);
    assert.ok(requests.includes(`${base}/modules/java-stream/reference?lang=vi`));
  });
});

test('Roadmap language change never flashes VI milestones while EN is pending', async () => {
  let resolveEnglish!: (result: Response) => void;
  const english = new Promise<Response>((resolve) => { resolveEnglish = resolve; });
  await withDbTopic((url) => {
    if (url === `${base}/modules/java-oop/roadmap?lang=vi`) return json(viMilestones);
    if (url === `${base}/modules/java-oop/roadmap?lang=en`) return english;
    throw new Error(`Unexpected URL: ${url}`);
  }, async (host, requests) => {
    await act(async () => host.querySelector<HTMLButtonElement>('.module-tabs__button--roadmap')?.click());
    assert.match(host.querySelector('.roadmap-panel')?.textContent ?? '', /Đóng gói/);
    await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="switch-language"]')?.click());
    assert.equal(host.querySelector('.roadmap-panel'), null);
    assert.match(host.textContent ?? '', /Loading Roadmap/);
    assert.ok(requests.includes(`${base}/modules/java-oop/roadmap?lang=en`));

    await act(async () => resolveEnglish(json({
      slug: 'java-oop', languageCode: 'en', roadmap: [
        { id: 88, title: 'Encapsulation', purpose: 'Protect invariants',
          objectives: ['Expose a stable interface'], sortOrder: 1 },
      ],
    })));
    assert.match(host.querySelector('.roadmap-panel')?.textContent ?? '', /Encapsulation/);
    assert.doesNotMatch(host.querySelector('.roadmap-panel')?.textContent ?? '', /Đóng gói/);
  });
});

test('API errors offer Retry without reloading the topic structure', async () => {
  let roadmapRequests = 0;
  let referenceRequests = 0;
  await withDbTopic((url) => {
    if (url === `${base}/modules/java-oop/roadmap?lang=vi`) {
      roadmapRequests += 1;
      return roadmapRequests === 1 ? new Response('', { status: 503 }) : json(viMilestones);
    }
    if (url === `${base}/modules/java-oop/reference?lang=vi`) {
      referenceRequests += 1;
      return referenceRequests === 1 ? new Response('', { status: 502 }) : json(viReferences);
    }
    throw new Error(`Unexpected URL: ${url}`);
  }, async (host, requests) => {
    await act(async () => host.querySelector<HTMLButtonElement>('.module-tabs__button--roadmap')?.click());
    assert.match(host.textContent ?? '', /HTTP 503/);
    await act(async () => host.querySelector<HTMLButtonElement>('.learning-tab-panel button')?.click());
    assert.match(host.querySelector('.roadmap-panel')?.textContent ?? '', /Lớp và đối tượng/);
    assert.equal(roadmapRequests, 2);

    await act(async () => host.querySelector<HTMLButtonElement>('.module-tabs__button--reference')?.click());
    assert.match(host.textContent ?? '', /HTTP 502/);
    await act(async () => host.querySelector<HTMLButtonElement>('.learning-tab-panel button')?.click());
    assert.match(host.querySelector('.reference-panel')?.textContent ?? '', /Đặc tả Java/);
    assert.equal(referenceRequests, 2);
    assert.equal(requests.filter((url) => url === `${base}/topics/1/structure`).length, 1,
      'Retrying a content API must not reload the module catalog');
  });
});
