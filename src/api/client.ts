const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...init, headers });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new ApiError(401, null, 'Unauthenticated');
  }

  if (!res.ok) {
    let body: any = null;
    try { body = await res.json(); } catch { /* ignore */ }
    throw new ApiError(res.status, body, body?.message || `HTTP ${res.status}`);
  }

  return res;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetch(path, { method: 'GET' });
  return res.json();
}

export async function apiPost<T = any>(path: string, data?: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: 'POST',
    body: data != null ? JSON.stringify(data) : undefined,
  });
  return res.json();
}

export async function apiPut<T = any>(path: string, data?: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: 'PUT',
    body: data != null ? JSON.stringify(data) : undefined,
  });
  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  await apiFetch(path, { method: 'DELETE' });
}
