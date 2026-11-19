import { BACKEND_API_BASE_URL } from './backendHealth';

const BACKEND_ORIGIN = new URL(BACKEND_API_BASE_URL).origin;
const AUTH_API_URL = `${BACKEND_ORIGIN}/api/auth`;

export const GOOGLE_SIGN_IN_URL = `${BACKEND_ORIGIN}/oauth2/authorization/google`;

export interface AuthUser {
  id: number;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  roles: string[];
}

async function authRequest(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${AUTH_API_URL}${path}`, {
    credentials: 'include',
    cache: 'no-store',
    ...init,
  });
}

export async function getGoogleLoginConfig(signal?: AbortSignal): Promise<boolean> {
  const response = await authRequest('/config', { signal });
  if (!response.ok) throw new Error(`Authentication config failed (${response.status})`);

  const config: unknown = await response.json();
  if (!config || typeof config !== 'object' ||
    !('googleLoginEnabled' in config) || typeof config.googleLoginEnabled !== 'boolean') {
    throw new Error('Invalid authentication config');
  }
  return config.googleLoginEnabled;
}

export async function getCurrentUser(signal?: AbortSignal): Promise<AuthUser | null> {
  const response = await authRequest('/me', { signal });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error(`Authentication session failed (${response.status})`);
  return response.json() as Promise<AuthUser>;
}

export async function logoutCurrentUser(): Promise<void> {
  const csrfResponse = await authRequest('/csrf');
  if (!csrfResponse.ok) throw new Error(`CSRF request failed (${csrfResponse.status})`);

  const csrf: unknown = await csrfResponse.json();
  if (!csrf || typeof csrf !== 'object' ||
    !('token' in csrf) || typeof csrf.token !== 'string' || !csrf.token ||
    !('headerName' in csrf) || typeof csrf.headerName !== 'string' || !csrf.headerName) {
    throw new Error('Invalid CSRF response');
  }

  const response = await authRequest('/logout', {
    method: 'POST',
    headers: { [csrf.headerName]: csrf.token },
  });
  if (!response.ok) throw new Error(`Logout failed (${response.status})`);
}
