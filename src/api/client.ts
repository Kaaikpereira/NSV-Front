import { BaseUrl } from "@/utils/localhost";

// src/api/client.ts
const BASE_URL = BaseUrl; // ajuste pro seu backend, ou use variável de ambiente

export function getAuthToken(): string | null {
  return localStorage.getItem('nsv_access_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('nsv_access_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('nsv_access_token');
}

function markAuthExpired() {
  localStorage.setItem('nsv_auth_expired', '1');
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;
  const token = getAuthToken();

  if (!skipAuth && !token) {
    throw new ApiError('Token de autenticação não encontrado', 401);
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (!skipAuth && token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && !skipAuth) {
      clearAuthToken();
      markAuthExpired();
      throw new ApiError('Sessão expirada, faça login novamente', 401);
    }

    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }

    throw new ApiError(
      (errorData as { message?: string })?.message || `Erro ${response.status}`,
      response.status,
      errorData
    );
  }

  // ===== sucesso =====

  // 204 No Content -> não tentar fazer json
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  // 200/201 sem body -> também não tentar parsear JSON
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}