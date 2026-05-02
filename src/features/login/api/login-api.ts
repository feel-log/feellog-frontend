import { apiClient } from '@/shared/api/api-instance';

interface LoginKakaoRequest {
  accessToken: string
}

interface LoginKakaoResponse {
  accessToken: string
  refreshToken: string
}

export function loginApi(body: LoginKakaoRequest) : Promise<LoginKakaoResponse> {
  return apiClient<LoginKakaoResponse>("/api/v1/auth/kakao", {
    method: "POST",
    body: JSON.stringify(body)
  })
}