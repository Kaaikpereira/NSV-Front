import { apiClient } from './client';
import type { NixTransferInput, NixTransferResponse, CreateTransactionInput, CreateTransactionResponse } from '@/types/api';

// Tenta usar a rota dedicada de Nix, fallback para /transactions
export async function transferNix(
  input: NixTransferInput
): Promise<NixTransferResponse> {
  try {
    // Tenta a rota dedicada primeiro
    return await apiClient<NixTransferResponse>('/nix/transfer', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  } catch (error) {
    // Se a rota não existir (404), usa fallback
    if (error instanceof Error && 'status' in error && (error as { status: number }).status === 404) {
      const fallbackInput: CreateTransactionInput = {
        type: 'nix',
        amount: input.amount,
        description: `Nix para ${input.to_account}${input.description ? ` - ${input.description}` : ''}`,
      };
      
      return apiClient<CreateTransactionResponse>('/transactions', {
        method: 'POST',
        body: JSON.stringify(fallbackInput),
      });
    }
    throw error;
  }
}
