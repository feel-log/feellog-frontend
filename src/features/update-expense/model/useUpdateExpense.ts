import {
  UpdateExpenseRequest,
  updateExpenseApi,
} from '@/features/update-expense/api/update-expense-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface UseUpdateExpenseParams {
  expenseId: number;
  request: UpdateExpenseRequest;
}

export function useUpdateExpense() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<void, unknown, UseUpdateExpenseParams>({
    mutationFn: async ({ expenseId, request }) => updateExpenseApi(expenseId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['daily-expend'] });
      router.push('/');
    },
    onError: (error: unknown) => {
      console.error('수정 실패:', error);
    },
  });

  return mutation;
}
