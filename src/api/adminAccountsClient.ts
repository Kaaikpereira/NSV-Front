// src/api/adminAccountsClient.ts
import { getAuthToken, ApiError, clearAuthToken } from '@/api/client';
import { BaseUrl } from '@/utils/localhost';

const BASE_URL = BaseUrl;

export type AdminAccount = {
  id: string;
  user_id: string;
  owner_name: string;           // nome do usuário
  role: 'admin' | 'tester'; // cargo/perfil
  account_display: string;
  currency: string;
  balance: number;              // saldo atual da conta
  status: 'active' | 'blocked' | 'suspended';
  created_at: string;
  updated_at: string;
};

export async function fetchAdminAccounts(): Promise<AdminAccount[]> {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError('Token não encontrado', 401);
  }

  const res = await fetch(`${BASE_URL}/admin/accounts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthToken();
      throw new ApiError('Sessão expirada', 401);
    }

    throw new ApiError(`Erro ${res.status}`, res.status);
  }

  const data = await res.json();
  return data.accounts as AdminAccount[];
}

export async function updateAdminAccountStatus(
  accountId: string,
  status: AdminAccount['status']
) {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError('Token não encontrado', 401);
  }

  const res = await fetch(`${BASE_URL}/admin/accounts/${accountId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new ApiError(`Erro ${res.status}`, res.status);
  }
}

export async function deleteAdminAccount(accountId: string) {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError('Token não encontrado', 401);
  }

  const res = await fetch(`${BASE_URL}/admin/accounts/${accountId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new ApiError(`Erro ${res.status}`, res.status);
  }
}