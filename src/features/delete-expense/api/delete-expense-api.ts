import { apiClient } from '@/shared/api/api-instance';

export function deleteExpenseApi(expenseId: number) {
  return apiClient<void>(`/api/v1/expenses/${expenseId}`, { method: 'DELETE' });
}
