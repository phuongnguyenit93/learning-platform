import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../state/LanguageContext';
import {
  GEMINI_DEFAULT_MODEL, GEMINI_MODELS, GeminiApiError, streamGeminiMessage,
  type GeminiErrorCode, type GeminiModelId, type GeminiTurn,
} from '../data/geminiDirect';

type ProviderId = 'gemini' | 'groq' | 'openrouter' | 'cloudflare';
type Stage = 'providers' | 'api-key' | 'chat';
type IconName = 'expand' | 'shrink' | 'close' | 'restart' | 'back' | 'eye' | 'eye-off' | 'arrow' | 'key';
type ChatMessage = { id: number; role: 'user' | 'assistant'; text: string; streaming?: boolean };
type ChatFailure = { code: GeminiErrorCode; prompt: string };

const providers: Array<{
  id: ProviderId;
  name: string;
  mark: string;
  description: { vi: string; en: string };
  keyUrl?: string;
}> = [
  {
    id: 'gemini', name: 'Gemini', mark: '✦',
    description: { vi: 'AI của Google', en: 'AI by Google' },
    keyUrl: 'https://aistudio.google.com/apikey',
  },
  {
    id: 'groq', name: 'Groq', mark: 'G',
    description: { vi: 'Phản hồi nhanh', en: 'Fast responses' },
    keyUrl: 'https://console.groq.com/keys',
  },
  {
    id: 'openrouter', name: 'OpenRouter', mark: '⇄',
    description: { vi: 'Nhiều model AI', en: 'Multiple AI models' },
    keyUrl: 'https://openrouter.ai/settings/keys',
  },
  {
    id: 'cloudflare', name: 'Workers AI', mark: '☁',
    description: { vi: 'Cloudflare · Không cần key', en: 'Cloudflare · No key needed' },
  },
];

const translations = {
  vi: {
    assistant: 'AI Support',
    open: 'Mở AI Support',
    close: 'Đóng AI Support',
    expand: 'Phóng to toàn màn hình',
    shrink: 'Thu về cửa sổ nhỏ',
    restart: 'Bắt đầu lại',
    restartHint: 'Xóa cuộc trò chuyện hiện tại và chọn lại trợ lý AI',
    chooseTitle: 'Chọn trợ lý AI',
    chooseIntro: 'Chọn một nhà cung cấp để bắt đầu cuộc trò chuyện.',
    privateKey: 'Dùng API key của bạn',
    noKey: 'Không cần API key',
    keyTitle: 'Kết nối với',
    keyIntro: 'Nhập API key cá nhân để sử dụng nhà cung cấp này.',
    keyLabel: 'API key của bạn',
    keyPlaceholder: 'Dán API key vào đây',
    showKey: 'Hiện API key',
    hideKey: 'Ẩn API key',
    keyHelp: 'Key chỉ được giữ trong phiên trang hiện tại và sẽ mất khi tải lại (F5).',
    getKey: 'Lấy API key',
    continue: 'Tiếp tục',
    back: 'Chọn AI khác',
    welcome: 'Xin chào! Mình là AI Support.',
    welcomeIntro: 'Bạn đã chọn',
    readyNote: 'Giao diện đã sẵn sàng. Tính năng gửi câu hỏi đến AI sẽ được kết nối ở bước tiếp theo.',
    composer: 'Nhắn tin sẽ được bật sau khi kết nối API…',
    send: 'Gửi tin nhắn',
    pending: 'Chưa kết nối API · Đang hoàn thiện giao diện',
    geminiReady: 'Hãy đặt câu hỏi. Nội dung trò chuyện chỉ tồn tại trong phiên trang này.',
    geminiComposer: 'Nhắn tin cho Gemini…',
    geminiSession: 'Không lưu lịch sử · F5 sẽ xóa cuộc trò chuyện và API key',
    geminiThinking: 'Gemini đang trả lời…',
    geminiRetry: 'Thử lại',
    geminiModel: 'Chọn model Gemini',
    geminiModelChangeHint: 'Đổi model sẽ bắt đầu hội thoại mới nhưng giữ API key.',
    geminiUsage: 'Xem API Usage Limits trên Google AI Studio',
    geminiErrors: {
      auth: 'API key không hợp lệ, chưa được cấp quyền hoặc bị giới hạn. Hãy kiểm tra lại key trong Google AI Studio.',
      quota: 'Gemini đã trả lỗi 429: quá giới hạn tốc độ hoặc hết quota. Hãy thử lại sau.',
      model: 'Model Gemini hiện không khả dụng với API key này.',
      request: 'Gemini từ chối yêu cầu. Kiểm tra nội dung hoặc độ dài cuộc trò chuyện.',
      network: 'Không thể kết nối trực tiếp Google Gemini. Hãy kiểm tra kết nối mạng, CORS hoặc giới hạn API key.',
      server: 'Dịch vụ Gemini đang gặp lỗi. Hãy thử lại sau.',
      response: 'Phản hồi Gemini không đầy đủ hoặc có định dạng chưa được hỗ trợ. Bạn có thể thử lại.',
    },
  },
  en: {
    assistant: 'AI Support',
    open: 'Open AI Support',
    close: 'Close AI Support',
    expand: 'Expand to full screen',
    shrink: 'Return to popup',
    restart: 'Start over',
    restartHint: 'Clear the current conversation and choose another AI assistant',
    chooseTitle: 'Choose your AI assistant',
    chooseIntro: 'Choose a provider to start a conversation.',
    privateKey: 'Use your own API key',
    noKey: 'No API key required',
    keyTitle: 'Connect to',
    keyIntro: 'Enter your personal API key for this provider.',
    keyLabel: 'Your API key',
    keyPlaceholder: 'Paste your API key here',
    showKey: 'Show API key',
    hideKey: 'Hide API key',
    keyHelp: 'Your key stays in this page session only and is cleared when you refresh (F5).',
    getKey: 'Get an API key',
    continue: 'Continue',
    back: 'Choose another AI',
    welcome: 'Hello! I’m AI Support.',
    welcomeIntro: 'You selected',
    readyNote: 'The interface is ready. Sending questions to the AI will be connected in the next step.',
    composer: 'Messaging will be available after the API is connected…',
    send: 'Send message',
    pending: 'API not connected · Interface preview',
    geminiReady: 'Ask your question. This conversation only exists in the current page session.',
    geminiComposer: 'Message Gemini…',
    geminiSession: 'No chat history stored · Refresh clears messages and API key',
    geminiThinking: 'Gemini is responding…',
    geminiRetry: 'Try again',
    geminiModel: 'Choose Gemini model',
    geminiModelChangeHint: 'Changing models starts a new chat but keeps your API key.',
    geminiUsage: 'View API Usage Limits in Google AI Studio',
    geminiErrors: {
      auth: 'Invalid, unauthorized, or restricted API key. Check the key in Google AI Studio.',
      quota: 'Gemini returned HTTP 429: rate limit or quota exceeded. Please try later.',
      model: 'This Gemini model is not available with this API key.',
      request: 'Gemini rejected the request. Check the prompt or conversation length.',
      network: 'Could not connect directly to Gemini. Check your network, CORS, and API key restrictions.',
      server: 'Gemini is temporarily unavailable. Try again later.',
      response: 'Gemini returned an incomplete or unsupported response. You can try again.',
    },
  },
};

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    expand: <><path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" /></>,
    shrink: <><path d="M3 8h5V3M21 8h-5V3M3 16h5v5M21 16h-5v5" /></>,
    close: <path d="M18 6 6 18M6 6l12 12" />,
    restart: <><path d="M3 11a9 9 0 1 1 2.5 6.2" /><path d="M3 3v8h8" /></>,
    back: <><path d="m15 18-6-6 6-6" /><path d="M9 12h12" /></>,
    eye: <><path d="M2 12s3.7-6 10-6 10 6 10 6-3.7 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    'eye-off': <><path d="m3 3 18 18M10.6 6.1A10.7 10.7 0 0 1 12 6c6.3 0 10 6 10 6a15 15 0 0 1-3.2 3.5M6.6 6.6C3.7 8.4 2 12 2 12s3.7 6 10 6a10.7 10.7 0 0 0 4.2-.8" /><path d="M10 10a3 3 0 0 0 4 4" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    key: <><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9 2 2-2 2 2 2-3 3-2-2-3 3" /></>,
  };

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function AiChatWidget() {
  const { language } = useLanguage();
  const t = translations[language];
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [stage, setStage] = useState<Stage>('providers');
  const [providerId, setProviderId] = useState<ProviderId | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [geminiModel, setGeminiModel] = useState<GeminiModelId>(GEMINI_DEFAULT_MODEL);
  const [showKey, setShowKey] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [turns, setTurns] = useState<GeminiTurn[]>([]);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<ChatFailure | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const epochRef = useRef(0);
  const messageIdRef = useRef(0);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  const selectedProvider = providers.find((provider) => provider.id === providerId);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (fullscreen) setFullscreen(false);
      else setOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, fullscreen]);

  useEffect(() => () => {
    epochRef.current += 1;
    controllerRef.current?.abort();
  }, []);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages]);

  function resetConversation() {
    epochRef.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    setMessages([]);
    setTurns([]);
    setDraft('');
    setSending(false);
    setFailure(null);
  }

  function chooseProvider(id: ProviderId) {
    resetConversation();
    setGeminiModel(GEMINI_DEFAULT_MODEL);
    setProviderId(id);
    setApiKey('');
    setShowKey(false);
    setStage(id === 'cloudflare' ? 'chat' : 'api-key');
  }

  function restart() {
    resetConversation();
    setGeminiModel(GEMINI_DEFAULT_MODEL);
    setStage('providers');
    setProviderId(null);
    setApiKey('');
    setShowKey(false);
  }

  function acceptKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (providerId && apiKey.trim()) setStage('chat');
  }

  function chooseGeminiModel(model: GeminiModelId) {
    if (sending || model === geminiModel) return;
    resetConversation();
    setGeminiModel(model);
  }

  async function sendGemini(prompt: string) {
    const content = prompt.trim();
    if (!content || !apiKey.trim() || providerId !== 'gemini' || controllerRef.current) return;

    const controller = new AbortController();
    controllerRef.current = controller;
    const epoch = ++epochRef.current;
    const userId = ++messageIdRef.current;
    const assistantId = ++messageIdRef.current;
    setSending(true);
    setFailure(null);
    setDraft('');
    setMessages((current) => [
      ...current,
      { id: userId, role: 'user', text: content },
      { id: assistantId, role: 'assistant', text: '', streaming: true },
    ]);
    try {
      const result = await streamGeminiMessage({
        apiKey, model: geminiModel, prompt: content, turns, signal: controller.signal,
        onText: (text) => {
          if (epoch !== epochRef.current) return;
          setMessages((current) => current.map((message) =>
            message.id === assistantId ? { ...message, text } : message));
        },
      });
      if (epoch !== epochRef.current) return;
      setTurns((current) => [...current, result.turn]);
      setMessages((current) => current.map((message) =>
        message.id === assistantId ? { ...message, text: result.text, streaming: false } : message));
    } catch (error) {
      if (epoch !== epochRef.current || controller.signal.aborted) return;
      setFailure({
        code: error instanceof GeminiApiError ? error.code : 'network',
        prompt: content,
      });
      setMessages((current) => current.map((message) =>
        message.id === assistantId ? { ...message, streaming: false } : message));
    } finally {
      if (epoch === epochRef.current) {
        controllerRef.current = null;
        setSending(false);
      }
    }
  }

  function retryGemini() {
    if (!failure || sending) return;
    const prompt = failure.prompt;
    setMessages((current) => current.slice(0, -2));
    setFailure(null);
    void sendGemini(prompt);
  }

  function submitGemini(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendGemini(draft);
  }

  return (
    <div className="ai-chat">
      {!open && (
        <button type="button" className="ai-chat__launcher" onClick={() => setOpen(true)}
          aria-label={t.open} aria-expanded={false} aria-controls="ai-chat-panel">
          <span>{t.assistant}</span>
        </button>
      )}

      {open && (
        <section id="ai-chat-panel" className={`ai-chat__panel${fullscreen ? ' ai-chat__panel--fullscreen' : ''}`}
          role="dialog" aria-modal="false" aria-labelledby="ai-chat-title">
          <header className="ai-chat__header">
            <div className="ai-chat__identity">
              <strong id="ai-chat-title">{t.assistant}</strong>
            </div>
            <div className="ai-chat__header-actions">
              {stage !== 'providers' && (
                <button type="button" className="ai-chat__icon-btn" onClick={restart}
                  title={`${t.restart} · ${t.restartHint}`} aria-label={t.restart}>
                  <Icon name="restart" />
                </button>
              )}
              <button type="button" className="ai-chat__icon-btn" onClick={() => setFullscreen((current) => !current)}
                title={fullscreen ? t.shrink : t.expand} aria-label={fullscreen ? t.shrink : t.expand}>
                <Icon name={fullscreen ? 'shrink' : 'expand'} />
              </button>
              <button type="button" className="ai-chat__icon-btn" onClick={() => { setOpen(false); setFullscreen(false); }}
                title={t.close} aria-label={t.close}>
                <Icon name="close" />
              </button>
            </div>
          </header>

          <div className={`ai-chat__body ai-chat__body--${stage}${stage === 'chat' && providerId === 'gemini' ? ' ai-chat__body--messages' : ''}`}>
            {stage === 'providers' && (
              <div className="ai-chat__setup">
                <span className="ai-chat__hero-mark" aria-hidden="true">✦</span>
                <h2>{t.chooseTitle}</h2>
                <p className="ai-chat__intro">{t.chooseIntro}</p>
                <div className="ai-chat__providers">
                  {providers.map((provider) => (
                    <button key={provider.id} type="button" className="ai-chat__provider"
                      onClick={() => chooseProvider(provider.id)}>
                      <span className={`ai-chat__provider-mark ai-chat__provider-mark--${provider.id}`} aria-hidden="true">
                        {provider.mark}
                      </span>
                      <strong>{provider.name}</strong>
                      <span className="ai-chat__provider-description">{provider.description[language]}</span>
                      <span className="ai-chat__provider-next" aria-hidden="true"><Icon name="arrow" /></span>
                    </button>
                  ))}
                </div>
                <p className="ai-chat__setup-note"><Icon name="key" /> {t.privateKey} · {t.noKey}: Workers AI</p>
              </div>
            )}

            {stage === 'api-key' && selectedProvider && (
              <div className="ai-chat__setup ai-chat__setup--key">
                <button type="button" className="ai-chat__back" onClick={restart}>
                  <Icon name="back" /> {t.back}
                </button>
                <span className={`ai-chat__provider-mark ai-chat__provider-mark--large ai-chat__provider-mark--${selectedProvider.id}`} aria-hidden="true">
                  {selectedProvider.mark}
                </span>
                <h2>{t.keyTitle} {selectedProvider.name}</h2>
                <p className="ai-chat__intro">{t.keyIntro}</p>
                <form className="ai-chat__key-form" onSubmit={acceptKey}>
                  <label htmlFor="ai-chat-key">{t.keyLabel}</label>
                  <div className="ai-chat__key-field">
                    <input id="ai-chat-key" type={showKey ? 'text' : 'password'} value={apiKey}
                      onInput={(event) => setApiKey(event.currentTarget.value)} autoComplete="off" spellCheck={false}
                      placeholder={t.keyPlaceholder} />
                    <button type="button" onClick={() => setShowKey((current) => !current)}
                      aria-label={showKey ? t.hideKey : t.showKey} title={showKey ? t.hideKey : t.showKey}>
                      <Icon name={showKey ? 'eye-off' : 'eye'} />
                    </button>
                  </div>
                  <p className="ai-chat__key-help">{t.keyHelp}</p>
                  {selectedProvider.keyUrl && (
                    <a className="ai-chat__key-link" href={selectedProvider.keyUrl} target="_blank" rel="noopener noreferrer">
                      {t.getKey} <Icon name="arrow" />
                    </a>
                  )}
                  <button className="ai-chat__continue" type="submit" disabled={!apiKey.trim()}>
                    {t.continue} <Icon name="arrow" />
                  </button>
                </form>
              </div>
            )}

            {stage === 'chat' && providerId === 'gemini' && (
              <div className="ai-chat__transcript" ref={transcriptRef} role="log" aria-label="Gemini chat">
                {messages.length === 0 && (
                  <div className="ai-chat__welcome">
                    <h2>{t.welcome}</h2>
                    <p>{t.welcomeIntro} <strong>Gemini</strong> · {geminiModel}</p>
                    <p className="ai-chat__ready-note">{t.geminiReady}</p>
                  </div>
                )}
                {messages.map((message) => (
                  <div key={message.id} className={`ai-chat__message ai-chat__message--${message.role}`}>
                    {message.role === 'assistant' && <strong className="ai-chat__message-label">Gemini</strong>}
                    {message.role === 'user' ? (
                      <p>{message.text}</p>
                    ) : message.text ? (
                      <div className="ai-chat__markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                          a: ({ node: _node, ...props }) =>
                            <a {...props} target="_blank" rel="noopener noreferrer" />,
                        }}>{message.text}</ReactMarkdown>
                      </div>
                    ) : message.streaming ? (
                      <p className="ai-chat__streaming">{t.geminiThinking}</p>
                    ) : null}
                  </div>
                ))}
                {failure && (
                  <div className="ai-chat__chat-error" role="alert">
                    <p>{t.geminiErrors[failure.code]}</p>
                    <button type="button" onClick={retryGemini} disabled={sending}>{t.geminiRetry}</button>
                  </div>
                )}
              </div>
            )}

            {stage === 'chat' && selectedProvider && providerId !== 'gemini' && (
              <div className="ai-chat__welcome">
                <h2>{t.welcome}</h2>
                <p>{t.welcomeIntro} <strong>{selectedProvider.name}</strong>.</p>
                <p className="ai-chat__ready-note">{t.readyNote}</p>
                <button type="button" className="ai-chat__switch" onClick={restart}>{t.back} <Icon name="arrow" /></button>
              </div>
            )}
          </div>

          {stage === 'chat' && providerId === 'gemini' && (
            <footer className="ai-chat__footer">
              <div className="ai-chat__model-settings">
                <label htmlFor="ai-chat-gemini-model">{t.geminiModel}</label>
                <select id="ai-chat-gemini-model" value={geminiModel}
                  disabled={sending}
                  title={t.geminiModelChangeHint}
                  onChange={(event) => chooseGeminiModel(event.currentTarget.value as GeminiModelId)}>
                  {GEMINI_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>{model.label}</option>
                  ))}
                </select>
                <span className="ai-chat__model-hint">{t.geminiModelChangeHint}</span>
                <a href="https://aistudio.google.com/rate-limit" target="_blank"
                  rel="noopener noreferrer" className="ai-chat__usage-link">{t.geminiUsage}</a>
              </div>
              <form className="ai-chat__composer" onSubmit={submitGemini}>
                <textarea aria-label={t.geminiComposer} placeholder={t.geminiComposer}
                  rows={1} maxLength={16000} value={draft} disabled={sending}
                  onInput={(event) => setDraft(event.currentTarget.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }} />
                <button type="submit" disabled={sending || !draft.trim()} aria-label={t.send}>
                  <Icon name="arrow" />
                </button>
              </form>
              <p>{t.geminiSession}</p>
            </footer>
          )}

          {stage === 'chat' && providerId !== 'gemini' && (
            <footer className="ai-chat__footer">
              <div className="ai-chat__composer">
                <textarea aria-label={t.composer} placeholder={t.composer} rows={1} disabled />
                <button type="button" disabled aria-label={t.send}><Icon name="arrow" /></button>
              </div>
              <p>{t.pending}</p>
            </footer>
          )}
        </section>
      )}
    </div>
  );
}
