import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateIncomeApi,
  type UpdateIncomeRequest,
} from '@/features/update-income/api/update-income-api';

interface UpdateIncomeArgs {
  incomeId: number;
  body: UpdateIncomeRequest;
  year: number;
  month: number;
}

export function useUpdateIncome() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, UpdateIncomeArgs>({
    mutationFn: ({ incomeId, body }) => updateIncomeApi(incomeId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ refetchType: 'all' });
    },
    onError: (error: unknown) => {
      console.error('수입 수정 실패:', error);
    },
  });
}
