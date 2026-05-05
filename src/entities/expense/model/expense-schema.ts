import { z } from 'zod';

export const ExpenseSchema = z.object({
  expenseId: z.number(),
  categoryId: z.number(),
  categoryGroupId: z.number(),
  paymentMethodId: z.number(),
  amount: z.number(),
  memo: z.string().nullable(),
  merchantName: z.string().nullable(),
  expenseDate: z.string(),
  expenseTime: z.string(),
  emotionIds: z.array(z.number()),
  situationTagIds: z.array(z.number()),
});

export type Expense = z.infer<typeof ExpenseSchema>;
