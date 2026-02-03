import { apiClient } from './client';
import type {
  TransactionsResponse,
  CreateTransactionInput,
  CreateTransactionResponse,
} from '@/types/api';

export async function listTransactions(): Promise<TransactionsResponse> {
  return apiClient<TransactionsResponse>('/transactions');
}

export async function createTransaction(
  input: CreateTransactionInput
): Promise<CreateTransactionResponse> {
  return apiClient<CreateTransactionResponse>('/transactions', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
