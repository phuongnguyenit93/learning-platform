import { PUBLIC_RELEASE_CACHE_TTL_MS } from './githubPublicRelease';

/** A return to a visible Local Run panel only triggers another check after TTL. */
export function shouldRefreshLocalRunOnReturn(
  lastCheckStartedAt: number,
  now: number,
  checkingOrBuilding: boolean,
): boolean {
  return !checkingOrBuilding && (lastCheckStartedAt === 0 || now - lastCheckStartedAt >= PUBLIC_RELEASE_CACHE_TTL_MS);
}
