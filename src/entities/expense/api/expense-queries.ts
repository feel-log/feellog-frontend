import { queryOptions } from '@tanstack/react-query';
import {
  getDailyExpensesApi,
  getMonthlyExpensesApi,
} from '@/entities/expense/api/expense-api';

export const expenseQueries = {
  all: () => ['expense'] as const,
  monthly: (token: string, year: number, month: number) =>
    queryOptions({
      queryKey: [...expenseQueries.all(), 'monthly', year, month],
      queryFn: () => getMonthlyExpensesApi({ year, month, token }),
      staleTime: 1000 * 60,
    }),
  daily: (token: string, year: number, month: number, day: number) =>
    queryOptions({
      queryKey: [...expenseQueries.all(), 'daily', year, month, day],
      queryFn: () => getDailyExpensesApi({ year, month, day, token }),
      staleTime: 1000 * 60,
    }),
};
