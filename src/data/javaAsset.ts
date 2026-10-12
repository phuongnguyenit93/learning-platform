/**
 * Java release metadata intentionally uses root-relative producer paths.
 * Keep its content unchanged and map only requests to the frontend namespace.
 * Other languages can use their own /language/{language} roots in the future.
 */
const JAVA_ROOT = '/language/java';

export function javaAssetUrl(path: string): string {
  if (path === '/module-catalog.json' || path.startsWith('/module/') || path.startsWith('/search/')) {
    return `${JAVA_ROOT}${path}`;
  }
  return path;
}

export function fetchJavaAsset(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(javaAssetUrl(path), { cache: 'no-cache', ...init });
}
