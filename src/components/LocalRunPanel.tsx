import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { localRunApi, localRunTrackingId, type LocalRunArtifactResponse, type LocalRunBuildStatus } from '../data/localRun';
import { shouldRefreshLocalRunOnReturn } from '../data/localRunRefresh';
import {
  isLocalRunNotFound, waitForLocalRunArtifact, watchLocalRunBuild,
} from '../data/localRunMonitor';
import { useLanguage } from '../state/LanguageContext';

interface LocalRunPanelProps {
  moduleId: string;
  moduleName: string;
  sourceFingerprint: string;
}

const DEFAULT_PORT = 9000;
const DEFAULT_CONTEXT_PATH = '/api';
const DEFAULT_APPLICATION_NAME = 'api';
const SWAGGER_ENABLED = 'TRUE';

function toJarFileName(moduleId: string): string {
  const normalized = moduleId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${normalized || 'module'}.jar`;
}

export function LocalRunPanel({
  moduleId,
  moduleName,
  sourceFingerprint,
}: LocalRunPanelProps) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [buildStatus, setBuildStatus] = useState<LocalRunBuildStatus | 'IDLE'>('IDLE');
  const [buildMessage, setBuildMessage] = useState<string | null>(null);
  const [artifactChecking, setArtifactChecking] = useState(true);
  const [artifact, setArtifact] = useState<LocalRunArtifactResponse>({
    moduleId,
    available: false,
    fileName: toJarFileName(moduleId),
  });
  const [error, setError] = useState<string | null>(null);
  const [statusRetryNeeded, setStatusRetryNeeded] = useState(false);
  const checkSequence = useRef(0);
  const checkingRef = useRef(false);
  const buildingRef = useRef(false);
  const watchingRef = useRef(false);
  const trackingAbort = useRef<AbortController | null>(null);
  const lastCheckStartedAt = useRef(0);

  const jarFileName = useMemo(() => toJarFileName(moduleId), [moduleId]);
  const runCommand = `java --enable-preview -jar ${jarFileName} --server.port=${DEFAULT_PORT} --server.servlet.context-path=${DEFAULT_CONTEXT_PATH} --spring.application.name=${DEFAULT_APPLICATION_NAME} --swagger.enabled=${SWAGGER_ENABLED}`;
  const localUrl = `http://localhost:${DEFAULT_PORT}${DEFAULT_CONTEXT_PATH}`;

  const text = language === 'vi'
    ? {
        packageTitle: 'Build / Download JAR',
        module: 'Module',
        java: 'Java',
        missing: 'Chưa có executable JAR cho phiên bản này.',
        stale: 'Executable JAR hiện có đã cũ so với module hiện tại.',
        checking: 'Đang kiểm tra executable JAR...',
        refresh: 'Làm mới trạng thái JAR',
        fingerprintMissing: 'Không xác định được source fingerprint cho module này.',
        ready: 'Executable JAR đã sẵn sàng.',
        build: 'Build JAR',
        download: 'Download JAR',
        buildStarting: 'Đang gửi yêu cầu build...',
        queued: 'Queued',
        building: 'Building',
        successful: 'Build successful',
        failed: 'Build failed',
        retryStatus: 'Thử kết nối lại trạng thái Build',
        trackingLost: 'Không thể theo dõi Build lúc này. Thử kết nối lại; không cần gửi Build mới.',
        unconfirmed: 'Chưa xác nhận được yêu cầu Build trước đó. Kiểm tra GitHub Actions trước khi Build lại.',
        releasePending: 'Build thành công, nhưng JAR chưa xuất hiện trên Release. Hãy làm mới trạng thái JAR sau ít phút.',
        artifactPending: 'Artifact đã sẵn sàng nhưng chưa có download URL.',
        downloadPending: 'Artifact đã sẵn sàng nhưng chưa có download URL.',
        runTitle: 'Run Locally',
        runIntro: 'Tải JAR về máy và chạy bằng Java 21.',
        installTitle: 'Cài Java 21',
        installCopy: 'Cài JDK 21 nếu máy chưa có Java.',
        installAction: 'Download Java 21',
        envTitle: 'Thiết lập JAVA_HOME',
        envCopy: 'Trỏ JAVA_HOME tới thư mục JDK 21 và thêm %JAVA_HOME%\\bin vào Path.',
        verifyTitle: 'Kiểm tra Java',
        runJarTitle: 'Chạy JAR',
        openTitle: 'Mở ứng dụng',
        copy: 'Copy',
        copied: 'Đã copy',
        open: 'Open',
        portNote: 'Port 9000 là mặc định cho Local Run. Có thể đổi --server.port nếu port bị trùng.',
      }
    : {
        packageTitle: 'Build / Download JAR',
        module: 'Module',
        java: 'Java',
        missing: 'No executable JAR is available for this version.',
        stale: 'The available executable JAR is outdated for the current module version.',
        checking: 'Checking executable JAR...',
        refresh: 'Refresh JAR Status',
        fingerprintMissing: 'The source fingerprint is unavailable for this module.',
        ready: 'The executable JAR is ready.',
        build: 'Build JAR',
        download: 'Download JAR',
        buildStarting: 'Sending build request...',
        queued: 'Queued',
        building: 'Building',
        successful: 'Build successful',
        failed: 'Build failed',
        retryStatus: 'Reconnect Build Status',
        trackingLost: 'Build tracking is currently unavailable. Reconnect without starting another build.',
        unconfirmed: 'The previous build request could not be confirmed. Check GitHub Actions before building again.',
        releasePending: 'Build succeeded, but the JAR has not appeared in the Release yet. Refresh JAR status shortly.',
        artifactPending: 'The artifact is ready, but a download URL is not available.',
        downloadPending: 'The artifact is ready, but a download URL is not available.',
        runTitle: 'Run Locally',
        runIntro: 'Download the JAR and run it locally with Java 21.',
        installTitle: 'Install Java 21',
        installCopy: 'Install JDK 21 if Java is not available on your machine.',
        installAction: 'Download Java 21',
        envTitle: 'Configure JAVA_HOME',
        envCopy: 'Point JAVA_HOME to your JDK 21 folder and add %JAVA_HOME%\\bin to Path.',
        verifyTitle: 'Verify Java',
        runJarTitle: 'Run the JAR',
        openTitle: 'Open the application',
        copy: 'Copy',
        copied: 'Copied',
        open: 'Open',
        portNote: 'Port 9000 is the Local Run default. Change --server.port if the port is already in use.',
      };

  // Keep translation changes from resetting an active build/polling session.
  const fingerprintMissingTextRef = useRef(text.fingerprintMissing);
  fingerprintMissingTextRef.current = text.fingerprintMissing;
  const progressTextRef = useRef(text);
  progressTextRef.current = text;

  const refreshArtifact = useCallback(async (force = false, onReturn = false): Promise<LocalRunArtifactResponse | null> => {
    if (!sourceFingerprint || buildingRef.current) return null;
    if (onReturn && !shouldRefreshLocalRunOnReturn(
      lastCheckStartedAt.current, Date.now(), checkingRef.current || buildingRef.current,
    )) return null;
    if (!force && checkingRef.current) return null;

    const sequence = ++checkSequence.current;
    checkingRef.current = true;
    lastCheckStartedAt.current = Date.now();
    setArtifactChecking(true);
    setError(null);
    try {
      const result = await localRunApi.getArtifact(moduleId, sourceFingerprint, force);
      if (sequence === checkSequence.current) {
        setArtifact(result);
        return result;
      }
    } catch (artifactError) {
      if (sequence === checkSequence.current) {
        setError(artifactError instanceof Error ? artifactError.message : 'Unable to check JAR status.');
      }
    } finally {
      if (sequence === checkSequence.current) {
        checkingRef.current = false;
        setArtifactChecking(false);
      }
    }
    return null;
  }, [moduleId, sourceFingerprint]);

  const trackBuild = useCallback(async (controller: AbortController, afterDispatch = false) => {
    if (watchingRef.current || controller.signal.aborted) return;
    watchingRef.current = true;
    buildingRef.current = true;
    setStatusRetryNeeded(false);
    try {
      const outcome = await watchLocalRunBuild(
        (signal) => localRunApi.getBuildStatus(localRunTrackingId(sourceFingerprint), moduleId, signal),
        (reply) => {
          if (controller.signal.aborted) return;
          setBuildStatus(reply.status);
          setBuildMessage(null);
          if (reply.status === 'FAILED') setError(reply.message ?? progressTextRef.current.failed);
          else setError(null);
        },
        { signal: controller.signal },
      );
      if (controller.signal.aborted || outcome.status !== 'SUCCESS') return;
      // A successful GitHub run may precede release asset visibility.
      checkSequence.current += 1;
      checkingRef.current = false;
      setArtifactChecking(true);
      const ready = await waitForLocalRunArtifact(
        () => localRunApi.getArtifact(moduleId, sourceFingerprint, true),
        (result) => { if (!controller.signal.aborted) setArtifact(result); },
        { signal: controller.signal },
      );
      if (!controller.signal.aborted && (!ready?.available || !ready.downloadUrl)) {
        setBuildMessage(progressTextRef.current.releasePending);
      }
    } catch (trackingError) {
      if (controller.signal.aborted) return;
      if (isLocalRunNotFound(trackingError)) {
        setBuildStatus('IDLE');
        if (afterDispatch) setError(progressTextRef.current.unconfirmed);
      } else {
        setStatusRetryNeeded(true);
        setBuildMessage(progressTextRef.current.trackingLost);
        setError(trackingError instanceof Error ? trackingError.message : progressTextRef.current.trackingLost);
      }
    } finally {
      if (!controller.signal.aborted) {
        watchingRef.current = false;
        buildingRef.current = false;
        if (!checkingRef.current) setArtifactChecking(false);
      }
    }
  }, [moduleId, sourceFingerprint]);

  useEffect(() => {
    checkSequence.current += 1;
    checkingRef.current = false;
    lastCheckStartedAt.current = 0;
    const controller = new AbortController();
    trackingAbort.current = controller;
    watchingRef.current = false;
    buildingRef.current = false;

    setBuildStatus('IDLE');
    setBuildMessage(null);
    setError(null);
    setStatusRetryNeeded(false);
    setArtifactChecking(true);
    setArtifact({
      moduleId,
      available: false,
      fileName: toJarFileName(moduleId),
    });

    if (!sourceFingerprint) {
      setArtifactChecking(false);
      setError(fingerprintMissingTextRef.current);
      return () => { controller.abort(); checkSequence.current += 1; };
    }

    // Read-only public Release lookup must continue to work even if the Worker
    // status endpoint is down/unconfigured. A DO job is recovered independently.
    void refreshArtifact();
    void trackBuild(controller);

    return () => {
      controller.abort();
      if (trackingAbort.current === controller) trackingAbort.current = null;
      checkSequence.current += 1;
      checkingRef.current = false;
      watchingRef.current = false;
      buildingRef.current = false;
    };
  }, [moduleId, sourceFingerprint, trackBuild]);

  useEffect(() => {
    if (!sourceFingerprint) setError(text.fingerprintMissing);
  }, [sourceFingerprint, text.fingerprintMissing]);

  useEffect(() => {
    const checkOnReturn = () => {
      if (document.visibilityState === 'visible') void refreshArtifact(false, true);
    };
    document.addEventListener('visibilitychange', checkOnReturn);
    window.addEventListener('focus', checkOnReturn);
    return () => {
      document.removeEventListener('visibilitychange', checkOnReturn);
      window.removeEventListener('focus', checkOnReturn);
    };
  }, [refreshArtifact]);

  const handleBuild = async () => {
    if (!sourceFingerprint || watchingRef.current || buildingRef.current || statusRetryNeeded) {
      if (!sourceFingerprint) setError(text.fingerprintMissing);
      return;
    }

    setError(null);
    buildingRef.current = true;
    checkSequence.current += 1;
    checkingRef.current = false;
    setArtifactChecking(false);
    setBuildStatus('QUEUED');
    setBuildMessage(text.buildStarting);

    try {
      const controller = trackingAbort.current;
      if (!controller) return;
      const started = await localRunApi.startBuild({ moduleId, sourceFingerprint }, controller.signal);
      if (controller.signal.aborted) return;
      setBuildStatus(started.status);
      setBuildMessage(null);

      buildingRef.current = false;
      if (started.result === 'AVAILABLE') {
        checkingRef.current = true;
        setArtifactChecking(true);
        const ready = await waitForLocalRunArtifact(
          () => localRunApi.getArtifact(moduleId, sourceFingerprint, true),
          (result) => { if (!controller.signal.aborted) setArtifact(result); },
          { signal: controller.signal },
        );
        if (!controller.signal.aborted && (!ready?.available || !ready.downloadUrl)) {
          setBuildMessage(progressTextRef.current.releasePending);
        }
      } else {
        await trackBuild(controller, true);
      }
    } catch (buildError) {
      const controller = trackingAbort.current;
      if (!controller || controller.signal.aborted) return;
      // The POST may have succeeded before the connection dropped. Never
      // dispatch again automatically; reconcile its deterministic job ID.
      buildingRef.current = false;
      setError(buildError instanceof Error ? buildError.message : text.failed);
      await trackBuild(controller, true);
    } finally {
      buildingRef.current = false;
      if (!trackingAbort.current?.signal.aborted && !watchingRef.current) {
        checkingRef.current = false;
        setArtifactChecking(false);
      }
    }
  };

  const buildInProgress = buildStatus === 'QUEUED' || buildStatus === 'BUILDING' || statusRetryNeeded;

  const statusLabel = buildStatus === 'QUEUED'
    ? text.queued
    : buildStatus === 'BUILDING'
      ? text.building
      : buildStatus === 'SUCCESS'
        ? text.successful
        : buildStatus === 'FAILED'
          ? text.failed
          : null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(runCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="local-run-panel">
      <div className="local-run-grid">
        <article className="local-run-card local-run-card--artifact">
          <div className="local-run-card__heading">
            <span className="local-run-card__eyebrow">Local Run</span>
            <h2>{text.packageTitle}</h2>
          </div>

          <dl className="local-run-meta">
            <div>
              <dt>{text.module}</dt>
              <dd>{moduleName}</dd>
            </div>
            <div>
              <dt>{text.java}</dt>
              <dd>21</dd>
            </div>
          </dl>

          <div className={`local-run-artifact-state${artifact.available ? ' is-ready' : ''}`}>
            <span className="local-run-artifact-state__icon" aria-hidden="true">
              {artifact.available ? '✓' : '○'}
            </span>
            <div>
              <strong>
                {artifactChecking
                  ? text.checking
                  : artifact.available
                    ? text.ready
                    : artifact.stale
                      ? text.stale
                      : text.missing}
              </strong>
              <span>{jarFileName}</span>
            </div>
          </div>

          {buildStatus !== 'IDLE' && (
            <div className="local-run-progress" aria-live="polite">
              <div className={`local-run-progress__step${buildStatus === 'QUEUED' || buildStatus === 'BUILDING' || buildStatus === 'SUCCESS' ? ' is-active' : ''}${buildStatus === 'QUEUED' ? ' is-current' : ''}`}>
                <span>1</span>
                <strong>{text.queued}</strong>
              </div>
              <span className={`local-run-progress__connector${buildStatus === 'QUEUED' || buildStatus === 'BUILDING' ? ' is-running' : buildStatus === 'SUCCESS' ? ' is-complete' : ''}`} aria-hidden="true">↓</span>
              <div className={`local-run-progress__step${buildStatus === 'BUILDING' || buildStatus === 'SUCCESS' ? ' is-active' : ''}${buildStatus === 'BUILDING' ? ' is-current' : ''}`}>
                <span>2</span>
                <strong>{text.building}</strong>
              </div>
              <span className={`local-run-progress__connector${buildStatus === 'BUILDING' ? ' is-running' : buildStatus === 'SUCCESS' ? ' is-complete' : ''}`} aria-hidden="true">↓</span>
              <div className={`local-run-progress__step${buildStatus === 'SUCCESS' ? ' is-active is-success' : buildStatus === 'FAILED' ? ' is-active is-failed' : ''}`}>
                <span>{buildStatus === 'SUCCESS' ? '✓' : buildStatus === 'FAILED' ? '×' : '3'}</span>
                <strong>{buildStatus === 'FAILED' ? text.failed : text.successful}</strong>
              </div>

              {buildInProgress && (
                <div className="local-run-progress__activity" aria-hidden="true">
                  <span />
                </div>
              )}
            </div>
          )}

          <div className="local-run-card__actions">
            {artifact.available ? (
              artifact.downloadUrl ? (
                <a className="local-run-button local-run-button--download" href={artifact.downloadUrl} download={jarFileName}>
                  ↓ {text.download}
                </a>
              ) : (
                <button className="local-run-button local-run-button--download" type="button" disabled title={text.downloadPending}>
                  ↓ {text.download}
                </button>
              )
            ) : (
              <button
                className="local-run-button local-run-button--build"
                type="button"
                onClick={handleBuild}
                disabled={buildInProgress || buildStatus === 'SUCCESS' || artifactChecking || !sourceFingerprint}
              >
                ▶ {buildInProgress ? statusLabel : text.build}
              </button>
            )}
            <button
              className="local-run-button local-run-button--refresh"
              type="button"
              onClick={() => { if (!checkingRef.current && !buildingRef.current) void refreshArtifact(true); }}
              disabled={artifactChecking || buildInProgress || !sourceFingerprint}
              aria-label={text.refresh}
              title={text.refresh}
            >
              ↻ {text.refresh}
            </button>
            {statusRetryNeeded && (
              <button className="local-run-button local-run-button--refresh" type="button"
                onClick={() => { if (trackingAbort.current && !watchingRef.current) void trackBuild(trackingAbort.current); }}>
                ↻ {text.retryStatus}
              </button>
            )}
          </div>

          {buildMessage && !artifact.available && (
            <p className="local-run-backend-note" role="status">{buildMessage}</p>
          )}

          {artifact.available && !artifact.downloadUrl && (
            <p className="local-run-backend-note local-run-backend-note--success" role="status">{text.artifactPending}</p>
          )}

          {error && (
            <p className="local-run-backend-note local-run-backend-note--error" role="alert">{error}</p>
          )}
        </article>

        <article className="local-run-card local-run-card--guide">
          <div className="local-run-card__heading">
            <span className="local-run-card__eyebrow">Java 21</span>
            <h2>{text.runTitle}</h2>
            <p>{text.runIntro}</p>
          </div>

          <ol className="local-run-steps">
            <li>
              <div className="local-run-step__copy">
                <strong>{text.installTitle}</strong>
                <span>{text.installCopy}</span>
              </div>
              <a
                className="local-run-inline-action"
                href="https://adoptium.net/temurin/releases/?version=21"
                target="_blank"
                rel="noreferrer"
              >
                {text.installAction} ↗
              </a>
            </li>

            <li>
              <div className="local-run-step__copy">
                <strong>{text.envTitle}</strong>
                <span>{text.envCopy}</span>
              </div>
            </li>

            <li>
              <div className="local-run-step__copy">
                <strong>{text.verifyTitle}</strong>
              </div>
              <code className="local-run-code">java -version</code>
            </li>

            <li>
              <div className="local-run-step__copy">
                <strong>{text.runJarTitle}</strong>
              </div>
              <div className="local-run-command">
                <code>{runCommand}</code>
                <button type="button" onClick={handleCopy}>{copied ? text.copied : text.copy}</button>
              </div>
              <small>{text.portNote}</small>
            </li>

            <li>
              <div className="local-run-step__copy">
                <strong>{text.openTitle}</strong>
              </div>
              <div className="local-run-url-row">
                <code>{localUrl}</code>
                <a href={localUrl} target="_blank" rel="noreferrer">{text.open} ↗</a>
              </div>
            </li>
          </ol>
        </article>
      </div>
    </section>
  );
}
