import { queryOptions } from '@tanstack/react-query';
import { getMonthlyIncomesApi } from '@/entities/income/api/income-api';

export const incomeQueries = {
  all: () => ['income'] as const,
  monthly: (token: string, year: number, month: number) =>
    queryOptions({
      queryKey: [...incomeQueries.all(), 'monthly', year, month],
      queryFn: () => getMonthlyIncomesApi({ year, month, token }),
      staleTime: 1000 * 60,
    }),
};
