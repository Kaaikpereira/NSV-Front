import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe } from '@/api/authApi';
import type { MeResponse } from '@/types/api';

export function useMe() {
  const queryClient = useQueryClient();

  const query = useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false,
  });

  const refreshMe = () => {
    return queryClient.invalidateQueries({ queryKey: ['me'] });
  };

  return {
    user: query.data?.user,
    account: query.data?.account,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refreshMe,
  };
}
