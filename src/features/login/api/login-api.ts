import { apiClient } from '@/shared/api/api-instance';

interface LoginRequest {
  accessToken: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

export function loginKakaoApi(body: LoginRequest) : Promise<LoginResponse> {
  return apiClient<LoginResponse>("/api/v1/auth/kakao", {
    method: "POST",
    body: JSON.stringify(body)
  })
}

export function loginGoogleApi(body: LoginRequest): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/api/v1/auth/google", {
    method: "POST",
    body: JSON.stringify(body)
  })
}

export function loginGuestApi(): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/api/v1/auth/guest", {
    method: "POST"
  });
}