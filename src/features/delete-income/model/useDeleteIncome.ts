import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteIncomeApi } from '@/features/delete-income/api/delete-income-api';
import { incomeQueries } from '@/entities/income';

export function useDeleteIncome(year: number, month: number) {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, number>({
    mutationFn: (incomeId: number) => deleteIncomeApi(incomeId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: incomeQueries.monthly('', year, month).queryKey,
      });
    },
    onError: (error: unknown) => {
      console.error('수입 삭제 실패:', error);
    },
  });
}
