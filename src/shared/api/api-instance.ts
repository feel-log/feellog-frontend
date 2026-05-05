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

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
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

  let data: T;
  const contentType = res.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    try {
      data = await res.json();
    } catch (e) {
      throw new APIError(res.status, `Failed to parse JSON response: ${e}`);
    }
  } else {
    data = {} as T;
  }

  if (!res.ok) {
    throw new APIError(res.status, `API Error: ${res.status}`);
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
    // 401 Unauthorized or 403 Forbidden - try to refresh token
    // (403 can occur when token is expired)
    if (error?.status === 401 || error?.status === 403) {
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