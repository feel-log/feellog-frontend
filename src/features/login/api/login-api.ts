import { apiClient } from '@/shared/api/api-instance';

interface LoginKakaoRequest {
  code: string
}

interface LoginKakaoResponse {
  accessToken: string
  refreshToken: string
}

export function loginApi(body: LoginKakaoRequest) : Promise<LoginKakaoResponse> {
  console.log('loginApi')
  return apiClient<LoginKakaoResponse>("/api/v1/auth/kakao", {
    method: "POST",
    body: JSON.stringify(body)
  })
}