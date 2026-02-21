// src/hooks/useCreateTransaction.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '@/api/transactionsApi';
import type { CreateTransactionInput, CreateTransactionResponse } from '@/types/api';

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation<CreateTransactionResponse, Error, CreateTransactionInput>({
    mutationFn: (data) => createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}