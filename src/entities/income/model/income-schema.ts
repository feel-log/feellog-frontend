import { z } from 'zod';

export const IncomeSchema = z.object({
  userId: z.number(),
  amount: z.number(),
  incomeCategoryId: z.number(),
  incomeDate: z.string(),
  memo: z.string().nullable(),
});

export type Income = z.infer<typeof IncomeSchema>;
