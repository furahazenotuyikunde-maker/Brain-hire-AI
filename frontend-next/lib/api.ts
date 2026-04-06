export const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiFetchOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (options.auth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'API request failed');
  }

  return response.json();
}
