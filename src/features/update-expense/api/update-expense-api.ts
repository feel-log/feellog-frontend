import { apiClient } from '@/shared/api/api-instance';

export interface UpdateExpenseRequest {
  userId: number;
  categoryId: number | null;
  paymentMethodId: number | null;
  amount: number;
  memo: string;
  merchantName: string;
  expenseDate: string;
  expenseTime: string;
  emotionIds: number[];
  situationTagIds: number[];
}

export function updateExpenseApi(expenseId: number, body: UpdateExpenseRequest) {
  return apiClient<void>(`/api/v1/expenses/${expenseId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}
