// shared/api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

const isClientSide = typeof window !== 'undefined';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
      retry: (failureCount, error: any) => {
        if (error?.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: 'always',
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
