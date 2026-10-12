/** Public, unauthenticated GitHub Release lookup shared by all Local Run modules. */
const BASE = 'https://api.github.com/repos/phuongnguyenit93/java-learning';
const RELEASE_TAG = 'local-run';
const PAGE_SIZE = 100;
const MAX_PAGES = 10;
// Five minutes keeps even multi-page catalog browsing below most unauthenticated
// GitHub REST API budgets; successful builds invalidate this cache immediately.
export const PUBLIC_RELEASE_CACHE_TTL_MS = 5 * 60_000;
const FALLBACK_COOLDOWN_MS = 60_000;

interface PublicReleaseAsset {
  name: string;
  label?: string | null;
  browser_download_url: string;
}

/** Only recoverable public API failures are allowed to use the token-backed Worker. */
export class PublicGithubFallbackError extends Error {
  constructor() {
    super('GitHub public API is temporarily unavailable.');
    this.name = 'PublicGithubFallbackError';
  }
}

let cachedAssets: Map<string, PublicReleaseAsset> | null = null;
let cacheExpiresAt = 0;
let pending: Promise<Map<string, PublicReleaseAsset>> | null = null;
let cooldownUntil = 0;
let generation = 0;

/** Call after a completed build so a cached missing/stale JAR cannot hide a fresh upload. */
export function invalidatePublicReleaseCache(): void {
  generation += 1;
  cachedAssets = null;
  cacheExpiresAt = 0;
  pending = null;
}

function pausePublicRequests(response?: Response): void {
  let until = Date.now() + FALLBACK_COOLDOWN_MS;
  if (response) {
    const retryAfter = Number(response.headers.get('retry-after'));
    if (Number.isFinite(retryAfter) && retryAfter > 0) {
      until = Math.max(until, Date.now() + retryAfter * 1000);
    }
    if (response.headers.get('x-ratelimit-remaining') === '0') {
      const reset = Number(response.headers.get('x-ratelimit-reset'));
      if (Number.isFinite(reset) && reset > 0) {
        until = Math.max(until, reset * 1000);
      }
    }
  }
  cooldownUntil = Math.max(cooldownUntil, Math.min(until, Date.now() + 10 * 60_000));
}

async function publicGet(path: string, allowMissing = false): Promise<Response | null> {
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      headers: { accept: 'application/vnd.github+json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    // Includes CORS failures, browser/network blocks and request timeouts.
    pausePublicRequests();
    throw new PublicGithubFallbackError();
  }

  if (allowMissing && response.status === 404) return null;
  // GitHub's secondary rate limit can return 403 while primary remaining > 0,
  // and not every browser exposes all X-RateLimit-* response headers.
  let rateLimited403 = response.status === 403 && (
    response.headers.get('x-ratelimit-remaining') === '0' || response.headers.has('retry-after')
  );
  if (response.status === 403 && !rateLimited403) {
    try {
      const body = await response.json() as { message?: unknown };
      rateLimited403 = typeof body?.message === 'string' && /rate[ _-]?limit/i.test(body.message);
    } catch {
      // Generic 403: do not automatically invoke the authenticated Worker.
    }
  }
  if (response.status === 429 || response.status >= 500 || rateLimited403) {
    pausePublicRequests(response);
    throw new PublicGithubFallbackError();
  }
  if (!response.ok) {
    // A normal 403, 401 or asset-list 404 must not silently trigger authenticated reads.
    throw new Error(`GitHub public Release API returned HTTP ${response.status}.`);
  }
  return response;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    pausePublicRequests();
    throw new PublicGithubFallbackError();
  }
}

async function loadAssets(): Promise<Map<string, PublicReleaseAsset>> {
  const releaseResponse = await publicGet(`/releases/tags/${RELEASE_TAG}`, true);
  const assets = new Map<string, PublicReleaseAsset>();
  if (!releaseResponse) return assets;

  const metadata = await readJson(releaseResponse) as { id?: unknown };
  if (!Number.isSafeInteger(metadata?.id) || Number(metadata.id) <= 0) {
    pausePublicRequests();
    throw new PublicGithubFallbackError();
  }

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const response = await publicGet(`/releases/${metadata.id}/assets?per_page=${PAGE_SIZE}&page=${page}`);
    const items = await readJson(response!);
    if (!Array.isArray(items) || items.some((asset: unknown) => (
      !asset || typeof asset !== 'object' || typeof (asset as PublicReleaseAsset).name !== 'string'
    ))) {
      pausePublicRequests();
      throw new PublicGithubFallbackError();
    }

    for (const asset of items as PublicReleaseAsset[]) {
      assets.set(asset.name, asset);
    }
    if (items.length < PAGE_SIZE) return assets;
  }

  // An incomplete index must never turn an existing JAR into a false "missing" result.
  pausePublicRequests();
  throw new PublicGithubFallbackError();
}

export async function findPublicReleaseAsset(fileName: string): Promise<PublicReleaseAsset | null> {
  if (Date.now() < cooldownUntil) throw new PublicGithubFallbackError();
  if (cachedAssets && Date.now() < cacheExpiresAt) return validateAsset(cachedAssets.get(fileName) ?? null);

  if (!pending) {
    const currentGeneration = generation;
    const loading = loadAssets();
    pending = loading;
    void loading.then((assets) => {
      if (generation === currentGeneration) {
        cachedAssets = assets;
        cacheExpiresAt = Date.now() + PUBLIC_RELEASE_CACHE_TTL_MS;
      }
    }).catch(() => {}).finally(() => {
      if (pending === loading) pending = null;
    });
  }

  return validateAsset((await pending).get(fileName) ?? null);
}

function validateAsset(asset: PublicReleaseAsset | null): PublicReleaseAsset | null {
  if (!asset) return null;
  try {
    const url = new URL(asset.browser_download_url);
    if (url.protocol === 'https:' && url.hostname === 'github.com'
      && url.pathname.startsWith('/phuongnguyenit93/java-learning/releases/download/')) {
      return asset;
    }
  } catch {
    // A malformed public response should be resolved by the trusted Worker.
  }
  pausePublicRequests();
  throw new PublicGithubFallbackError();
}
