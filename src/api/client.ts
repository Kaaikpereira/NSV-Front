const BASE_URL = 'https://484aca27a0cf.ngrok-free.app/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('nsv_access_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('nsv_access_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('nsv_access_token');
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
    if (response.status === 401) {
      clearAuthToken();
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

  return response.json();
}
