// shared/api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

const isClientSide = typeof window !== 'undefined';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retry: (failureCount, error: any) => {
        // 401은 이미 apiClient에서 처리되므로 retry하지 않음
        // 다른 에러는 최대 2번까지 재시도
        if (error?.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

if (isClientSide) {
  // 404, 500 등 다른 에러 처리
  queryClient.setDefaultOptions({
    queries: {
      throwOnError: true,
    },
  });
}
