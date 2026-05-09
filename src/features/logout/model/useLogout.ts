"use client";

import { useToken, useUser } from '@/shared/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutApi } from '@/features/logout';
import { deleteDeviceTokenApi } from '@/features/post-device-token';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const { clearTokens } = useToken();
  const { clearUser } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (accessToken: string) => {
      await logoutApi(accessToken);
    },
    onSuccess: async () => {
      console.log('logout success');

      const token = localStorage.getItem('fcmToken');
      if (token) {
        try {
          await deleteDeviceTokenApi(token);
        } catch (error) {
          console.error('Failed to delete device token:', error);
        }
      }

      clearTokens();
      clearUser();
      queryClient.clear();
      router.push('/login');
    },
    onError: (error) => {
      console.error('로그아웃 실패');
    },
  });
}