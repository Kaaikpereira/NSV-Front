// src/api/user.ts
import { apiClient } from './client';
import type { User } from '@/types/api'; // ajuste para o seu tipo

export async function updateDisplayName(displayName: string): Promise<{ user: User }> {
  return apiClient<{ user: User }>('/user/display-name', {
    method: 'PATCH',
    body: JSON.stringify({ displayName }),
  });
}
