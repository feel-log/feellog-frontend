export interface DailyExpendType {
  expenseId: number;
  categoryId: number;
  categoryGroupId: number;
  paymentMethodId: number;
  amount: number;
  memo: string;
  merchantName: string;
  expenseDate: string;
  expenseTime: string;
  emotionIds: number[];
  situationTagIds: number[];
}
