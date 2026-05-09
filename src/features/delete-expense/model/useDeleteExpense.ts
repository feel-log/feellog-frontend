import { deleteExpenseApi } from '@/features/delete-expense/api/delete-expense-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteExpense(_year: number, _month: number, _day: number) {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, unknown, number>({
    mutationFn: (expenseId: number) => deleteExpenseApi(expenseId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ refetchType: 'all' });
    },
    onError: (error: unknown) => {
      console.error('삭제 실패:', error);
    },
  });

  return mutation;
}
