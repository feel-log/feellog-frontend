"use client";

import { useMutation } from '@tanstack/react-query';
import { loginApi } from '@/features/login';
import { useKakaoToken } from '@/shared/store';
import { useRouter } from 'next/navigation';

export function useLoginKakao() {
  const { setTokens } = useKakaoToken();
  const router = useRouter();

  return useMutation({
    mutationFn: (accessToken: string) => loginApi({
      accessToken,
    }),
    onSuccess: (data) => {
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      })
      router.push('/')
    },
    onError: (error) => {
      console.error("카카오 로그인 실패", error);
    }
  })
}