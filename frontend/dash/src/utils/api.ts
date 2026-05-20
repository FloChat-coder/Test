/**
 * Centralized API fetch wrapper.
 * - Automatically includes `credentials: 'include'` so Flask sessions work.
 * - Intercepts 401 responses and redirects to /login.
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const mergedOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
    },
  };

  const response = await fetch(url, mergedOptions);

  if (response.status === 401) {
    // Session expired or not authenticated — redirect to login
    window.location.href = '/login';
    // Return a never-resolving promise to prevent downstream code from running
    return new Promise(() => {});
  }

  return response;
}

/**
 * Convenience wrapper for JSON POST/PUT/DELETE requests.
 */
export async function apiJson(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: unknown
): Promise<Response> {
  return apiFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}
