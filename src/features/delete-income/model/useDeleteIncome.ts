import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteIncomeApi } from '@/features/delete-income/api/delete-income-api';

export function useDeleteIncome(_year: number, _month: number) {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, number>({
    mutationFn: (incomeId: number) => deleteIncomeApi(incomeId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ refetchType: 'all' });
    },
    onError: (error: unknown) => {
      console.error('수입 삭제 실패:', error);
    },
  });
}
