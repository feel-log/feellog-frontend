import { apiClient } from '@/shared/api/api-instance';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export function refreshApi(refreshToken: string) {
  return apiClient<TokenResponse>('/api/v1/auth/refresh',{
    method: 'POST',
    body: JSON.stringify({
      refreshToken
    })
  })
}