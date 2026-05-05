import { useMutation } from '@tanstack/react-query';
import { refreshApi } from '@/features/refresh/api/refresh-api';
import { useToken } from '@/shared/store';
import { useRouter } from 'next/navigation';

export function useRefreshToken() {
  const { setTokens, clearTokens } = useToken();
  const router = useRouter();

  return useMutation({
    mutationFn: (refreshToken: string) => refreshApi(refreshToken),
    onSuccess: (data) => {
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      })
    },
    onError: (error) => {
      console.error("리프레시 토큰이 없거나 손상되었습니다.");
      clearTokens();
      router.push('/login');
    }
  })
}