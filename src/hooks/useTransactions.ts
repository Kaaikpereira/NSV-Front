import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listTransactions } from '@/api/transactionsApi';
import type { Transaction, TransactionsResponse } from '@/types/api';

export function useTransactions() {
  const queryClient = useQueryClient();

  const query = useQuery<TransactionsResponse>({
    queryKey: ['transactions'],
    queryFn: listTransactions,
    staleTime: 1000 * 60, // 1 minuto
  });

  const refresh = () => {
    return queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };

  return {
    transactions: query.data?.transactions ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refresh,
  };
}

// Helper para formatar tipo de transação
export function getTransactionTypeLabel(type: Transaction['type']): string {
  const labels: Record<Transaction['type'], string> = {
    payment: 'Pagamento',
    nix: 'Nix',
    nix_send: 'Nix Enviado',
    nix_receive: 'Nix Recebido',
    purchase: 'Compra na Loja',
    transfer: 'Transferência',
  };
  return labels[type] || type;
}

// Helper para verificar se é débito
export function isDebitTransaction(type: Transaction['type']): boolean {
  return ['payment', 'nix', 'nix_send', 'purchase', 'transfer'].includes(type);
}

// Helper para verificar se é Nix
export function isNixTransaction(type: Transaction['type']): boolean {
  return ['nix', 'nix_send', 'nix_receive'].includes(type);
}
