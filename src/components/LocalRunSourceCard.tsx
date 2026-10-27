import { useCallback, useEffect, useRef, useState } from 'react';
import {
  localRunApi, localRunTrackingId, LocalRunHttpError, sourceZipName,
  type LocalRunArtifactResponse, type LocalRunBuildStatus,
} from '../data/localRun';
import { isLocalRunNotFound, waitForLocalRunArtifact, watchLocalRunBuild } from '../data/localRunMonitor';
import { shouldRefreshLocalRunOnReturn } from '../data/localRunRefresh';
import { useLanguage } from '../state/LanguageContext';

const ACTIONS_URL = 'https://github.com/phuongnguyenit93/java-learning/actions/workflows/local-run-source-build.yml';
const RELEASE_URL = 'https://github.com/phuongnguyenit93/java-learning/releases/tag/local-run';

function trustedRunUrl(value?: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'github.com'
      && /^\/phuongnguyenit93\/java-learning\/actions\/runs\/[0-9]+\/?$/.test(url.pathname)
      && !url.search && !url.hash ? url.toString() : null;
  } catch { return null; }
}

function trustedZipUrl(value: string | undefined, filename: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'github.com'
      && url.pathname === `/phuongnguyenit93/java-learning/releases/download/local-run/${filename}`
      && !url.search && !url.hash ? url.toString() : null;
  } catch { return null; }
}

type CardStatus = LocalRunBuildStatus | 'IDLE' | 'SUBMITTING' | 'PUBLISHING';

export function LocalRunSourceCard({ moduleId, moduleName, sourceFingerprint }: {
  moduleId: string;
  moduleName: string;
  sourceFingerprint: string;
}) {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(true);
  const [artifact, setArtifact] = useState<LocalRunArtifactResponse>({
    moduleId, fileName: sourceZipName(moduleId), available: false,
  });
  const [artifactChecking, setArtifactChecking] = useState(true);
  const [artifactChecked, setArtifactChecked] = useState(false);
  const [artifactError, setArtifactError] = useState<string | null>(null);
  const [status, setStatus] = useState<CardStatus>('IDLE');
  const [statusChecked, setStatusChecked] = useState(false);
  const [statusRetry, setStatusRetry] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [runUrl, setRunUrl] = useState<string | null>(null);
  const [reused, setReused] = useState(false);
  const [publishingExpired, setPublishingExpired] = useState(false);
  const [needsReview, setNeedsReview] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [clock, setClock] = useState(Date.now());
  const controllerRef = useRef<AbortController | null>(null);
  const trackingRef = useRef(false);
  const submittingRef = useRef(false);
  const artifactRef = useRef(false);
  const lastRead = useRef(0);
  const checkSequence = useRef(0);
  const checkedJob = useRef(false);

  const t = language === 'vi' ? {
    module: 'Module', fingerprint: 'Source fingerprint',
    checking: 'Đang kiểm tra Source ZIP...',
    ready: 'Source ZIP đã sẵn sàng để tải.',
    missing: 'Chưa có Source ZIP cho phiên bản module này.',
    stale: 'Source ZIP hiện có đã cũ so với phiên bản hiện tại.',
    unknown: 'Chưa thể xác minh trạng thái Source ZIP.',
    build: 'Build Source', download: 'Download Source', refresh: 'Làm mới Source',
    submitting: 'Submitting', queued: 'Queued', building: 'Building',
    publishing: 'Publishing Source', done: 'Sẵn sàng', failed: 'Build failed',
    buildingHint: 'GitHub Actions đang xây dựng Source ZIP.',
    publishingHint: 'Build thành công, đang đợi Source ZIP được phát hành.',
    notPublished: 'GitHub Actions thành công nhưng ZIP chưa xuất hiện trên Release. Hãy làm mới trạng thái.',
    noDownload: 'Source ZIP đã sẵn sàng nhưng chưa có URL tải hợp lệ.',
    reconnect: 'Kết nối lại trạng thái Source',
    unavailable: 'Không thể kiểm tra trạng thái Build Source; hãy kết nối lại trước khi build.',
    rejected: 'Yêu cầu Build Source bị từ chối.',
    conflict: 'Phiên bản Source khác đang được build.',
    rateLimited: 'Quá giới hạn build; vui lòng thử lại sau.',
    verify: 'Chưa xác minh được GitHub đã nhận yêu cầu. Kiểm tra GitHub Actions trước khi gửi lại.',
    review: 'Tôi đã kiểm tra GitHub Actions và xác nhận không có Source workflow đang chạy.',
    retry: 'Build lại Source',
    confirm: 'Build thành công nhưng chưa thấy Source ZIP. Bạn đã kiểm tra GitHub Actions và Release. Gửi lại?',
    action: 'Xem GitHub Actions', logs: 'Xem build log', progress: 'Xem tiến trình',
    release: 'Xem Release', reused: 'Đã kết nối vào Build Source hiện có.',
    statusTimeout: 'Không thể tiếp tục theo dõi Source. Kết nối lại để kiểm tra.',
    collapse: 'Thu gọn phần Source', expand: 'Mở rộng phần Source',
  } : {
    module: 'Module', fingerprint: 'Source fingerprint',
    checking: 'Checking Source ZIP...',
    ready: 'Source ZIP is ready for download.',
    missing: 'No Source ZIP is available for this module version.',
    stale: 'The published Source ZIP belongs to an older module version.',
    unknown: 'Source ZIP availability could not be verified.',
    build: 'Build Source', download: 'Download Source', refresh: 'Refresh Source',
    submitting: 'Submitting', queued: 'Queued', building: 'Building',
    publishing: 'Publishing Source', done: 'Ready', failed: 'Build failed',
    buildingHint: 'GitHub Actions is building the Source ZIP.',
    publishingHint: 'Build succeeded. Waiting for Source ZIP publication.',
    notPublished: 'GitHub Actions succeeded but the ZIP is not on the Release yet. Refresh to check again.',
    noDownload: 'Source ZIP exists but no valid download URL is available.',
    reconnect: 'Reconnect Source Status',
    unavailable: 'Source build status is unavailable. Reconnect before creating a build.',
    rejected: 'Source build request was rejected.',
    conflict: 'Another source version is building.',
    rateLimited: 'Build rate limit reached. Try again later.',
    verify: 'Could not verify whether GitHub accepted the request. Check GitHub Actions before retrying.',
    review: 'I checked GitHub Actions and confirmed no Source workflow is running.',
    retry: 'Rebuild Source',
    confirm: 'Build succeeded, but the Source ZIP is missing. Have you checked Actions and the Release? Retry?',
    action: 'View GitHub Actions', logs: 'View build log', progress: 'View progress',
    release: 'View Release', reused: 'Reconnected to an existing Source build.',
    statusTimeout: 'Source build tracking was interrupted. Reconnect to resume.',
    collapse: 'Collapse Source section', expand: 'Expand Source section',
  };
  const texts = useRef(t);
  texts.current = t;

  const filename = sourceZipName(moduleId);
  const downloadUrl = trustedZipUrl(artifact.downloadUrl, filename);
  const ready = artifact.available && !!downloadUrl;
  const inProgress = ['SUBMITTING', 'QUEUED', 'BUILDING', 'PUBLISHING'].includes(status);
  const cooldown = Math.max(0, Math.ceil((cooldownUntil - clock) / 1000));
  const canBuild = !!sourceFingerprint && statusChecked && artifactChecked && !artifactChecking
    && !artifactError && !statusRetry && !inProgress && cooldown === 0
    && (!needsReview || reviewed) && (!ready) && (status !== 'SUCCESS' || publishingExpired);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [cooldownUntil, cooldown > 0]);

  const refresh = useCallback(async (force = false, signal?: AbortSignal) => {
    if (!sourceFingerprint || artifactRef.current || submittingRef.current) return;
    const seq = ++checkSequence.current;
    artifactRef.current = true;
    lastRead.current = Date.now();
    setArtifactChecking(true);
    setArtifactError(null);
    try {
      const result = await localRunApi.getSourceArtifact(moduleId, sourceFingerprint, force);
      if (!signal?.aborted && seq === checkSequence.current) {
        setArtifact(result);
        setArtifactChecked(true);
        if (result.available && trustedZipUrl(result.downloadUrl, sourceZipName(moduleId))) {
          setError(null);
          setMessage(null);
          setPublishingExpired(false);
        }
      }
    } catch (err) {
      if (!signal?.aborted && seq === checkSequence.current) {
        setArtifactChecked(false);
        setArtifactError(err instanceof Error ? err.message : texts.current.unknown);
      }
    } finally {
      if (seq === checkSequence.current) {
        artifactRef.current = false;
        if (!signal?.aborted) setArtifactChecking(false);
      }
    }
  }, [moduleId, sourceFingerprint]);

  const follow = useCallback(async (controller: AbortController, afterDispatch = false) => {
    if (trackingRef.current || controller.signal.aborted) return;
    trackingRef.current = true;
    setStatusRetry(false);
    setStatusError(null);
    try {
      const result = await watchLocalRunBuild(
        (signal) => localRunApi.getSourceBuildStatus(localRunTrackingId(sourceFingerprint), moduleId, signal),
        (reply) => {
          if (controller.signal.aborted) return;
          checkedJob.current = true;
          setStatusChecked(true);
          setStatus(reply.status);
          setRunUrl((old) => trustedRunUrl(reply.runUrl) ?? old);
          setNeedsReview(false);
          setReviewed(false);
          setError(reply.status === 'FAILED' ? (reply.message ?? texts.current.failed) : null);
          if (reply.status === 'FAILED' || reply.status === 'SUCCESS') setReused(false);
        },
        { signal: controller.signal,
          maxConnectionFailureMs: afterDispatch || checkedJob.current ? 90_000 : 12_000 },
      );
      if (controller.signal.aborted || result.status !== 'SUCCESS') return;
      setStatus('PUBLISHING');
      setMessage(texts.current.publishingHint);
      artifactRef.current = true;
      checkSequence.current += 1;
      setArtifactChecking(true);
      setArtifactError(null);
      const published = await waitForLocalRunArtifact(
        () => localRunApi.getSourceArtifact(moduleId, sourceFingerprint, true),
        (value) => { if (!controller.signal.aborted) { setArtifact(value); setArtifactChecked(true); } },
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      setStatus('SUCCESS');
      const available = !!published?.available && !!trustedZipUrl(published.downloadUrl, sourceZipName(moduleId));
      setPublishingExpired(!available);
      setMessage(available ? null : texts.current.notPublished);
      if (!published) setArtifactChecked(false);
    } catch (err) {
      if (controller.signal.aborted) return;
      if (isLocalRunNotFound(err)) {
        checkedJob.current = false;
        setStatusChecked(true);
        setStatus('IDLE');
        setStatusRetry(false);
        if (afterDispatch) {
          setNeedsReview(true);
          setReviewed(false);
          setError(texts.current.verify);
        }
      } else {
        setStatusRetry(true);
        setStatusError(err instanceof Error ? err.message : texts.current.statusTimeout);
      }
    } finally {
      trackingRef.current = false;
      artifactRef.current = false;
      if (!controller.signal.aborted) setArtifactChecking(false);
    }
  }, [moduleId, sourceFingerprint]);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    ++checkSequence.current;
    artifactRef.current = false;
    submittingRef.current = false;
    checkedJob.current = false;
    trackingRef.current = false;
    lastRead.current = 0;
    setArtifact({ moduleId, fileName: sourceZipName(moduleId), available: false });
    setArtifactChecking(true);
    setArtifactChecked(false);
    setArtifactError(null);
    setStatus('IDLE');
    setStatusChecked(false);
    setStatusRetry(false);
    setStatusError(null);
    setError(null);
    setMessage(null);
    setRunUrl(null);
    setReused(false);
    setPublishingExpired(false);
    setNeedsReview(false);
    setReviewed(false);
    setCooldownUntil(0);
    if (sourceFingerprint) {
      void refresh(false, controller.signal);
      void follow(controller);
    } else {
      setArtifactChecking(false);
      setError(language === 'vi' ? 'Không xác định được source fingerprint.' : 'Source fingerprint is unavailable.');
    }
    const onReturn = () => {
      if (document.visibilityState === 'visible'
        && shouldRefreshLocalRunOnReturn(lastRead.current, Date.now(), artifactRef.current || submittingRef.current || trackingRef.current)) {
        void refresh(false, controller.signal);
      }
    };
    document.addEventListener('visibilitychange', onReturn);
    window.addEventListener('focus', onReturn);
    return () => {
      controller.abort();
      ++checkSequence.current;
      if (controllerRef.current === controller) controllerRef.current = null;
      document.removeEventListener('visibilitychange', onReturn);
      window.removeEventListener('focus', onReturn);
    };
    // State and polling should continue across language switches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, sourceFingerprint, refresh, follow]);

  const build = async (rebuild = false) => {
    const controller = controllerRef.current;
    if (!controller || controller.signal.aborted || !canBuild || submittingRef.current) return;
    if (rebuild && !window.confirm(t.confirm)) return;
    submittingRef.current = true;
    checkSequence.current += 1;
    setArtifactChecking(false);
    setStatus('SUBMITTING');
    setMessage(null);
    setError(null);
    setRunUrl(null);
    setPublishingExpired(false);
    try {
      const reply = await localRunApi.startSourceBuild({ moduleId, sourceFingerprint }, controller.signal);
      if (controller.signal.aborted) return;
      setStatus(reply.status);
      setRunUrl(trustedRunUrl(reply.runUrl));
      setReused(reply.result === 'REUSED');
      checkedJob.current = true;
      setNeedsReview(false);
      setReviewed(false);
      submittingRef.current = false;
      await follow(controller, true);
    } catch (err) {
      if (controller.signal.aborted) return;
      submittingRef.current = false;
      if (err instanceof LocalRunHttpError
        && [400, 401, 403, 404, 409, 413, 415, 422, 429].includes(err.status)) {
        setStatus('IDLE');
        setError(`${err.status === 409 ? t.conflict : err.status === 429 ? t.rateLimited : t.rejected} ${err.message}`);
        if (err.status === 429) setCooldownUntil(Date.now() + (err.retryAfterSeconds ?? 60) * 1000);
      } else {
        setMessage(t.verify);
        await follow(controller, true);
      }
    } finally {
      submittingRef.current = false;
    }
  };

  const retryStatus = () => {
    const controller = controllerRef.current;
    if (controller && !trackingRef.current) void follow(controller);
  };
  const statusText = status === 'SUBMITTING' ? t.submitting : status === 'QUEUED' ? t.queued
    : status === 'BUILDING' ? t.building : status === 'PUBLISHING' ? t.publishing
      : status === 'FAILED' ? t.failed : status === 'SUCCESS' ? t.done : null;
  const progressIndex = status === 'SUBMITTING' ? 0 : status === 'QUEUED' ? 1 : status === 'BUILDING' ? 2
    : status === 'PUBLISHING' ? 3 : status === 'SUCCESS' ? 4 : -1;

  return (
    <article className={`local-run-card local-run-card--source${expanded ? '' : ' is-collapsed'}`} aria-label="Build Source">
      <div className="local-run-build-heading">
        <div className="local-run-card__heading">
          <span className="local-run-card__eyebrow">Local Run</span>
          <h2>Build Source</h2>
        </div>
        <button type="button" className="local-run-build-toggle" aria-expanded={expanded}
          aria-controls="local-run-source-content" aria-label={expanded ? t.collapse : t.expand}
          onClick={() => setExpanded((old) => !old)}><span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
      </div>
      {expanded && <div id="local-run-source-content">
        <dl className="local-run-meta">
          <div><dt>{t.module}</dt><dd>{moduleName}</dd></div>
          <div><dt>{t.fingerprint}</dt><dd title={sourceFingerprint}>{sourceFingerprint ? sourceFingerprint.slice(0, 12) : '—'}</dd></div>
        </dl>
        <div className={`local-run-artifact-state${ready ? ' is-ready' : ''}${artifactError ? ' is-unavailable' : ''}`} aria-live="polite">
          <span className="local-run-artifact-state__icon" aria-hidden="true">{ready ? '✓' : artifactError ? '!' : '○'}</span>
          <div>
            <strong>{status === 'PUBLISHING' ? t.publishingHint
              : status === 'SUBMITTING' || status === 'QUEUED' || status === 'BUILDING' ? t.buildingHint
                : artifactChecking ? t.checking : ready ? t.ready
                  : artifactError || !artifactChecked ? t.unknown
                    : artifact.stale ? t.stale : artifact.available ? t.noDownload : t.missing}</strong>
            <span>{filename}</span>
          </div>
        </div>
        {status !== 'IDLE' && <div className="local-run-progress" aria-live="polite">
          <div className="local-run-progress__steps">
            {([t.submitting, t.queued, t.building, t.publishing, t.done] as const).map((label, index) => (
              <div key={index} className={`local-run-progress__step${index < progressIndex || (index === 4 && ready) ? ' is-active' : ''}${index === progressIndex && inProgress ? ' is-current' : ''}${index === 4 && ready ? ' is-success' : ''}`}>
                <span>{index < progressIndex || (index === 4 && ready) ? '✓' : index + 1}</span><strong>{label}</strong>
              </div>
            ))}
          </div>
          {inProgress && <div className="local-run-progress__activity" aria-hidden="true"><span /></div>}
        </div>}
        <div className="local-run-card__actions">
          {ready
            ? <a className="local-run-button local-run-button--download" href={downloadUrl!} download={filename}>↓ {t.download}</a>
            : <button className="local-run-button local-run-button--build" type="button" disabled={!canBuild}
                onClick={() => void build(status === 'SUCCESS' && publishingExpired)}>
                ▶ {inProgress ? statusText : cooldown ? `${t.build} (${cooldown}s)`
                  : status === 'SUCCESS' && publishingExpired ? t.retry : t.build}
              </button>}
          <button className="local-run-button local-run-button--refresh" type="button"
            disabled={!sourceFingerprint || artifactChecking || inProgress} onClick={() => void refresh(true, controllerRef.current?.signal)}>
            ↻ {t.refresh}
          </button>
          {statusRetry && <button className="local-run-button local-run-button--refresh" type="button"
            onClick={retryStatus}>↻ {t.reconnect}</button>}
          {runUrl && <a className="local-run-button local-run-button--refresh" href={runUrl}
            target="_blank" rel="noopener noreferrer">{status === 'SUCCESS' || status === 'FAILED' ? t.logs : t.progress} ↗</a>}
          {needsReview && <a className="local-run-button local-run-button--refresh" href={ACTIONS_URL}
            target="_blank" rel="noopener noreferrer">{t.action} ↗</a>}
          {(status === 'SUCCESS' || publishingExpired) && <a className="local-run-button local-run-button--refresh"
            href={RELEASE_URL} target="_blank" rel="noopener noreferrer">{t.release} ↗</a>}
        </div>
        {needsReview && <label className="local-run-backend-note local-run-review">
          <input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} />
          {t.review}
        </label>}
        {reused && inProgress && <p className="local-run-backend-note" role="status">{t.reused}</p>}
        {!statusChecked && !statusRetry && <p className="local-run-backend-note" role="status">{t.checking}</p>}
        {statusRetry && <p className="local-run-backend-note" role="status">{t.unavailable} {statusError}</p>}
        {message && <p className="local-run-backend-note" role="status">{message}</p>}
        {artifactError && <p className="local-run-backend-note local-run-backend-note--error" role="alert">{t.unknown} {artifactError}</p>}
        {error && <p className="local-run-backend-note local-run-backend-note--error" role="alert">{error}</p>}
      </div>}
    </article>
  );
}
