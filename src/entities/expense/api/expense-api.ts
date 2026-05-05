import { apiClient } from '@/shared/api/api-instance';
import { Expense } from '@/entities/expense/model/expense-schema';

export function getMonthlyExpensesApi({
  year,
  month,
  token,
}: {
  year: number;
  month: number;
  token: string;
}): Promise<Expense[]> {
  return apiClient<Expense[]>(
    `/api/v1/expenses/monthly?year=${year}&month=${month}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}

export function getDailyExpensesApi({
  year,
  month,
  day,
  token,
}: {
  year: number;
  month: number;
  day: number;
  token: string;
}): Promise<Expense[]> {
  return apiClient<Expense[]>(
    `/api/v1/expenses/daily?year=${year}&month=${month}&day=${day}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}
