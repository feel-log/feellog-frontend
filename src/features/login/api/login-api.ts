import { apiClient } from '@/shared/api/api-instance';

export interface LoginRequest {
  accessToken: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

function ensureValidLoginResponse(response: LoginResponse): LoginResponse {
  if (!response?.accessToken || !response?.refreshToken) {
    throw new Error('Login response does not contain both tokens');
  }

  return response;
}

export async function loginKakaoApi(body: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>("/api/v1/auth/kakao", {
    method: "POST",
    body: JSON.stringify(body)
  });

  return ensureValidLoginResponse(response);
}

export async function loginGoogleApi(body: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>("/api/v1/auth/google", {
    method: "POST",
    body: JSON.stringify(body)
  });

  return ensureValidLoginResponse(response);
}

export async function loginGuestApi(): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>("/api/v1/auth/guest", {
    method: "POST"
  });

  return ensureValidLoginResponse(response);
}
