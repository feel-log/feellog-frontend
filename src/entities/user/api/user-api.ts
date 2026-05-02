// 서버 컴포넌트용 Fetch

import { apiClient } from '@/shared/api/api-instance';
import { User } from '@/entities/user/model/user-schema';

export function getUserByTokenApi(token: string): Promise<User> {
  return apiClient<User>("/api/v1/users/me", {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}