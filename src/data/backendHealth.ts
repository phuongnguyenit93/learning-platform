export const BACKEND_API_BASE_URL = 'https://api.nguyendodinhphuong.name.vn/api/v1';
export const BACKEND_HEALTH_URL = `${BACKEND_API_BASE_URL}/health`;

/** Development smoke check: show the Oracle Spring Boot API response in F12. */
export async function logBackendHealth(): Promise<void> {
  try {
    const response = await fetch(BACKEND_HEALTH_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Health API returned HTTP ${response.status}`);
    }

    const health: unknown = await response.json();
    console.log('[learning-platform] Spring Boot health:', health);
  } catch (error) {
    console.error('[learning-platform] Spring Boot health check failed:', error);
  }
}
