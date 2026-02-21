import { getAuthToken, ApiError, clearAuthToken } from '@/api/client';
import { AdminAccount } from './adminAccountsClient';
import { AccountStatus } from '@/types/api';
import { AuditLog } from '@/types/audit-log';
import { BaseUrl } from '@/utils/localhost';


const BASE_URL = BaseUrl;

export async function getAuditLogs(): Promise<AuditLog[]> {
  const token = getAuthToken();
  if (!token) throw new ApiError('Token de autenticação não encontrado', 401);

  const res = await fetch(`${BASE_URL}/admin/audit-logs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) clearAuthToken();
    throw new ApiError('Erro ao carregar logs de auditoria', res.status);
  }

  const json = await res.json();
  return (json as { logs: AuditLog[] }).logs;
}

export async function fetchAccounts(): Promise<AdminAccount[]> {
  const token = getAuthToken();
  if (!token) throw new ApiError('Token de autenticação não encontrado', 401);

  const res = await fetch(`${BASE_URL}/admin/accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthToken();
    }
    throw new ApiError('Erro ao carregar contas', res.status);
  }

  const json = await res.json();
  return (json as { accounts: AdminAccount[] }).accounts;
}

export async function updateAccountStatus(
  accountId: string,
  status: AccountStatus
): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new ApiError('Token de autenticação não encontrado', 401);

  const res = await fetch(`${BASE_URL}/admin/accounts/${accountId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status,
      reason: `Status alterado para ${status} via painel admin`,
    }),
  });

  if (!res.ok) {
    if (res.status === 401) clearAuthToken();
    throw new ApiError('Erro ao atualizar conta', res.status);
  }
}

export async function deleteAccount(accountId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new ApiError('Token de autenticação não encontrado', 401);

  const res = await fetch(`${BASE_URL}/admin/accounts/${accountId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    console.log('DELETE /admin/accounts error', res.status);
    const body = await res.text();
    console.log('Body:', body);
    if (res.status === 401) {
      clearAuthToken();
    }
    throw new ApiError('Erro ao deletar conta', res.status);
  }
}