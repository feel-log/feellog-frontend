// fetch wrapper

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    }
  });

  if(!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}