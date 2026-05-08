import { apiClient } from '@/shared/api/api-instance';

export function deleteIncomeApi(incomeId: number) {
  return apiClient<void>(`/api/v1/incomes/${incomeId}`, { method: 'DELETE' });
}
