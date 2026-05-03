"use client";

import { useToken, useUser } from '@/shared/store';
import { useMutation } from '@tanstack/react-query';
import { logoutApi } from '@/features/logout';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const { clearTokens } = useToken();
  const { clearUser } = useUser();
  const router = useRouter();

  return useMutation({
    mutationFn: (accessToken: string) =>
      logoutApi(accessToken),
    onSuccess: () => {
      console.log('logout success');
      clearTokens();
      clearUser();
      router.push('/login');
    },
    onError: (error) => {
      console.error("로그아웃 실패");
    }

  })

}