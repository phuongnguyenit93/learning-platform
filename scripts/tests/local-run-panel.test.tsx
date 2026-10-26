import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { isDefiniteBuildRejection, LocalRunPanel, safeBuildRunUrl } from '../../src/components/LocalRunPanel';
import { LanguageProvider } from '../../src/state/LanguageContext';
import { localRunApi, LocalRunHttpError, type LocalRunArtifactResponse } from '../../src/data/localRun';

const MODULE = 'DATABASE_MYSQL';
const FP = 'a'.repeat(64);
const missing = (): LocalRunArtifactResponse => ({ moduleId: MODULE, available: false, fileName: 'database_mysql.jar' });

interface Mounted {
  container: HTMLElement;
  click: (label: string) => Promise<void>;
  button: (label: string) => HTMLButtonElement;
}

async function mount(t: Parameters<Parameters<typeof test>[1]>[0], moduleType = 'SERVLET'): Promise<Mounted> {
  const browser = new Window({ url: 'http://localhost:5000' });
  const originals = new Map<string, PropertyDescriptor | undefined>();
  for (const [key, value] of Object.entries({
    window: browser, document: browser.document, navigator: browser.navigator,
    HTMLElement: browser.HTMLElement, Event: browser.Event,
    MutationObserver: browser.MutationObserver, DOMException: browser.DOMException,
    IS_REACT_ACT_ENVIRONMENT: true,
  })) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  const container = browser.document.createElement('div');
  browser.document.body.append(container);
  const root: Root = createRoot(container);
  await act(async () => {
    root.render(<LanguageProvider><LocalRunPanel moduleId={MODULE}
      moduleName="Database MySQL" sourceFingerprint={FP} moduleType={moduleType} /></LanguageProvider>);
  });
  t.after(async () => {
    await act(async () => { root.unmount(); });
    await browser.happyDOM.abort();
    for (const [key, desc] of originals) {
      if (desc) Object.defineProperty(globalThis, key, desc);
      else Reflect.deleteProperty(globalThis, key);
    }
  });
  const button = (label: string): HTMLButtonElement => {
    const found = [...container.querySelectorAll('button')].find((candidate) =>
      candidate.textContent?.includes(label));
    assert.ok(found, `Missing button containing ${label}; got ${container.textContent?.slice(0, 500)}`);
    return found as HTMLButtonElement;
  };
  const click = async (label: string) => {
    await act(async () => { button(label).click(); });
  };
  return { container, button, click };
}

test('Execution Context switch updates run command only, defaults OFF, and preserves Swagger', async (t) => {
  t.mock.method(localRunApi, 'getBuildStatus', async () => { throw new LocalRunHttpError(404, 'No job'); });
  t.mock.method(localRunApi, 'getArtifact', async () => missing());
  const ui = await mount(t);
  const checkbox = ui.container.querySelector('.local-run-execution-context input') as HTMLInputElement;
  const command = () => ui.container.querySelector('.local-run-command code')?.textContent ?? '';
  assert.ok(checkbox);
  assert.equal(checkbox.checked, false);
  assert.match(command(), /--execution-context.enabled=false/);
  assert.match(command(), /--swagger.enabled=TRUE/);
  await act(async () => { checkbox.click(); });
  assert.equal(checkbox.checked, true);
  assert.match(command(), /--execution-context.enabled=true/);
  assert.match(command(), /--swagger.enabled=TRUE/);
  await act(async () => { checkbox.click(); });
  assert.match(command(), /--execution-context.enabled=false/);
});

test('Reactive Local Run cannot enable unsupported Servlet Execution Context', async (t) => {
  t.mock.method(localRunApi, 'getBuildStatus', async () => { throw new LocalRunHttpError(404, 'No job'); });
  t.mock.method(localRunApi, 'getArtifact', async () => missing());
  const ui = await mount(t, 'REACTIVE');
  const checkbox = ui.container.querySelector('.local-run-execution-context input') as HTMLInputElement;
  assert.ok(checkbox.disabled);
  assert.match(ui.container.querySelector('.local-run-command code')?.textContent ?? '', /--execution-context.enabled=false/);
});

test('Worker job 404 enables a new Build, and a missing JAR is not marked ready', async (t) => {
  t.mock.method(localRunApi, 'getBuildStatus', async () => { throw new LocalRunHttpError(404, 'No job'); });
  t.mock.method(localRunApi, 'getArtifact', async () => missing());
  const ui = await mount(t);
  assert.equal(ui.button('Build JAR').disabled, false);
  assert.match(ui.container.textContent ?? '', /Chưa có executable JAR/);
});

test('HTTP 429 is a definite rejection with cooldown; no second status request', async (t) => {
  let getCalls = 0;
  t.mock.method(localRunApi, 'getBuildStatus', async () => {
    getCalls++;
    throw new LocalRunHttpError(404, 'Not found');
  });
  t.mock.method(localRunApi, 'getArtifact', async () => missing());
  t.mock.method(localRunApi, 'startBuild', async () => {
    throw new LocalRunHttpError(429, 'Too many new build requests', 60);
  });
  const ui = await mount(t);
  assert.equal(getCalls, 1);
  await ui.click('Build JAR');
  assert.match(ui.container.textContent ?? '', /giới hạn tạo Build mới/);
  assert.equal(ui.button('Build JAR').disabled, true);
  assert.equal(getCalls, 1, 'no POST rejection should trigger status reconciliation');
});

test('HTTP 409 conflict is explained rather than shown as connection loss', async (t) => {
  let getCalls = 0;
  t.mock.method(localRunApi, 'getBuildStatus', async () => {
    getCalls++;
    throw new LocalRunHttpError(404, 'Not found');
  });
  t.mock.method(localRunApi, 'getArtifact', async () => missing());
  t.mock.method(localRunApi, 'startBuild', async () => {
    throw new LocalRunHttpError(409, 'Another source version is building.');
  });
  const ui = await mount(t);
  await ui.click('Build JAR');
  assert.match(ui.container.textContent ?? '', /phiên bản khác/);
  assert.doesNotMatch(ui.container.textContent ?? '', /đang thử nối lại/);
  assert.equal(getCalls, 1);
});

test('HTTP 403 is a definite authorization rejection, without status reconciliation', async (t) => {
  let statusCalls = 0;
  t.mock.method(localRunApi, 'getBuildStatus', async () => {
    statusCalls++;
    throw new LocalRunHttpError(404, 'Not found');
  });
  t.mock.method(localRunApi, 'getArtifact', async () => missing());
  t.mock.method(localRunApi, 'startBuild', async () => {
    throw new LocalRunHttpError(403, 'Access denied');
  });
  const ui = await mount(t);
  await ui.click('Build JAR');
  assert.equal(statusCalls, 1);
  assert.match(ui.container.textContent ?? '', /bị từ chối/);
  assert.equal(ui.button('Build JAR').disabled, false, 'definite rejection may be corrected and retried');
});

test('Worker status unavailable provides reconnect, not an incorrect Build or phantom queue', async (t) => {
  let calls = 0;
  t.mock.method(localRunApi, 'getBuildStatus', async () => {
    calls++;
    throw new LocalRunHttpError(calls === 1 ? 403 : 404, calls === 1 ? 'Status unavailable' : 'No job');
  });
  t.mock.method(localRunApi, 'getArtifact', async () => missing());
  const ui = await mount(t);
  assert.match(ui.container.textContent ?? '', /Dịch vụ Build tạm thời không khả dụng/);
  assert.equal(ui.button('Build JAR').disabled, true);
  await ui.click('Thử kết nối lại trạng thái Build');
  assert.equal(calls, 2);
  assert.equal(ui.button('Build JAR').disabled, false);
  assert.doesNotMatch(ui.container.textContent ?? '', /Dịch vụ Build tạm thời không khả dụng/);
});

test('an existing FAILED job shows its exact failure, not an endless loading state', async (t) => {
  t.mock.method(localRunApi, 'getArtifact', async () => missing());
  t.mock.method(localRunApi, 'getBuildStatus', async () => ({
    moduleId: MODULE, runId: `job-${FP}`, status: 'FAILED' as const,
    message: 'GitHub Actions build failed.',
    runUrl: 'https://github.com/phuongnguyenit93/java-learning/actions/runs/56789',
  }));
  const ui = await mount(t);
  assert.match(ui.container.textContent ?? '', /GitHub Actions build failed/);
  assert.equal(ui.button('Build JAR').disabled, false);
  assert.ok(ui.container.querySelector('a[href$="/actions/runs/56789"]'));
});

test('already published JAR is immediately downloadable even without a Durable Object job', async (t) => {
  t.mock.method(localRunApi, 'getBuildStatus', async () => { throw new LocalRunHttpError(404, 'No job'); });
  t.mock.method(localRunApi, 'getArtifact', async () => ({
    ...missing(), available: true,
    downloadUrl: 'https://github.com/phuongnguyenit93/java-learning/releases/download/local-run/database_mysql.jar',
  }));
  const ui = await mount(t);
  assert.match(ui.container.textContent ?? '', /Executable JAR đã sẵn sàng/);
  assert.ok(ui.container.querySelector('a.local-run-button--download'));
  assert.equal([...ui.container.querySelectorAll('button')].filter((item) => item.textContent?.includes('Build JAR')).length, 0);
});

test('active build does not falsely claim the JAR is missing', async (t) => {
  t.mock.method(localRunApi, 'getArtifact', async () => missing());
  t.mock.method(localRunApi, 'getBuildStatus', async () => ({
    moduleId: MODULE, runId: `job-${FP}`, status: 'BUILDING' as const,
  }));
  const ui = await mount(t);
  assert.match(ui.container.textContent ?? '', /JAR đang được xây dựng trên GitHub Actions/);
  assert.doesNotMatch(ui.container.textContent ?? '', /Chưa có executable JAR cho phiên bản này/);
  assert.equal(ui.button('Building').disabled, true);
});

test('ambiguous dispatch and subsequent 404 require explicit user review before a retry', async (t) => {
  let getCalls = 0;
  t.mock.method(localRunApi, 'getBuildStatus', async () => {
    getCalls++;
    throw new LocalRunHttpError(404, 'No job');
  });
  t.mock.method(localRunApi, 'getArtifact', async () => missing());
  t.mock.method(localRunApi, 'startBuild', async () => { throw new TypeError('Network dropped'); });
  const ui = await mount(t);
  await ui.click('Build JAR');
  assert.equal(getCalls, 2, 'only GET status is retried');
  assert.equal(ui.button('Build JAR').disabled, true);
  assert.match(ui.container.textContent ?? '', /Chưa xác minh được GitHub/);
  const check = ui.container.querySelector('.local-run-review input') as HTMLInputElement;
  assert.ok(check);
  await act(async () => { check.click(); });
  assert.equal(ui.button('Build JAR').disabled, false, 'retry requires explicit acknowledgement');
});

test('artifact lookup errors never masquerade as a missing JAR; Refresh can recover', async (t) => {
  t.mock.method(localRunApi, 'getBuildStatus', async () => { throw new LocalRunHttpError(404, 'No job'); });
  let reads = 0;
  t.mock.method(localRunApi, 'getArtifact', async () => {
    if (++reads === 1) throw new TypeError('GitHub offline');
    return missing();
  });
  const ui = await mount(t);
  assert.match(ui.container.textContent ?? '', /Chưa thể kiểm tra trạng thái JAR/);
  assert.equal(ui.button('Build JAR').disabled, true);
  await ui.click('Làm mới trạng thái JAR');
  assert.equal(ui.button('Build JAR').disabled, false);
});

test('successful reused run unlocks download only after release asset is verified', async (t) => {
  let statusCalls = 0;
  t.mock.method(localRunApi, 'getBuildStatus', async () => {
    statusCalls++;
    if (statusCalls === 1) throw new LocalRunHttpError(404, 'Not found');
    return { moduleId: MODULE, runId: `job-${FP}`, status: 'SUCCESS' as const,
      runUrl: 'https://github.com/phuongnguyenit93/java-learning/actions/runs/12345' };
  });
  let assetCalls = 0;
  t.mock.method(localRunApi, 'getArtifact', async () => ({
    ...missing(), available: ++assetCalls >= 2,
    downloadUrl: assetCalls >= 2
      ? 'https://github.com/phuongnguyenit93/java-learning/releases/download/local-run/database_mysql.jar'
      : undefined,
  }));
  t.mock.method(localRunApi, 'startBuild', async () => ({
    moduleId: MODULE, status: 'BUILDING' as const, result: 'REUSED' as const,
    runId: `job-${FP}`,
  }));
  const ui = await mount(t);
  await ui.click('Build JAR');
  assert.match(ui.container.textContent ?? '', /Download JAR/);
  const anchor = ui.container.querySelector('a[href*="/actions/runs/12345"]');
  assert.ok(anchor, 'link to verified run should be available');
});

test('copy failure is visible and localhost opens only after user starts the JAR', async (t) => {
  t.mock.method(localRunApi, 'getBuildStatus', async () => { throw new LocalRunHttpError(404, 'Not found'); });
  t.mock.method(localRunApi, 'getArtifact', async () => missing());
  const ui = await mount(t);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
    writeText: async () => { throw new Error('Permission denied'); },
  } });
  await ui.click('Copy');
  assert.match(ui.container.textContent ?? '', /Không thể sao chép tự động/);
  assert.equal(ui.container.querySelector('a[href^="http://localhost:9000"]'), null);
  const check = ui.container.querySelector('.local-run-started input') as HTMLInputElement;
  await act(async () => { check.click(); });
  assert.ok(ui.container.querySelector('a[href^="http://localhost:9000"]'));
  await ui.click('macOS');
  assert.match(ui.container.textContent ?? '', /usr\/libexec\/java_home/);
});

test('run URL validation allows only expected GitHub workflow links', () => {
  assert.equal(safeBuildRunUrl('https://github.com/phuongnguyenit93/java-learning/actions/runs/123'), 'https://github.com/phuongnguyenit93/java-learning/actions/runs/123');
  for (const unsafe of ['javascript:alert(1)', 'https://evil.example/actions/runs/123',
    'https://github.com/phuongnguyenit93/java-learning/actions/runs/abc',
    'https://github.com/phuongnguyenit93/java-learning/actions/runs/1?token=anything']) {
    assert.equal(safeBuildRunUrl(unsafe), null);
  }
});

test('HTTP 408 is ambiguous; only explicitly rejected statuses skip safe reconciliation', () => {
  for (const status of [400, 401, 403, 404, 409, 413, 415, 422, 429]) {
    assert.equal(isDefiniteBuildRejection(new LocalRunHttpError(status, 'Rejected')), true);
  }
  for (const status of [408, 425, 500, 502, 503]) {
    assert.equal(isDefiniteBuildRejection(new LocalRunHttpError(status, 'Unknown')), false);
  }
  assert.equal(isDefiniteBuildRejection(new TypeError('Network failed')), false);
});


test('Queued and Building show a link to the exact GitHub Actions run, not the workflow listing', async (t) => {
  for (const status of ['QUEUED', 'BUILDING'] as const) {
    await t.test(status, async (sub) => {
      sub.mock.method(localRunApi, 'getBuildStatus', async () => ({
        moduleId: MODULE, runId: `job-${FP}`, status,
        runUrl: 'https://github.com/phuongnguyenit93/java-learning/actions/runs/987654',
      }));
      sub.mock.method(localRunApi, 'getArtifact', async () => missing());
      const ui = await mount(sub);
      const anchor = ui.container.querySelector('a[href$="/actions/runs/987654"]');
      assert.ok(anchor);
      assert.match(anchor.textContent ?? '', /Xem ti/);
      assert.equal(ui.container.querySelector('a[href*="/actions/workflows/"]'), null);
    });
  }
});

test('A failed GitHub workflow keeps the exact build log link for debugging', async (t) => {
  t.mock.method(localRunApi, 'getBuildStatus', async () => ({
    moduleId: MODULE, runId: `job-${FP}`, status: 'FAILED' as const,
    runUrl: 'https://github.com/phuongnguyenit93/java-learning/actions/runs/987654',
    message: 'Gradle failed',
  }));
  t.mock.method(localRunApi, 'getArtifact', async () => missing());
  const ui = await mount(t);
  const anchor = ui.container.querySelector('a[href$="/actions/runs/987654"]');
  assert.ok(anchor);
  assert.match(anchor.textContent ?? '', /Xem build log/);
});

test('A successful GitHub workflow keeps its build log after the JAR is ready', async (t) => {
  t.mock.method(localRunApi, 'getBuildStatus', async () => ({
    moduleId: MODULE, runId: `job-${FP}`, status: 'SUCCESS' as const,
    runUrl: 'https://github.com/phuongnguyenit93/java-learning/actions/runs/987654',
  }));
  t.mock.method(localRunApi, 'getArtifact', async () => ({
    ...missing(), available: true,
    downloadUrl: 'https://github.com/phuongnguyenit93/java-learning/releases/download/local-run/database_mysql.jar',
  }));
  const ui = await mount(t);
  const anchor = ui.container.querySelector('a[href$="/actions/runs/987654"]');
  assert.ok(anchor);
  assert.match(anchor.textContent ?? '', /Xem build log/);
  assert.ok(ui.container.querySelector('a.local-run-button--download'));
});

test('No build run means no misleading generic Build log link', async (t) => {
  t.mock.method(localRunApi, 'getBuildStatus', async () => { throw new LocalRunHttpError(404, 'No job'); });
  t.mock.method(localRunApi, 'getArtifact', async () => missing());
  const ui = await mount(t);
  assert.equal(ui.container.querySelector('a[href*="/actions/workflows/"]'), null);
  assert.equal(ui.container.querySelector('a[href*="/actions/runs/"]'), null);
});
