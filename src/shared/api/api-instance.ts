import { useToken } from '@/shared/store/token-store';
import { refreshApi } from '@/features/refresh/api/refresh-api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    const tokenStore = useToken.getState();
    const refreshToken = tokenStore.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    try {
      const response = await refreshApi(refreshToken);
      tokenStore.setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      return response.accessToken;
    } catch (error) {
      tokenStore.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Token refresh failed');
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function performRequest<T>(
  endpoint: string,
  options?: RequestInit,
  accessToken?: string | null
): Promise<{ data: T; status: number }> {
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options?.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return { data, status: res.status };
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const tokenStore = useToken.getState();
  let accessToken = tokenStore.getAccessToken();

  try {
    const result = await performRequest<T>(endpoint, options, accessToken);
    return result.data;
  } catch (error: any) {
    if (error.message.includes('401') || error.message.includes('403')) {
      try {
        accessToken = await refreshAccessToken();
        const result = await performRequest<T>(endpoint, options, accessToken);
        return result.data;
      } catch (refreshError) {
        throw new Error('Session expired');
      }
    }
    throw error;
  }
}