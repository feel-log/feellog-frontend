import { deleteExpenseApi } from '@/features/delete-expense/api/delete-expense-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseQueries } from '@/entities/expense';

export function useDeleteExpense(year: number, month: number, day: number) {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, unknown, number>({
    mutationFn: (expenseId: number) => deleteExpenseApi(expenseId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ['daily-expend', year, month, day],
        }),
        queryClient.invalidateQueries({
          queryKey: expenseQueries.monthly('', year, month).queryKey,
        }),
      ]);
    },
    onError: (error: unknown) => {
      console.error('삭제 실패:', error);
    },
  });

  return mutation;
}
