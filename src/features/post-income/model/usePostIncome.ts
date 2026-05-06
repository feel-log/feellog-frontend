import { PostIncomeRequest, postIncomeApi } from '@/features/post-income/api/post-income-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function usePostIncome() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<void, unknown, PostIncomeRequest>({
    mutationFn: async (request) => postIncomeApi(request),
    onSuccess: async (_, request) => {
      const year = request.incomeDate.split('-')[0];
      const month = request.incomeDate.split('-')[1];

      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ['today-expend', Number(year), Number(month)],
        }),
        queryClient.refetchQueries({
          queryKey: ['week_expend_queries'],
        }),
      ]);

      router.push('/');
    },
    onError: (error: unknown) => {
      console.error('수입 추가 실패');
      console.log(error);
    },
  });

  return mutation;
}
