// 공통 Fetch Wrapper 설정

import { ApiError } from 'next/dist/server/api-utils';

const BASE_URL = process.env.API_BASE_URL;

export async function apiClient<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    }
  });

  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }

  return await res.json();
}