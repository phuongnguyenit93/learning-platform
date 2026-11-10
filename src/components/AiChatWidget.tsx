import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../state/LanguageContext';
import {
  GEMINI_DEFAULT_MODEL, GEMINI_MODELS, GeminiApiError, streamGeminiMessage,
  type GeminiErrorCode, type GeminiModelId, type GeminiTurn,
} from '../data/geminiDirect';
import {
  GROQ_DEFAULT_MODEL, GROQ_LIMITS_URL, GROQ_MODELS, GroqApiError, streamGroqMessage,
  type GroqModelId, type GroqTurn,
} from '../data/groqDirect';
import {
  OPENROUTER_DEFAULT_MODEL, OPENROUTER_FREE_MODELS_URL, OPENROUTER_MODELS,
  OPENROUTER_USAGE_URL, OpenRouterApiError, streamOpenRouterMessage,
  type OpenRouterModelId, type OpenRouterTurn,
} from '../data/openRouterDirect';
import {
  CLOUDFLARE_AI_DEFAULT_MODEL, CLOUDFLARE_AI_DOCS_URL,
  CLOUDFLARE_AI_MODELS, CLOUDFLARE_AI_USAGE_URL,
  type CloudflareAiModelId,
} from '../data/cloudflareModels';
import {
  CloudflareAiApiError, streamCloudflareAiMessage,
  type CloudflareAiTurn,
} from '../data/cloudflareDirect';
import {
  AI_SUPPORT_TOPIC_EVENT, formatAiSupportQuestion, type AiSupportTopic,
} from '../data/aiSupportTopic';

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
    description: { vi: 'Cloudflare · Dùng quota của bạn', en: 'Cloudflare · Your own quota' },
    keyUrl: CLOUDFLARE_AI_DOCS_URL,
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
    noKey: 'Dùng API key của bạn',
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
    groqReady: 'Hãy đặt câu hỏi. Hội thoại Groq chỉ được giữ trong phiên trang hiện tại.',
    groqComposer: 'Nhắn tin cho Groq…',
    groqThinking: 'Groq đang trả lời…',
    groqModel: 'Chọn model Groq',
    groqUsage: 'Xem API Usage Limits trên Groq Console',
    openRouterReady: 'Hãy đặt câu hỏi. Hội thoại chỉ được giữ trong phiên trang hiện tại.',
    openRouterComposer: 'Nhắn tin cho OpenRouter…',
    openRouterThinking: 'OpenRouter đang trả lời…',
    openRouterModel: 'Chọn model OpenRouter',
    openRouterUsage: 'Xem API Usage trên OpenRouter',
    openRouterModelsLink: 'Xem thêm các model miễn phí trên OpenRouter',
    cloudflareAccount: 'Cloudflare Account ID',
    cloudflareAccountPlaceholder: '32 ký tự hex trong Cloudflare Dashboard',
    cloudflareToken: 'Cloudflare Workers AI API Token',
    cloudflareKeyIntro: 'Nhập Account ID và Workers AI API Token riêng của bạn.',
    cloudflareKeyHelp: 'Token được chuyển qua Worker của website để gọi Workers AI bằng quota tài khoản bạn; không lưu token hoặc nội dung trò chuyện. Không dùng Global API Key.',
    cloudflareReady: 'Hãy đặt câu hỏi. Inference sử dụng quota Workers AI của tài khoản Cloudflare bạn.',
    cloudflareComposer: 'Nhắn tin cho Workers AI…',
    cloudflareThinking: 'Workers AI đang trả lời…',
    cloudflareModel: 'Chọn model Workers AI',
    cloudflareUsage: 'Xem Workers AI Usage trên Cloudflare Dashboard',
    cloudflareErrors: {
      auth: 'Account ID hoặc API Token không hợp lệ / không có quyền Workers AI. Hãy kiểm tra lại.',
      quota: 'Giới hạn Workers AI hoặc giới hạn proxy đã đạt (429). Hãy thử lại sau.',
      model: 'Model này chưa khả dụng trên tài khoản Cloudflare của bạn. Chọn model khác.',
      request: 'Yêu cầu bị từ chối. Kiểm tra Account ID, nội dung và độ dài câu hỏi.',
      network: 'Không kết nối được Workers AI qua website. Hãy kiểm tra mạng.',
      server: 'Proxy hoặc Cloudflare Workers AI đang gặp lỗi. Hãy thử lại.',
      response: 'Workers AI trả về dữ liệu không hoàn chỉnh. Bạn có thể thử lại.',
    },
    openRouterErrors: {
      auth: 'API key OpenRouter không hợp lệ hoặc không được phép sử dụng. Kiểm tra lại trong OpenRouter.',
      quota: 'OpenRouter đã báo hết hạn mức hoặc không đủ credit (402/429). Hãy xem API Usage.',
      model: 'Model OpenRouter không khả dụng. Hãy chọn model khác hoặc xem danh sách model miễn phí.',
      request: 'OpenRouter từ chối yêu cầu. Hãy kiểm tra nội dung hoặc độ dài câu hỏi.',
      network: 'Không thể kết nối trực tiếp OpenRouter. Hãy kiểm tra mạng, CORS hoặc cấu hình API key.',
      server: 'OpenRouter hoặc nhà cung cấp model đang gặp lỗi. Hãy thử lại sau.',
      response: 'Phản hồi OpenRouter không hoàn chỉnh. Bạn có thể thử lại.',
    },
    groqErrors: {
      auth: 'API key Groq không hợp lệ hoặc chưa được cấp quyền. Hãy kiểm tra lại trong Groq Console.',
      quota: 'Groq đã trả lỗi 429: hết quota hoặc vượt giới hạn tốc độ. Hãy thử lại sau.',
      model: 'Model Groq này không khả dụng với API key của bạn.',
      request: 'Groq từ chối yêu cầu. Hãy kiểm tra nội dung hoặc độ dài hội thoại.',
      network: 'Không thể kết nối trực tiếp Groq. Hãy kiểm tra mạng, CORS hoặc cấu hình key.',
      server: 'Groq đang gặp lỗi dịch vụ. Hãy thử lại sau.',
      response: 'Phản hồi Groq không hoàn chỉnh. Bạn có thể thử lại.',
    },
    topicHeading: 'Chủ đề đang hỏi',
    topicModule: 'Menu tổng · Module',
    topicChapter: 'Menu cấp 1 · Chương',
    topicQuizGroup: 'Menu cấp 1 · Nhóm Quiz',
    topicInterviewGroup: 'Menu cấp 1 · Nhóm Interview',
    topicLesson: 'Menu cấp 2 · Bài học',
    topicQuizQuestion: 'Menu cấp 2 · Câu hỏi Quiz',
    topicInterviewQuestion: 'Menu cấp 2 · Câu hỏi Interview',
    topicRemove: 'Bỏ chủ đề này',
    topicRemoveHint: 'Bỏ ngữ cảnh chủ đề và bắt đầu chat bình thường, giữ nguyên API key và model',
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
    noKey: 'Use your own API key',
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
    groqReady: 'Ask your question. Groq chat history exists only in this page session.',
    groqComposer: 'Message Groq…',
    groqThinking: 'Groq is responding…',
    groqModel: 'Choose Groq model',
    groqUsage: 'View API Usage Limits in Groq Console',
    openRouterReady: 'Ask your question. The conversation exists only in this page session.',
    openRouterComposer: 'Message OpenRouter…',
    openRouterThinking: 'OpenRouter is responding…',
    openRouterModel: 'Choose OpenRouter model',
    openRouterUsage: 'View API Usage on OpenRouter',
    openRouterModelsLink: 'Explore more free models on OpenRouter',
    cloudflareAccount: 'Cloudflare Account ID',
    cloudflareAccountPlaceholder: '32-character hexadecimal account ID',
    cloudflareToken: 'Cloudflare Workers AI API Token',
    cloudflareKeyIntro: 'Enter your own Account ID and Workers AI API Token.',
    cloudflareKeyHelp: 'The token passes through this site’s Worker to use your Cloudflare account quota; neither token nor conversation is stored. Do not use a Global API Key.',
    cloudflareReady: 'Ask your question. Inference uses your Cloudflare Workers AI quota.',
    cloudflareComposer: 'Message Workers AI…',
    cloudflareThinking: 'Workers AI is responding…',
    cloudflareModel: 'Choose Workers AI model',
    cloudflareUsage: 'View Workers AI Usage on Cloudflare Dashboard',
    cloudflareErrors: {
      auth: 'Invalid Account ID / API Token, or missing Workers AI permission. Check your credentials.',
      quota: 'Cloudflare inference or site proxy rate limit reached (429). Please try later.',
      model: 'This model is not available on your Cloudflare account. Choose another model.',
      request: 'The request was rejected. Check Account ID, prompt and conversation length.',
      network: 'Unable to connect to Workers AI through this site. Check your network.',
      server: 'The proxy or Cloudflare Workers AI is temporarily unavailable.',
      response: 'Workers AI returned an incomplete response. You may retry.',
    },
    openRouterErrors: {
      auth: 'Invalid or unauthorized OpenRouter API key. Check it in OpenRouter.',
      quota: 'OpenRouter reported a quota or credit issue (402/429). Check your API Usage.',
      model: 'This OpenRouter model is unavailable. Choose another or browse the free models catalog.',
      request: 'OpenRouter rejected the request. Check the prompt or conversation length.',
      network: 'Could not connect directly to OpenRouter. Check the network, CORS and key settings.',
      server: 'OpenRouter or its model provider is temporarily unavailable. Try again later.',
      response: 'OpenRouter returned an incomplete response. Please retry.',
    },
    groqErrors: {
      auth: 'Invalid or unauthorized Groq API key. Check the key in Groq Console.',
      quota: 'Groq returned HTTP 429: rate limit or quota exceeded. Please try later.',
      model: 'This Groq model is unavailable with your API key.',
      request: 'Groq rejected the request. Check the prompt or conversation length.',
      network: 'Could not connect directly to Groq. Check your network, CORS, and API key settings.',
      server: 'Groq is temporarily unavailable. Please try later.',
      response: 'Groq returned an incomplete response. You can try again.',
    },
    topicHeading: 'Current topic',
    topicModule: 'Main menu · Module',
    topicChapter: 'Level 1 · Chapter',
    topicQuizGroup: 'Level 1 · Quiz group',
    topicInterviewGroup: 'Level 1 · Interview group',
    topicLesson: 'Level 2 · Lesson',
    topicQuizQuestion: 'Level 2 · Quiz question',
    topicInterviewQuestion: 'Level 2 · Interview question',
    topicRemove: 'Remove this topic',
    topicRemoveHint: 'Clear the topic and start a normal chat, keeping your API key and model',
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
  const [groqModel, setGroqModel] = useState<GroqModelId>(GROQ_DEFAULT_MODEL);
  const [openRouterModel, setOpenRouterModel] = useState<OpenRouterModelId>(OPENROUTER_DEFAULT_MODEL);
  const [cloudflareModel, setCloudflareModel] = useState<CloudflareAiModelId>(CLOUDFLARE_AI_DEFAULT_MODEL);
  const [cloudflareAccountId, setCloudflareAccountId] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [turns, setTurns] = useState<GeminiTurn[]>([]);
  const [groqTurns, setGroqTurns] = useState<GroqTurn[]>([]);
  const [openRouterTurns, setOpenRouterTurns] = useState<OpenRouterTurn[]>([]);
  const [cloudflareTurns, setCloudflareTurns] = useState<CloudflareAiTurn[]>([]);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<ChatFailure | null>(null);
  const [topic, setTopic] = useState<AiSupportTopic | null>(null);
  const [fullscreenHost, setFullscreenHost] = useState<HTMLElement | null>(null);
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

  // The learning reader uses native fullscreen on its content element. An AI
  // popup outside that element would be hidden by the browser's fullscreen top
  // layer, regardless of z-index. Portal into the active fullscreen surface.
  useEffect(() => {
    const updateHost = () => {
      const active = document.fullscreenElement;
      setFullscreenHost(active?.matches('.learning-main--reading, .reading-fullscreen-surface')
        ? active as HTMLElement : null);
    };
    updateHost();
    document.addEventListener('fullscreenchange', updateHost);
    return () => document.removeEventListener('fullscreenchange', updateHost);
  }, []);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages]);

  const resetConversation = useCallback(() => {
    epochRef.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    setMessages([]);
    setTurns([]);
    setGroqTurns([]);
    setOpenRouterTurns([]);
    setCloudflareTurns([]);
    setDraft('');
    setSending(false);
    setFailure(null);
  }, []);

  useEffect(() => {
    const onTopic = (event: Event) => {
      const nextTopic = (event as CustomEvent<AiSupportTopic>).detail;
      if (!nextTopic || !['knowledge', 'quiz', 'interview'].includes(nextTopic.kind)) return;
      resetConversation();
      setTopic(nextTopic);
      setOpen(true);
    };
    window.addEventListener(AI_SUPPORT_TOPIC_EVENT, onTopic);
    return () => window.removeEventListener(AI_SUPPORT_TOPIC_EVENT, onTopic);
  }, [resetConversation]);

  function removeTopic() {
    resetConversation();
    setTopic(null);
  }

  function chooseProvider(id: ProviderId) {
    resetConversation();
    setGeminiModel(GEMINI_DEFAULT_MODEL);
    setGroqModel(GROQ_DEFAULT_MODEL);
    setOpenRouterModel(OPENROUTER_DEFAULT_MODEL);
    setCloudflareModel(CLOUDFLARE_AI_DEFAULT_MODEL);
    setCloudflareAccountId('');
    setProviderId(id);
    setApiKey('');
    setShowKey(false);
    setStage('api-key');
  }

  function restart() {
    resetConversation();
    setTopic(null);
    setGeminiModel(GEMINI_DEFAULT_MODEL);
    setGroqModel(GROQ_DEFAULT_MODEL);
    setOpenRouterModel(OPENROUTER_DEFAULT_MODEL);
    setCloudflareModel(CLOUDFLARE_AI_DEFAULT_MODEL);
    setCloudflareAccountId('');
    setStage('providers');
    setProviderId(null);
    setApiKey('');
    setShowKey(false);
  }

  function acceptKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (providerId && apiKey.trim()
      && (providerId !== 'cloudflare' || /^[0-9a-f]{32}$/i.test(cloudflareAccountId.trim()))) {
      setStage('chat');
    }
  }

  function chooseGeminiModel(model: GeminiModelId) {
    if (sending || model === geminiModel) return;
    resetConversation();
    setGeminiModel(model);
  }

  function chooseGroqModel(model: GroqModelId) {
    if (sending || model === groqModel) return;
    resetConversation();
    setGroqModel(model);
  }

  function chooseOpenRouterModel(model: OpenRouterModelId) {
    if (sending || model === openRouterModel) return;
    resetConversation();
    setOpenRouterModel(model);
  }

  function chooseCloudflareModel(model: CloudflareAiModelId) {
    if (sending || model === cloudflareModel) return;
    resetConversation();
    setCloudflareModel(model);
  }

  async function sendMessage(prompt: string) {
    const content = prompt.trim();
    if (!content || !apiKey.trim()
      || (providerId !== 'gemini' && providerId !== 'groq'
        && providerId !== 'openrouter' && providerId !== 'cloudflare')
      || (providerId === 'cloudflare' && !/^[0-9a-f]{32}$/i.test(cloudflareAccountId.trim()))
      || controllerRef.current) return;

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
      const contextualPrompt = formatAiSupportQuestion(topic, content, language);
      const onText = (text: string) => {
        if (epoch !== epochRef.current) return;
        setMessages((current) => current.map((message) =>
          message.id === assistantId ? { ...message, text } : message));
      };
      const result = providerId === 'gemini'
        ? await streamGeminiMessage({
            apiKey, model: geminiModel, prompt: contextualPrompt,
            turns, signal: controller.signal, onText,
          })
        : providerId === 'groq'
          ? await streamGroqMessage({
              apiKey, model: groqModel, prompt: contextualPrompt,
              turns: groqTurns, signal: controller.signal, onText,
            })
          : providerId === 'openrouter' ? await streamOpenRouterMessage({
              apiKey, model: openRouterModel, prompt: contextualPrompt,
              turns: openRouterTurns, signal: controller.signal, onText,
            }) : await streamCloudflareAiMessage({
              apiToken: apiKey, accountId: cloudflareAccountId,
              model: cloudflareModel, prompt: contextualPrompt,
              turns: cloudflareTurns, signal: controller.signal, onText,
            });
      if (epoch !== epochRef.current) return;
      if (providerId === 'gemini') {
        setTurns((current) => [...current, result.turn as GeminiTurn]);
      } else if (providerId === 'groq') {
        setGroqTurns((current) => [...current, result.turn as GroqTurn]);
      } else if (providerId === 'openrouter') {
        setOpenRouterTurns((current) => [...current, result.turn as OpenRouterTurn]);
      } else {
        setCloudflareTurns((current) => [...current, result.turn as CloudflareAiTurn]);
      }
      setMessages((current) => current.map((message) =>
        message.id === assistantId ? { ...message, text: result.text, streaming: false } : message));
    } catch (error) {
      if (epoch !== epochRef.current || controller.signal.aborted) return;
      setFailure({
        code: error instanceof GeminiApiError || error instanceof GroqApiError
          || error instanceof OpenRouterApiError || error instanceof CloudflareAiApiError
          ? error.code : 'network',
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

  function retryMessage() {
    if (!failure || sending) return;
    const prompt = failure.prompt;
    setMessages((current) => current.slice(0, -2));
    setFailure(null);
    void sendMessage(prompt);
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  const chat = (
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

          {topic && (
            <aside className="ai-chat__topic" aria-label={t.topicHeading}>
              <div className="ai-chat__topic-bar">
                <strong>{t.topicHeading}</strong>
                <button type="button" className="ai-chat__topic-remove" onClick={removeTopic}
                  title={t.topicRemoveHint}>{t.topicRemove}</button>
              </div>
              <div className="ai-chat__topic-path">
                <div>
                  <span>{t.topicModule}</span>
                  <strong title={topic.moduleName}>{topic.moduleName}</strong>
                </div>
                <div>
                  <span>{topic.kind === 'knowledge' ? t.topicChapter
                    : topic.kind === 'quiz' ? t.topicQuizGroup : t.topicInterviewGroup}</span>
                  <strong title={topic.groupTitle}>{topic.groupTitle}</strong>
                </div>
                <div>
                  <span>{topic.kind === 'knowledge' ? t.topicLesson
                    : topic.kind === 'quiz' ? t.topicQuizQuestion : t.topicInterviewQuestion}</span>
                  <strong title={topic.itemTitle}>{topic.itemTitle}</strong>
                </div>
              </div>
            </aside>
          )}

          <div className={`ai-chat__body ai-chat__body--${stage}${stage === 'chat' ? ' ai-chat__body--messages' : ''}`}>
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
                <p className="ai-chat__setup-note"><Icon name="key" /> {t.privateKey}</p>
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
                <p className="ai-chat__intro">{providerId === 'cloudflare' ? t.cloudflareKeyIntro : t.keyIntro}</p>
                <form className="ai-chat__key-form" onSubmit={acceptKey}>
                  {providerId === 'cloudflare' && (
                    <>
                      <label htmlFor="ai-chat-account-id">{t.cloudflareAccount}</label>
                      <div className="ai-chat__key-field">
                        <input id="ai-chat-account-id" value={cloudflareAccountId}
                          onInput={(event) => setCloudflareAccountId(event.currentTarget.value)}
                          placeholder={t.cloudflareAccountPlaceholder} spellCheck={false}
                          autoComplete="off" maxLength={32} />
                      </div>
                    </>
                  )}
                  <label htmlFor="ai-chat-key">{providerId === 'cloudflare' ? t.cloudflareToken : t.keyLabel}</label>
                  <div className="ai-chat__key-field">
                    <input id="ai-chat-key" type={showKey ? 'text' : 'password'} value={apiKey}
                      onInput={(event) => setApiKey(event.currentTarget.value)} autoComplete="off" spellCheck={false}
                      placeholder={t.keyPlaceholder} />
                    <button type="button" onClick={() => setShowKey((current) => !current)}
                      aria-label={showKey ? t.hideKey : t.showKey} title={showKey ? t.hideKey : t.showKey}>
                      <Icon name={showKey ? 'eye-off' : 'eye'} />
                    </button>
                  </div>
                  <p className="ai-chat__key-help">{providerId === 'cloudflare' ? t.cloudflareKeyHelp : t.keyHelp}</p>
                  {selectedProvider.keyUrl && (
                    <a className="ai-chat__key-link" href={selectedProvider.keyUrl} target="_blank" rel="noopener noreferrer">
                      {t.getKey} <Icon name="arrow" />
                    </a>
                  )}
                  <button className="ai-chat__continue" type="submit"
                    disabled={!apiKey.trim() || (providerId === 'cloudflare'
                      && !/^[0-9a-f]{32}$/i.test(cloudflareAccountId.trim()))}>
                    {t.continue} <Icon name="arrow" />
                  </button>
                </form>
              </div>
            )}

            {stage === 'chat' && (providerId === 'gemini' || providerId === 'groq' || providerId === 'openrouter' || providerId === 'cloudflare') && (
              <div className="ai-chat__transcript" ref={transcriptRef} role="log" aria-label={`${selectedProvider?.name ?? ''} chat`}>
                {messages.length === 0 && (
                  <div className="ai-chat__welcome">
                    <h2>{t.welcome}</h2>
                    <p>{t.welcomeIntro} <strong>{selectedProvider?.name}</strong> · {providerId === 'gemini' ? geminiModel : providerId === 'groq' ? groqModel : providerId === 'openrouter' ? openRouterModel : cloudflareModel}</p>
                    <p className="ai-chat__ready-note">{providerId === 'gemini' ? t.geminiReady : providerId === 'groq' ? t.groqReady : providerId === 'openrouter' ? t.openRouterReady : t.cloudflareReady}</p>
                  </div>
                )}
                {messages.map((message) => (
                  <div key={message.id} className={`ai-chat__message ai-chat__message--${message.role}`}>
                    {message.role === 'assistant' && <strong className="ai-chat__message-label">{selectedProvider?.name}</strong>}
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
                      <p className="ai-chat__streaming">{providerId === 'gemini' ? t.geminiThinking : providerId === 'groq' ? t.groqThinking : providerId === 'openrouter' ? t.openRouterThinking : t.cloudflareThinking}</p>
                    ) : null}
                  </div>
                ))}
                {failure && (
                  <div className="ai-chat__chat-error" role="alert">
                    <p>{providerId === 'gemini' ? t.geminiErrors[failure.code] : providerId === 'groq' ? t.groqErrors[failure.code] : providerId === 'openrouter' ? t.openRouterErrors[failure.code] : t.cloudflareErrors[failure.code]}</p>
                    <button type="button" onClick={retryMessage} disabled={sending}>{t.geminiRetry}</button>
                  </div>
                )}
              </div>
            )}

          </div>

          {stage === 'chat' && (providerId === 'gemini' || providerId === 'groq' || providerId === 'openrouter' || providerId === 'cloudflare') && (
            <footer className="ai-chat__footer">
              <div className="ai-chat__model-settings">
                <label htmlFor={providerId === 'gemini' ? 'ai-chat-gemini-model' : providerId === 'groq' ? 'ai-chat-groq-model' : providerId === 'openrouter' ? 'ai-chat-openrouter-model' : 'ai-chat-cloudflare-model'}>
                  {providerId === 'gemini' ? t.geminiModel : providerId === 'groq' ? t.groqModel : providerId === 'openrouter' ? t.openRouterModel : t.cloudflareModel}
                </label>
                {providerId === 'gemini' ? (
                <select id="ai-chat-gemini-model" value={geminiModel}
                  disabled={sending}
                  title={t.geminiModelChangeHint}
                  onChange={(event) => chooseGeminiModel(event.currentTarget.value as GeminiModelId)}>
                  {GEMINI_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>{model.label}</option>
                  ))}
                </select>
                ) : providerId === 'groq' ? (
                <select id="ai-chat-groq-model" value={groqModel}
                  disabled={sending}
                  title={t.geminiModelChangeHint}
                  onChange={(event) => chooseGroqModel(event.currentTarget.value as GroqModelId)}>
                  {GROQ_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>{model.label}</option>
                  ))}
                </select>
                ) : providerId === 'openrouter' ? (
                <select id="ai-chat-openrouter-model" value={openRouterModel}
                  disabled={sending}
                  title={t.geminiModelChangeHint}
                  onChange={(event) => chooseOpenRouterModel(event.currentTarget.value as OpenRouterModelId)}>
                  {OPENROUTER_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>{model.label}</option>
                  ))}
                </select>
                ) : (
                <select id="ai-chat-cloudflare-model" value={cloudflareModel}
                  disabled={sending}
                  title={t.geminiModelChangeHint}
                  onChange={(event) => chooseCloudflareModel(event.currentTarget.value as CloudflareAiModelId)}>
                  {CLOUDFLARE_AI_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>{model.label}</option>
                  ))}
                </select>
                )}
                <span className="ai-chat__model-hint">{t.geminiModelChangeHint}</span>
                <a href={providerId === 'gemini' ? 'https://aistudio.google.com/rate-limit' : providerId === 'groq' ? GROQ_LIMITS_URL : providerId === 'openrouter' ? OPENROUTER_USAGE_URL : CLOUDFLARE_AI_USAGE_URL}
                  target="_blank" rel="noopener noreferrer" className="ai-chat__usage-link">
                  {providerId === 'gemini' ? t.geminiUsage : providerId === 'groq' ? t.groqUsage : providerId === 'openrouter' ? t.openRouterUsage : t.cloudflareUsage}
                </a>
                {providerId === 'openrouter' && (
                  <a href={OPENROUTER_FREE_MODELS_URL} target="_blank"
                    rel="noopener noreferrer" className="ai-chat__usage-link ai-chat__more-models-link">
                    {t.openRouterModelsLink}
                  </a>
                )}
              </div>
              <form className="ai-chat__composer" onSubmit={submitMessage}>
                <textarea aria-label={providerId === 'gemini' ? t.geminiComposer : providerId === 'groq' ? t.groqComposer : providerId === 'openrouter' ? t.openRouterComposer : t.cloudflareComposer}
                  placeholder={providerId === 'gemini' ? t.geminiComposer : providerId === 'groq' ? t.groqComposer : providerId === 'openrouter' ? t.openRouterComposer : t.cloudflareComposer}
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

        </section>
      )}
    </div>
  );
  return fullscreenHost ? createPortal(chat, fullscreenHost) : chat;
}
