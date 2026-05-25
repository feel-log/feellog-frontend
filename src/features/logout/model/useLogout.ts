"use client";

import { useToken, useUser } from '@/shared/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutApi } from '@/features/logout';
import { deleteDeviceTokenApi } from '@/features/post-device-token';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
    onError: () => {
      toast.error('로그아웃에 실패했어요. 잠시 후 다시 시도해주세요.');
    },
  });
}