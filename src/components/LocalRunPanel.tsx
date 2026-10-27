import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  localRunApi, localRunTrackingId, LocalRunHttpError,
  type LocalRunArtifactResponse, type LocalRunBuildStatus,
} from '../data/localRun';
import { shouldRefreshLocalRunOnReturn } from '../data/localRunRefresh';
import {
  isLocalRunNotFound, LocalRunTrackingInterruptedError, waitForLocalRunArtifact, watchLocalRunBuild,
} from '../data/localRunMonitor';
import { useLanguage } from '../state/LanguageContext';

interface LocalRunPanelProps {
  moduleId: string;
  moduleName: string;
  sourceFingerprint: string;
  moduleType?: string;
}

const DEFAULT_PORT = 9000;
const DEFAULT_CONTEXT_PATH = '/api';
const DEFAULT_APPLICATION_NAME = 'api';
const SWAGGER_ENABLED = 'TRUE';
const ACTIONS_URL = 'https://github.com/phuongnguyenit93/java-learning/actions/workflows/local-run-build.yml';
const RELEASE_URL = 'https://github.com/phuongnguyenit93/java-learning/releases/tag/local-run';

/** Never render arbitrary URLs from an upstream JSON response as links. */
export function safeBuildRunUrl(value?: string): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && parsed.hostname === 'github.com'
      && /^\/phuongnguyenit93\/java-learning\/actions\/runs\/[0-9]+\/?$/.test(parsed.pathname)
      && !parsed.search && !parsed.hash ? parsed.toString() : null;
  } catch { return null; }
}

/** HTTP 408 / unknown gateway rejection may happen after GitHub accepted POST. */
export function isDefiniteBuildRejection(error: unknown): error is LocalRunHttpError {
  return error instanceof LocalRunHttpError
    && [400, 401, 403, 404, 409, 413, 415, 422, 429].includes(error.status);
}

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
  moduleType = 'SERVLET',
}: LocalRunPanelProps) {
  const { language } = useLanguage();
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [os, setOs] = useState<'windows' | 'macos' | 'linux'>('windows');
  const [jarStarted, setJarStarted] = useState(false);
  const [jarExpanded, setJarExpanded] = useState(true);
  const [executionContextEnabled, setExecutionContextEnabled] = useState(false);
  const [buildStatus, setBuildStatus] = useState<LocalRunBuildStatus | 'IDLE' | 'SUBMITTING' | 'PUBLISHING'>('IDLE');
  const [buildMessage, setBuildMessage] = useState<string | null>(null);
  const [artifactChecking, setArtifactChecking] = useState(true);
  const [artifactError, setArtifactError] = useState<string | null>(null);
  const [artifactChecked, setArtifactChecked] = useState(false);
  const [statusChecked, setStatusChecked] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishingExpired, setPublishingExpired] = useState(false);
  const [connectionState, setConnectionState] = useState<'connected' | 'reconnecting' | 'unavailable'>('connected');
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [runUrl, setRunUrl] = useState<string | null>(null);
  const [reusedJob, setReusedJob] = useState(false);
  const [needsDispatchReview, setNeedsDispatchReview] = useState(false);
  const [reviewAcknowledged, setReviewAcknowledged] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [nowTick, setNowTick] = useState(Date.now());
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
  const artifactOwned = useRef(false);
  const knownJobRef = useRef(false);
  const copyTimer = useRef<number | null>(null);

  const jarFileName = useMemo(() => toJarFileName(moduleId), [moduleId]);
  const runCommand = `java --enable-preview -jar ${jarFileName} --server.port=${DEFAULT_PORT} --server.servlet.context-path=${DEFAULT_CONTEXT_PATH} --spring.application.name=${DEFAULT_APPLICATION_NAME} --swagger.enabled=${SWAGGER_ENABLED} --execution-context.enabled=${moduleType === 'SERVLET' && executionContextEnabled}`;
  const localUrl = `http://localhost:${DEFAULT_PORT}${DEFAULT_CONTEXT_PATH}`;
  const cooldownSeconds = Math.max(0, Math.ceil((cooldownUntil - nowTick) / 1000));

  useEffect(() => {
    if (!cooldownUntil || cooldownUntil <= Date.now()) return;
    const timer = window.setInterval(() => {
      setNowTick(Date.now());
      if (Date.now() >= cooldownUntil) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownUntil]);

  const text = language === 'vi'
    ? {
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
        submitting: 'Submitting',
        publishing: 'Publishing JAR',
        reconnecting: 'Mất kết nối; đang thử nối lại',
        serviceUnavailable: 'Dịch vụ Build tạm thời không khả dụng. Bạn vẫn có thể kiểm tra JAR công khai hoặc thử kết nối lại.',
        unknownJar: 'Chưa thể kiểm tra trạng thái JAR. Không đồng nghĩa với chưa có JAR.',
        rejected: 'Yêu cầu Build bị từ chối. Kiểm tra thông tin hoặc cấu hình dịch vụ.',
        conflict: 'Đang có Build của phiên bản khác cho module này. Chờ Build đó xong rồi thử lại.',
        limited: 'Đã đạt giới hạn tạo Build mới. Hãy chờ trước khi thử lại.',
        verifyDispatch: 'Chưa xác minh được GitHub có nhận yêu cầu Build hay không. Không tự gửi lại.',
        reviewDispatch: 'Tôi đã kiểm tra GitHub Actions và chắc chắn không có workflow đang chạy.',
        reused: 'Đã kết nối vào Build hiện có; không tạo workflow mới.',
        submitHint: 'Đang xác minh và gửi yêu cầu. Vui lòng đợi.',
        checkingJob: 'Đang kiểm tra Build hiện có trước khi cho phép tạo mới…',
        publishingHint: 'GitHub Actions thành công. Đang đợi JAR xuất hiện trên Release.',
        creatingJar: 'JAR đang được xây dựng trên GitHub Actions.',
        statusTimedOut: 'Hết thời gian theo dõi. Build vẫn có thể đang chạy trên GitHub.',
        retryArtifact: 'Kiểm tra Release',
        retryBuild: 'Build lại',
        rebuildConfirm: 'Build trước thành công nhưng JAR chưa tìm thấy. Bạn đã kiểm tra GitHub Actions và Release? Gửi Build mới?',
        viewProgress: 'Xem tiến trình GitHub Actions',
        viewLogs: 'Xem build log',
        pendingRunUrl: 'Đang xác định link GitHub Actions…',
        reviewActions: 'Kiểm tra danh sách GitHub Actions',
        viewRelease: 'Xem Release',
        copyFailed: 'Không thể sao chép tự động. Hãy chọn và copy lệnh bằng tay.',
        guideOS: 'Hệ điều hành',
        envWindows: 'PowerShell: kiểm tra java -version; nếu cần, thiết lập JAVA_HOME trong Environment Variables và mở lại terminal.',
        envMac: 'macOS: có thể dùng /usr/libexec/java_home -v 21 để tìm JDK 21; thiết lập JAVA_HOME theo shell của bạn.',
        envLinux: 'Linux: dùng update-alternatives hoặc đường dẫn JDK đã cài để đặt JAVA_HOME trong shell.',
        started: 'Tôi đã chạy JAR và thấy ứng dụng khởi động.',
        openHint: 'Chỉ mở localhost sau khi chạy JAR. Trình duyệt báo không kết nối được nếu server chưa khởi động.',
        queued: 'Queued',
        building: 'Building',
        successful: 'Build successful',
        readyStep: 'Sẵn sàng',
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
        executionContextTitle: 'Bật Execution Context',
        executionContextHint: 'Chỉ bật khi muốn ghi nhận request, response, exception và log để phân tích. Khi tắt, Swagger hoạt động bình thường như trước. Không cần build lại JAR.',
        executionContextUnavailable: 'Execution Context hiện chỉ hỗ trợ module Servlet.',
        openTitle: 'Mở ứng dụng',
        copy: 'Copy',
        copied: 'Đã copy',
        open: 'Open',
        portNote: 'Port 9000 là mặc định cho Local Run. Có thể đổi --server.port nếu port bị trùng.',
      }
    : {
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
        submitting: 'Submitting',
        publishing: 'Publishing JAR',
        reconnecting: 'Connection lost; reconnecting',
        serviceUnavailable: 'Build service is temporarily unavailable. Public JAR checks still work; reconnect status to retry.',
        unknownJar: 'JAR status could not be verified. This does not mean the JAR is missing.',
        rejected: 'Build request was rejected. Review its details or service configuration.',
        conflict: 'Another version of this module is building. Wait for it to finish.',
        limited: 'New builds are rate limited. Please wait before trying again.',
        verifyDispatch: 'It is unclear whether GitHub accepted the build. No automatic second dispatch.',
        reviewDispatch: 'I checked GitHub Actions and confirmed no workflow is running.',
        reused: 'Connected to the existing build; no new workflow was dispatched.',
        submitHint: 'Checking and submitting your request. Please wait.',
        checkingJob: 'Checking existing builds before enabling a new request…',
        publishingHint: 'GitHub Actions succeeded. Waiting for the JAR to appear on the Release.',
        creatingJar: 'GitHub Actions is building the JAR.',
        statusTimedOut: 'Tracking timed out. GitHub Actions may still be running.',
        retryArtifact: 'Check Release',
        retryBuild: 'Rebuild',
        rebuildConfirm: 'The previous build succeeded but no JAR was found. Have you checked GitHub Actions and the Release? Dispatch another build?',
        viewProgress: 'View GitHub Actions progress',
        viewLogs: 'View build log',
        pendingRunUrl: 'Waiting for the GitHub Actions run link...',
        reviewActions: 'Inspect GitHub Actions workflows',
        viewRelease: 'View Release',
        copyFailed: 'Automatic copy failed. Select and copy the command manually.',
        guideOS: 'Operating system',
        envWindows: 'PowerShell: verify java -version; configure JAVA_HOME in Environment Variables if needed, then reopen your terminal.',
        envMac: 'macOS: use /usr/libexec/java_home -v 21 to locate JDK 21 and set JAVA_HOME in your shell.',
        envLinux: 'Linux: use update-alternatives or your JDK installation path to set JAVA_HOME in your shell.',
        started: 'I started the JAR and saw that the application launched.',
        openHint: 'Open localhost only after starting the JAR; browsers cannot connect before the server is running.',
        queued: 'Queued',
        building: 'Building',
        successful: 'Build successful',
        readyStep: 'Ready',
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
        executionContextTitle: 'Enable Execution Context',
        executionContextHint: 'Enable capture of requests, responses, exceptions, and logs for analysis. When disabled, Swagger works as before. No JAR rebuild is needed.',
        executionContextUnavailable: 'Execution Context currently supports Servlet modules only.',
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
    if (!sourceFingerprint || buildingRef.current || watchingRef.current || artifactOwned.current) return null;
    if (onReturn && !shouldRefreshLocalRunOnReturn(
      lastCheckStartedAt.current, Date.now(), checkingRef.current || buildingRef.current,
    )) return null;
    if (!force && checkingRef.current) return null;

    const sequence = ++checkSequence.current;
    checkingRef.current = true;
    lastCheckStartedAt.current = Date.now();
    setArtifactChecking(true);
    setArtifactError(null);
    try {
      const result = await localRunApi.getArtifact(moduleId, sourceFingerprint, force);
      if (sequence === checkSequence.current) {
        setArtifact(result);
        setArtifactChecked(true);
        if (result.available && result.downloadUrl) {
          setError(null);
          setBuildMessage(null);
          setPublishingExpired(false);
        }
        return result;
      }
    } catch (artifactError) {
      if (sequence === checkSequence.current) {
        setArtifactError(artifactError instanceof Error ? artifactError.message : 'Unable to check JAR status.');
        setArtifactChecked(false);
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
    setStatusRetryNeeded(false);
    setConnectionState('connected');
    try {
      const outcome = await watchLocalRunBuild(
        (signal) => localRunApi.getBuildStatus(localRunTrackingId(sourceFingerprint), moduleId, signal),
        (reply) => {
          if (controller.signal.aborted) return;
          knownJobRef.current = true;
          setStatusChecked(true);
          setBuildStatus(reply.status);
          setRunUrl((current) => safeBuildRunUrl(reply.runUrl) ?? current);
          setNeedsDispatchReview(false);
          setReviewAcknowledged(false);
          if (reply.status !== 'SUCCESS') setBuildMessage(null);
          if (reply.status === 'FAILED' || reply.status === 'SUCCESS') setReusedJob(false);
          if (reply.status === 'FAILED') setError(reply.message ?? progressTextRef.current.failed);
          else setError(null);
        },
        {
          signal: controller.signal,
          maxConnectionFailureMs: knownJobRef.current || afterDispatch ? 90_000 : 12_000,
          onConnectionChange: (state, attempts) => {
            if (controller.signal.aborted) return;
            setConnectionState(state);
            setConnectionAttempts(attempts);
          },
        },
      );
      if (controller.signal.aborted || outcome.status !== 'SUCCESS') return;
      setBuildStatus('PUBLISHING');
      setPublishingExpired(false);
      setPublishing(true);
      setBuildMessage(progressTextRef.current.publishingHint);
      artifactOwned.current = true;
      checkSequence.current += 1;
      checkingRef.current = false;
      setArtifactChecking(true);
      setArtifactError(null);
      const ready = await waitForLocalRunArtifact(
        () => localRunApi.getArtifact(moduleId, sourceFingerprint, true),
        (result) => {
          if (!controller.signal.aborted) {
            setArtifact(result);
            setArtifactChecked(true);
          }
        },
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      setBuildStatus('SUCCESS');
      if (!ready?.available || !ready.downloadUrl) {
        setPublishingExpired(true);
        setBuildMessage(progressTextRef.current.releasePending);
        if (!ready) {
          setArtifactChecked(false);
          setArtifactError(progressTextRef.current.unknownJar);
        }
      } else {
        setPublishingExpired(false);
        setBuildMessage(null);
      }
    } catch (trackingError) {
      if (controller.signal.aborted) return;
      if (isLocalRunNotFound(trackingError)) {
        setBuildStatus('IDLE');
        knownJobRef.current = false;
        setStatusChecked(true);
        setConnectionState('connected');
        setStatusRetryNeeded(false);
        setBuildMessage(null);
        if (afterDispatch) {
          setNeedsDispatchReview(true);
          setReviewAcknowledged(false);
          setError(progressTextRef.current.verifyDispatch);
        }
      } else {
        setStatusRetryNeeded(true);
        setConnectionState('unavailable');
        setBuildMessage(trackingError instanceof LocalRunTrackingInterruptedError
          && trackingError.message.includes('timed out')
          ? progressTextRef.current.statusTimedOut
          : knownJobRef.current || afterDispatch
            ? progressTextRef.current.trackingLost
            : progressTextRef.current.serviceUnavailable);
        setError(null);
      }
    } finally {
      if (!controller.signal.aborted) {
        watchingRef.current = false;
        artifactOwned.current = false;
        setPublishing(false);
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
    knownJobRef.current = false;
    artifactOwned.current = false;

    setBuildStatus('IDLE');
    setBuildMessage(null);
    setError(null);
    setStatusRetryNeeded(false);
    setConnectionState('connected');
    setConnectionAttempts(0);
    setRunUrl(null);
    setReusedJob(false);
    setNeedsDispatchReview(false);
    setReviewAcknowledged(false);
    setCooldownUntil(0);
    setArtifactError(null);
    setArtifactChecked(false);
    setStatusChecked(false);
    setPublishing(false);
    setPublishingExpired(false);
    setCopyState('idle');
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    setJarStarted(false);
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
      artifactOwned.current = false;
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
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

  const handleBuild = async (rebuild = false) => {
    if (!sourceFingerprint || !statusChecked || watchingRef.current || buildingRef.current || statusRetryNeeded ||
      cooldownUntil > Date.now() || (needsDispatchReview && !reviewAcknowledged)) {
      if (!sourceFingerprint) setError(text.fingerprintMissing);
      return;
    }
    if (rebuild && !window.confirm(text.rebuildConfirm)) return;

    setError(null);
    buildingRef.current = true;
    checkSequence.current += 1;
    checkingRef.current = false;
    setArtifactChecking(false);
    setBuildStatus('SUBMITTING');
    setRunUrl(null);
    setReusedJob(false);
    setBuildMessage(text.buildStarting);
    setPublishingExpired(false);

    try {
      const controller = trackingAbort.current;
      if (!controller) return;
      const started = await localRunApi.startBuild({ moduleId, sourceFingerprint }, controller.signal);
      if (controller.signal.aborted) return;
      setBuildStatus(started.status);
      setBuildMessage(null);
      setReusedJob(started.result === 'REUSED');
      setRunUrl(safeBuildRunUrl(started.runUrl));
      knownJobRef.current = true;
      setNeedsDispatchReview(false);
      setReviewAcknowledged(false);

      buildingRef.current = false;
      if (started.result === 'AVAILABLE') {
        setBuildStatus('PUBLISHING');
        setPublishing(true);
        artifactOwned.current = true;
        checkingRef.current = true;
        setArtifactChecking(true);
        const ready = await waitForLocalRunArtifact(
          () => localRunApi.getArtifact(moduleId, sourceFingerprint, true),
          (result) => {
            if (!controller.signal.aborted) {
              setArtifact(result);
              setArtifactChecked(true);
            }
          },
          { signal: controller.signal },
        );
        if (!controller.signal.aborted) {
          setBuildStatus('SUCCESS');
          setPublishingExpired(!ready?.available || !ready.downloadUrl);
          if (!ready?.available || !ready.downloadUrl) {
            setBuildMessage(progressTextRef.current.releasePending);
            if (!ready) {
              setArtifactError(progressTextRef.current.unknownJar);
              setArtifactChecked(false);
            }
          } else setBuildMessage(null);
        }
      } else {
        await trackBuild(controller, true);
      }
    } catch (buildError) {
      const controller = trackingAbort.current;
      if (!controller || controller.signal.aborted) return;
      buildingRef.current = false;
      if (isDefiniteBuildRejection(buildError)) {
        // Definite rejection: no workflow was accepted. Do NOT reconcile
        // against another job (in particular on 409/429/403).
        setBuildStatus('IDLE');
        setNeedsDispatchReview(false);
        const errorText = buildError.status === 409 ? progressTextRef.current.conflict
          : buildError.status === 429 ? progressTextRef.current.limited
            : progressTextRef.current.rejected;
        setError(`${errorText} ${buildError.message}`);
        if (buildError.status === 429) {
          setCooldownUntil(Date.now() + (buildError.retryAfterSeconds ?? 60) * 1000);
        }
      } else {
        // 5xx/timeouts may arrive after dispatch. Only GET /status can
        // reconcile; never send another POST automatically.
        setBuildMessage(progressTextRef.current.verifyDispatch);
        await trackBuild(controller, true);
      }
    } finally {
      buildingRef.current = false;
      artifactOwned.current = false;
      setPublishing(false);
      if (!trackingAbort.current?.signal.aborted && !watchingRef.current) {
        checkingRef.current = false;
        setArtifactChecking(false);
      }
    }
  };

  const buildInProgress = buildStatus === 'SUBMITTING' || buildStatus === 'QUEUED'
    || buildStatus === 'BUILDING' || buildStatus === 'PUBLISHING' || publishing;
  const buildBlocked = buildInProgress || statusRetryNeeded || connectionState === 'unavailable'
    || cooldownSeconds > 0 || (needsDispatchReview && !reviewAcknowledged);
  const canBuild = !!sourceFingerprint && statusChecked && !artifactChecking && !artifactError && artifactChecked
    && !buildBlocked && (buildStatus !== 'SUCCESS' || publishingExpired);
  const showRebuild = buildStatus === 'SUCCESS' && publishingExpired && !artifact.available;

  const statusLabel = buildStatus === 'SUBMITTING' ? text.submitting
    : buildStatus === 'PUBLISHING' ? text.publishing
    : buildStatus === 'QUEUED'
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
      setCopyState('copied');
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopyState('idle'), 1600);
    } catch {
      setCopyState('failed');
    }
  };

  return (
    <section className="local-run-panel">
      <div className="local-run-grid">
        <div className="local-run-build-stack">
        <article className={`local-run-card local-run-card--artifact${jarExpanded ? '' : ' is-collapsed'}`}>
          <div className="local-run-build-heading">
            <div className="local-run-card__heading">
              <span className="local-run-card__eyebrow">Local Run</span>
              <h2>Build JAR</h2>
            </div>
            <button type="button" className="local-run-build-toggle"
              aria-expanded={jarExpanded}
              aria-controls="local-run-jar-content"
              aria-label={jarExpanded
                ? (language === 'vi' ? 'Thu gọn phần JAR' : 'Collapse JAR section')
                : (language === 'vi' ? 'Mở rộng phần JAR' : 'Expand JAR section')}
              onClick={() => setJarExpanded((current) => !current)}>
              <span aria-hidden="true">{jarExpanded ? '−' : '+'}</span>
            </button>
          </div>

          {jarExpanded && <div id="local-run-jar-content">
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

          <div className={`local-run-artifact-state${artifact.available ? ' is-ready' : ''}${artifactError ? ' is-unavailable' : ''}`} aria-live="polite">
            <span className="local-run-artifact-state__icon" aria-hidden="true">
              {artifact.available ? '✓' : artifactError ? '!' : '○'}
            </span>
            <div>
              <strong>
                {buildStatus === 'PUBLISHING'
                  ? text.publishingHint
                  : buildStatus === 'SUBMITTING' || buildStatus === 'QUEUED' || buildStatus === 'BUILDING'
                    ? text.creatingJar
                    : artifactChecking
                  ? text.checking
                  : artifact.available
                    ? text.ready
                    : artifactError || !artifactChecked
                      ? text.unknownJar
                    : artifact.stale
                      ? text.stale
                      : text.missing}
              </strong>
              <span>{jarFileName}</span>
            </div>
          </div>

          {buildStatus !== 'IDLE' && (
            <div className="local-run-progress" aria-live="polite">
              <div className="local-run-progress__steps">
                {([text.submitting, text.queued, text.building, text.publishing, text.readyStep] as const).map((label, index) => {
                  const progressIndex = buildStatus === 'SUBMITTING' ? 0
                    : buildStatus === 'QUEUED' ? 1 : buildStatus === 'BUILDING' ? 2
                      : buildStatus === 'PUBLISHING' ? 3 : buildStatus === 'SUCCESS'
                        ? (artifact.available ? 4 : 3) : -1;
                  const completed = index < progressIndex || (index === 4 && artifact.available);
                  return (
                    <div key={label} className={`local-run-progress__step${completed ? ' is-active' : ''}${index === progressIndex && buildInProgress ? ' is-current' : ''}${index === 4 && artifact.available ? ' is-active is-success' : ''}`}>
                      <span>{completed ? '✓' : index + 1}</span>
                      <strong>{label}</strong>
                    </div>
                  );
                })}
              </div>
              {buildStatus === 'FAILED' && <p className="local-run-backend-note local-run-backend-note--error">{text.failed}</p>}

              {buildInProgress && connectionState !== 'unavailable' && (
                <div className="local-run-progress__activity" aria-hidden="true">
                  <span />
                </div>
              )}
            </div>
          )}

          <div className="local-run-card__actions">
            {artifact.available ? (
              artifact.downloadUrl ? (
                <a className="local-run-button local-run-button--download" href={artifact.downloadUrl} download={jarFileName} aria-label={`${text.download} ${jarFileName}`}>
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
                onClick={() => { void handleBuild(showRebuild); }}
                disabled={!canBuild}
              >
                ▶ {buildInProgress ? statusLabel : cooldownSeconds ? `${text.build} (${cooldownSeconds}s)` : showRebuild ? text.retryBuild : text.build}
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
            {runUrl && (buildInProgress || buildStatus === 'SUCCESS' || buildStatus === 'FAILED') && (
              <a className="local-run-button local-run-button--refresh" href={runUrl}
                target="_blank" rel="noopener noreferrer">
                {buildStatus === 'SUCCESS' || buildStatus === 'FAILED' ? text.viewLogs : text.viewProgress} ↗
              </a>
            )}
            {!runUrl && (buildStatus === 'QUEUED' || buildStatus === 'BUILDING') && (
              <span className="local-run-backend-note" role="status">{text.pendingRunUrl}</span>
            )}
            {needsDispatchReview && (
              <a className="local-run-button local-run-button--refresh" href={ACTIONS_URL}
                target="_blank" rel="noopener noreferrer">{text.reviewActions} ↗</a>
            )}
            {(buildStatus === 'SUCCESS' || publishingExpired) && (
              <a className="local-run-button local-run-button--refresh" href={RELEASE_URL}
                target="_blank" rel="noopener noreferrer">{text.viewRelease} ↗</a>
            )}
          </div>

          {connectionState === 'reconnecting' && (
            <p className="local-run-backend-note" role="status">
              {text.reconnecting} · {connectionAttempts}
            </p>
          )}
          {reusedJob && buildInProgress && (
            <p className="local-run-backend-note" role="status">{text.reused}</p>
          )}
          {!statusChecked && !statusRetryNeeded && connectionState === 'connected' && (
            <p className="local-run-backend-note" role="status">{text.checkingJob}</p>
          )}
          {connectionState === 'unavailable' && (
            <p className="local-run-backend-note" role="status">{text.serviceUnavailable}</p>
          )}
          {needsDispatchReview && (
            <label className="local-run-backend-note local-run-review">
              <input type="checkbox" checked={reviewAcknowledged} onChange={(event) => setReviewAcknowledged(event.target.checked)} />
              {text.reviewDispatch}
            </label>
          )}
          {buildMessage && !artifact.available && (
            <p className="local-run-backend-note" role="status">{buildMessage}</p>
          )}

          {artifact.available && !artifact.downloadUrl && (
            <p className="local-run-backend-note local-run-backend-note--success" role="status">{text.artifactPending}</p>
          )}

          {error && (
            <p className="local-run-backend-note local-run-backend-note--error" role="alert">{error}</p>
          )}
          {artifactError && (
            <p className="local-run-backend-note local-run-backend-note--error" role="alert">{text.unknownJar} {artifactError}</p>
          )}
          </div>}
        </article>

        <article className="local-run-card local-run-card--source" aria-label="Build Source">
          <div className="local-run-card__heading">
            <span className="local-run-card__eyebrow">Local Run</span>
            <h2>Build Source</h2>
          </div>
          <div className="local-run-source-placeholder" aria-hidden="true" />
        </article>
        </div>

        <article className="local-run-card local-run-card--guide">
          <div className="local-run-card__heading">
            <span className="local-run-card__eyebrow">Java 21</span>
            <h2>{text.runTitle}</h2>
            <p>{text.runIntro}</p>
          </div>

          <ol className="local-run-steps">
            <li>
              <div className="local-run-step__copy"><strong>{text.guideOS}</strong></div>
              <div className="local-run-os" role="group" aria-label={text.guideOS}>
                {(['windows', 'macos', 'linux'] as const).map((choice) => (
                  <button type="button" key={choice} aria-pressed={choice === os}
                    className={choice === os ? 'is-selected' : ''}
                    onClick={() => setOs(choice)}>{choice === 'windows' ? 'Windows' : choice === 'macos' ? 'macOS' : 'Linux'}</button>
                ))}
              </div>
            </li>
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
                <span>{os === 'windows' ? text.envWindows : os === 'macos' ? text.envMac : text.envLinux}</span>
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
              <label className="local-run-execution-context">
                <input type="checkbox" checked={moduleType === 'SERVLET' && executionContextEnabled}
                  disabled={moduleType !== 'SERVLET'}
                  onChange={(event) => { setExecutionContextEnabled(event.target.checked); setCopyState('idle'); }} />
                <span>{text.executionContextTitle}</span>
              </label>
              <small>{moduleType === 'SERVLET' ? text.executionContextHint : text.executionContextUnavailable}</small>
              <div className="local-run-command">
                <code>{runCommand}</code>
                <button type="button" onClick={handleCopy}>{copyState === 'copied' ? text.copied : text.copy}</button>
              </div>
              {copyState === 'failed' && <small role="alert">{text.copyFailed}</small>}
              <small>{text.portNote}</small>
            </li>

            <li>
              <div className="local-run-step__copy">
                <strong>{text.openTitle}</strong>
                <span>{text.openHint}</span>
              </div>
              <label className="local-run-started">
                <input type="checkbox" checked={jarStarted} onChange={(event) => setJarStarted(event.target.checked)} />
                {text.started}
              </label>
              <div className="local-run-url-row">
                <code>{localUrl}</code>
                {jarStarted
                  ? <a href={localUrl} target="_blank" rel="noopener noreferrer">{text.open} ↗</a>
                  : <span className="local-run-url-disabled" aria-disabled="true">{text.open} ↗</span>}
              </div>
            </li>
          </ol>
        </article>
      </div>
    </section>
  );
}
