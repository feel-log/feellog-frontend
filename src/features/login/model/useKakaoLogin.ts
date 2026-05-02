"use client";

import { useMutation } from '@tanstack/react-query';
import { loginKakaoApi } from '@/features/login/api/login-api';
import { useToken } from '@/shared/store';
import { useRouter } from 'next/navigation';


export function useKakaoLogin() {
  const { setTokens } = useToken();
  const router = useRouter();

  return useMutation({
    mutationFn: (accessToken: string) => loginKakaoApi({
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