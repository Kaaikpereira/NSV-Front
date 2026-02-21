// src/api/avatarClient.ts (junto com uploadAvatar)
import { getAuthToken, ApiError, clearAuthToken } from '@/api/client';
import { BaseUrl } from '@/utils/localhost';

const BASE_URL = BaseUrl;

export async function uploadAvatar(formData: FormData): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError('Token de autenticação não encontrado', 401);
  }

  const res = await fetch(`${BASE_URL}/me/avatar`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
      // não setar Content-Type pro multipart
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthToken();
      throw new ApiError('Sessão expirada, faça login novamente', 401);
    }

    let errorData: unknown;
    try {
      errorData = await res.json();
    } catch {
      errorData = null;
    }

    throw new ApiError(
      (errorData as { message?: string })?.message || `Erro ${res.status}`,
      res.status,
      errorData,
    );
  }
}

export async function fetchAvatarBlob(version?: number): Promise<Blob | null> {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError('Token de autenticação não encontrado', 401);
  }

  const url =
    version != null
      ? `${BASE_URL}/me/avatar?v=${version}`
      : `${BASE_URL}/me/avatar`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthToken();
      throw new ApiError('Sessão expirada, faça login novamente', 401);
    }

    // tenta ler erro em JSON, se tiver
    let errorData: unknown;
    try {
      errorData = await res.json();
    } catch {
      errorData = null;
    }

    throw new ApiError(
      (errorData as { message?: string })?.message || `Erro ${res.status}`,
      res.status,
      errorData,
    );
  }

  const contentType = res.headers.get('Content-Type') || '';
  if (!contentType.startsWith('image/')) {
    // evita CORB/ORB tratando resposta que não é imagem
    return null;
  }

  return res.blob();
}