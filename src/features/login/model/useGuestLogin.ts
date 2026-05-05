"use client";

import { useToken } from '@/shared/store';
import { useUser } from '@/shared/store';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { loginGuestApi } from '@/features/login';
import { getUserByTokenApi } from '@/entities/user/api/user-api';

export function useGuestLogin() {
  const { setTokens, setErrorBox } = useToken();
  const { setUser } = useUser();
  const router = useRouter();

  return useMutation({
    mutationFn: () =>
      loginGuestApi(),
    onSuccess: async (data) => {
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      try {
        const user = await getUserByTokenApi(data.accessToken);
        setUser(user);
      } catch (error) {
        console.error('사용자 정보 조회 실패', error);
      }

      router.push('/');
    },
    onError: (error) => {
      console.error('게스트 로그인 실패', error);
      setErrorBox(true);
    },
  });
}