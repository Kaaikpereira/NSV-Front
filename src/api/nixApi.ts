// src/api/nixApi.ts
import { getAuthToken, ApiError, clearAuthToken } from '@/api/client';
import type { NixTransferInput, NixTransferResponse } from '@/types/api';
import { BaseUrl } from '@/utils/localhost';

const BASE_URL = BaseUrl;

export async function nixTransfer(input: NixTransferInput): Promise<NixTransferResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError('Token de autenticação não encontrado', 401);
  }

  const res = await fetch(`${BASE_URL}/nix/transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
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

  return (await res.json()) as NixTransferResponse;
}
