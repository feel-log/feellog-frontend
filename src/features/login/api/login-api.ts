import { apiClient } from '@/shared/api/api-instance';
import { logAuthDebug, logAuthError, summarizeTokens } from '@/shared/utils/auth-debug';

export interface LoginRequest {
  accessToken: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

function ensureValidLoginResponse(provider: string, response: LoginResponse): LoginResponse {
  logAuthDebug(`${provider} login response received`, summarizeTokens(response));

  if (!response?.accessToken || !response?.refreshToken) {
    const error = new Error('Login response does not contain both tokens');
    logAuthError(`${provider} login response validation failed`, error);
    throw error;
  }

  return response;
}

export async function loginKakaoApi(body: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>("/api/v1/auth/kakao", {
    method: "POST",
    body: JSON.stringify(body)
  });

  return ensureValidLoginResponse('kakao', response);
}

export async function loginGoogleApi(body: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>("/api/v1/auth/google", {
    method: "POST",
    body: JSON.stringify(body)
  });

  return ensureValidLoginResponse('google', response);
}

export async function loginGuestApi(): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>("/api/v1/auth/guest", {
    method: "POST"
  });

  return ensureValidLoginResponse('guest', response);
}
