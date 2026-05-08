import { apiClient } from '@/shared/api/api-instance';

export interface UpdateIncomeRequest {
  amount: number;
  incomeCategoryId: number;
  incomeDate: string;
  memo?: string;
}

export function updateIncomeApi(incomeId: number, body: UpdateIncomeRequest) {
  return apiClient<void>(`/api/v1/incomes/${incomeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
