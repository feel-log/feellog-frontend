// 서버 컴포넌트용 Fetch

import { apiClient } from '@/shared/api/api-instance';
import { User, UserSchema } from '@/entities/user/model/user-schema';

export function getUserByToken(token?: string) {
  const data = apiClient<User>("/api/v1/users/me", {
    next: { revalidate: 60 }, // ISR
    cache: "force-cache", // SSG
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  });
  const parsed = UserSchema.safeParse(data);

  if(!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Invalide user Data from API")
  }

  return parsed.data
}