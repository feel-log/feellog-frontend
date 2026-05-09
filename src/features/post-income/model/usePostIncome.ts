import { PostIncomeRequest, postIncomeApi } from '@/features/post-income/api/post-income-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function usePostIncome() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<void, unknown, PostIncomeRequest>({
    mutationFn: async (request) => postIncomeApi(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ refetchType: 'all' });
      router.push('/');
      router.refresh();
    },
    onError: (error: unknown) => {
      console.error('수입 추가 실패');
      console.log(error);
    },
  });

  return mutation;
}
