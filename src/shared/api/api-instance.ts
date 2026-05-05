import { useToken } from '@/shared/store/token-store';
import { refreshApi } from '@/features/refresh/api/refresh-api';

// fetch wrapper

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

async function retryRequest<T>(
  endpoint: string,
  options?: RequestInit,
  accessToken?: string
): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options?.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

async function handleTokenRefresh<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingQueue.push(async (newToken: string) => {
        try {
          const result = await retryRequest<T>(endpoint, options, newToken);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  isRefreshing = true;
  const tokenStore = useToken.getState();
  const refreshToken = tokenStore.getRefreshToken();

  try {
    if (!refreshToken) throw new Error('No refresh token');

    const response = await refreshApi(refreshToken);
    tokenStore.setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken
    });

    // 대기 중인 요청 재시도
    const queue = pendingQueue;
    pendingQueue = [];
    for (const callback of queue) {
      await callback(response.accessToken);
    }

    return retryRequest<T>(endpoint, options, response.accessToken);
  } catch (error) {
    tokenStore.clearTokens();
    window.location.href = '/login';
    throw new Error('Session expired');
  } finally {
    isRefreshing = false;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const tokenStore = useToken.getState();
  const accessToken = tokenStore.getAccessToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    return handleTokenRefresh<T>(endpoint, options);
  }

  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}