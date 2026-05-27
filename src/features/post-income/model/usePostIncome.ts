import { PostIncomeRequest, postIncomeApi } from '@/features/post-income/api/post-income-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
    onError: () => {
      toast.error('수입 저장에 실패했어요. 잠시 후 다시 시도해주세요.');
    },
  });

  return mutation;
}
