"use client";

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userQueries } from '@/entities/user/api/user-queries';
import { useUser } from '@/shared/store';

export const useUserGetter = (accessToken: string | null) => {
  const { setUser } = useUser();

  const query = useQuery({
    ...userQueries.userByToken(accessToken || ''),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data);
    }
  }, [query.isSuccess, query.data, setUser]);

  return query;
};
