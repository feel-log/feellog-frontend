// shared/api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1분간 fresh 유지
      gcTime: 1000 * 60 * 5, // 5분간 캐시 유지 (구 cacheTime)
      retry: 1, // 실패 시 1번 재시도
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0, // mutation은 재시도 안 함
    },
  },
});
