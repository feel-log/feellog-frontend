"use client";

import { useToken } from '@/shared/store';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { loginGoogleApi } from '@/features/login/api/login-api';

export function useGoogleLogin() {
  const { setTokens } = useToken();
  const router = useRouter();

  return useMutation({
    mutationFn: (accessToken: string) =>
      loginGoogleApi({
        accessToken,
      }),
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