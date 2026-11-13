export const BACKEND_API_BASE_URL = 'https://api.nguyendodinhphuong.name.vn/api/v1';
export const BACKEND_TOPICS_URL = `${BACKEND_API_BASE_URL}/topics`;

/** Development smoke check: the former /health endpoint was removed from the backend. */
export async function logBackendTopics(): Promise<void> {
  try {
    const response = await fetch(BACKEND_TOPICS_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Topics API returned HTTP ${response.status}`);
    }

    const topics: unknown = await response.json();
    console.log('[learning-platform] Backend topics:', topics);
  } catch (error) {
    console.error('[learning-platform] Backend topics check failed:', error);
  }
}
