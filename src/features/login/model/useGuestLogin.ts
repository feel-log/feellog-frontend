"use client";

import { useToken } from '@/shared/store';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { loginGuestApi } from '@/features/login';

export function useGuestLogin() {
  const { setTokens } = useToken();
  const router = useRouter();

  return useMutation({
    mutationFn: () =>
      loginGuestApi(),
    onSuccess: (data) => {
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      router.push('/');
    },
    onError: (error) => {
      console.error('구글 로그인 실패', error);
    },
  });
}