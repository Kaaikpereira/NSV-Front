import { apiClient } from './client';
import type { MeResponse } from '@/types/api';

export async function getMe(): Promise<MeResponse> {
  return apiClient<MeResponse>('/auth/me');
}
