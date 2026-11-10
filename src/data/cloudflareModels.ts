/** Allowlisted Cloudflare-hosted text-generation models. Shared by UI and Worker. */
export const CLOUDFLARE_AI_MODELS = [
  { id: '@cf/google/gemma-4-26b-a4b-it', label: 'Gemma 4 26B · Cân bằng' },
  { id: '@cf/openai/gpt-oss-20b', label: 'GPT-OSS 20B · Nhanh' },
  { id: '@cf/openai/gpt-oss-120b', label: 'GPT-OSS 120B · Chuyên sâu' },
  { id: '@cf/qwen/qwen3.8-27b', label: 'Qwen 3.8 27B · Coding' },
] as const;

export type CloudflareAiModelId = (typeof CLOUDFLARE_AI_MODELS)[number]['id'];
export const CLOUDFLARE_AI_DEFAULT_MODEL: CloudflareAiModelId = '@cf/google/gemma-4-26b-a4b-it';
export const CLOUDFLARE_AI_CHAT_PATH = '/api/ai/cloudflare';
export const CLOUDFLARE_AI_DOCS_URL = 'https://developers.cloudflare.com/workers-ai/get-started/rest-api/';
export const CLOUDFLARE_AI_USAGE_URL = 'https://dash.cloudflare.com/';
