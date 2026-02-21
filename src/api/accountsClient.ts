// src/api/accountsClient.ts
import { getAuthToken, ApiError, clearAuthToken, apiClient } from '@/api/client';
import { BaseUrl } from '@/utils/localhost';

const BASE_URL = BaseUrl;

export type AccountLookupResponse = {
  id: string;
  number: string;
  display_name: string;
  avatar_url: string | null;
};

export async function lookupAccount(
  accountDisplay: string
): Promise<AccountLookupResponse | null> {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError('Token de autenticação não encontrado', 401);
  }

  const url = `${BASE_URL}/accounts/lookup?account=${encodeURIComponent(
    accountDisplay
  )}`;

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

    let errorData: unknown;
    try {
      errorData = await res.json();
    } catch {
      errorData = null;
    }

    throw new ApiError(
      (errorData as { message?: string })?.message || `Erro ${res.status}`,
      res.status,
      errorData
    );
  }

  const data = await res.json();
  // backend responde { account: null | { ... } }
  return (data as { account: AccountLookupResponse | null }).account;
}

export async function deleteMyAccount() {
  // ajuste o endpoint pro que você tiver no backend
  await apiClient<void>("/accounts/me", {
    method: "DELETE",
  });
}