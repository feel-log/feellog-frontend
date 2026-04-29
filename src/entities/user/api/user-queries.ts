// 클라이언트용 QueryOption

import { queryOptions } from '@tanstack/react-query';
import { getUserByToken } from '@/entities/user/api/user-api';

export const userQueries = {
  all: () => ["user"] as const,
  userByToken: (token: string) =>
    queryOptions({
      queryKey: [...userQueries.all(), "token"],
      queryFn: () => getUserByToken(token),
      staleTime: 1000 * 60
    })
}