'use client';

import { apiClient } from '@/shared/api/api-instance';

export interface PostIncomeRequest {
  userId: number;
  amount: number;
  incomeCategoryId: number;
  incomeDate: string;
  memo: string;
}

export function postIncomeApi(request: PostIncomeRequest) {
  return apiClient<void>('/api/v1/incomes', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
