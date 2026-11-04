const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

export async function logoutApi(accessToken: string) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res;
}