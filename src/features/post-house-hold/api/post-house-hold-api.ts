"use client";

import { apiClient } from '@/shared/api/api-instance';

export interface HouseHoldPostRequest {
  userId: number
  categoryId: number | null;
  paymentMethodId: number | null;
  amount: number;
  memo: string;
  merchantId: number;
  expenseDate: string;
  expenseTime: string;
  emotionIds: number[],
  situationTagIds: number[]
}

export function postHouseHoldApi(houseHoldPostRequest: HouseHoldPostRequest) {
  return apiClient<void>("/api/v1/expenses", {
    method: 'POST',
    body: JSON.stringify(houseHoldPostRequest),
  })
}