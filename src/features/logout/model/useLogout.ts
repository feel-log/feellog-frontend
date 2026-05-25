"use client";

import { useToken, useUser } from '@/shared/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutApi } from '@/features/logout';
import { unregisterDeviceToken } from '@/features/post-device-token';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useLogout() {
  const { clearTokens } = useToken();
  const { clearUser } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (accessToken: string) => {
      await unregisterDeviceToken();
      await logoutApi(accessToken);
    },
    onSuccess: async () => {
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