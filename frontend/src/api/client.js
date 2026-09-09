const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

/**
 * Minimal fetch wrapper for the GDGoC-CTU backend.
 *
 * Set VITE_API_URL to the backend origin *including* the base path, e.g.
 * `https://<backend-host>/GDGoC-CTU-Main/v0.0.1`, then call with the
 * resource path, e.g. `apiFetch('/events')`.
 *
 * Sends cookies (`credentials: 'include'`) and JSON headers by default.
 * Throws an Error on non-OK responses (with `error.status` and
 * `error.body` attached when available).
 */
export async function apiFetch(path, options = {}) {
  const { headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  });

  if (!response.ok) {
    const error = new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
    error.status = response.status;
    try {
      error.body = await response.json();
    } catch {
      error.body = await response.text().catch(() => null);
    }
    throw error;
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export { API_BASE_URL };
