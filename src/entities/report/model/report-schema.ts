import { z } from 'zod';

const PeriodSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

const SummarySchema = z.object({
  totalIncome: z.number(),
  totalExpense: z.number(),
});

const CommentSchema = z.object({
  type: z.string(),
  targetName: z.string().nullable(),
  message: z.string(),
});

const CommentsSchema = z.object({
  categoryChange: CommentSchema,
  emotionTrend: CommentSchema,
  situationTrend: CommentSchema,
});

const CategoryItemSchema = z.object({
  categoryId: z.number(),
  categoryName: z.string(),
  categoryGroupName: z.string(),
  totalAmount: z.number(),
  shareRate: z.number(),
  shareRateDisplay: z.number(),
  rank: z.number(),
});

const EmotionItemSchema = z.object({
  emotionId: z.number(),
  emotionName: z.string(),
  emotionGroupName: z.string(),
  linkedAmount: z.number(),
  emotionCount: z.number(),
  rank: z.number(),
});

const SituationItemSchema = z.object({
  situationTagId: z.number(),
  situationName: z.string(),
  occurrenceCount: z.number(),
  rank: z.number(),
});

export const MonthlyReportSchema = z.object({
  period: PeriodSchema,
  summary: SummarySchema,
  comments: CommentsSchema,
  categories: z.object({ list: z.array(CategoryItemSchema) }),
  emotions: z.object({ list: z.array(EmotionItemSchema) }),
  situations: z.object({ list: z.array(SituationItemSchema) }),
});

const ExpenseSituationTagSchema = z.object({
  situationTagId: z.number(),
  situationName: z.string(),
});

const ExpenseEmotionSchema = z.object({
  emotionId: z.number(),
  emotionName: z.string(),
});

const CategoryExpenseSchema = z.object({
  expenseId: z.number(),
  date: z.string(),
  categoryName: z.string().optional(),
  memo: z.string().nullable(),
  amount: z.number(),
  paymentMethod: z.string(),
  emotions: z.array(ExpenseEmotionSchema).optional(),
  situationTags: z.array(ExpenseSituationTagSchema),
});

const DailyLogSchema = z.object({
  date: z.string(),
  expenses: z.array(CategoryExpenseSchema),
});

export const CategoryDetailSchema = z.object({
  category: z.object({
    categoryId: z.number(),
    categoryName: z.string(),
  }),
  period: PeriodSchema,
  totalAmount: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  dailyLogs: z.array(DailyLogSchema),
  expenses: z.array(CategoryExpenseSchema).nullable(),
});

export const EmotionDetailSchema = z.object({
  emotion: z.object({
    emotionId: z.number(),
    emotionName: z.string(),
  }),
  period: PeriodSchema,
  totalAmount: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  dailyLogs: z.array(DailyLogSchema),
  expenses: z.array(CategoryExpenseSchema).nullable(),
});

const MonthlyExpenseItemSchema = CategoryExpenseSchema.extend({
  dayOfWeek: z.string().optional(),
});

const MonthlyExpenseDailyLogSchema = z.object({
  date: z.string(),
  expenses: z.array(MonthlyExpenseItemSchema),
});

export const MonthlyExpenseDetailSchema = z.object({
  period: PeriodSchema,
  totalAmount: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  dailyLogs: z.array(MonthlyExpenseDailyLogSchema),
  expenses: z.array(MonthlyExpenseItemSchema).nullable(),
});

const DailyPeriodSchema = z.object({
  date: z.string(),
  dayOfWeek: z.string(),
});

const DailySummarySchema = z.object({
  totalExpenseAmount: z.number(),
});

const DailyTopCategorySchema = z.object({
  label: z.string(),
  amount: z.number(),
});

const DailyExpenseGraphSchema = z.object({
  displayType: z.string(),
  mainMessage: z.string(),
  subMessage: z.string(),
  topRatio: z.number(),
  topCategories: z.array(DailyTopCategorySchema),
  secondCategory: DailyTopCategorySchema.nullable(),
  extraCount: z.number(),
});

const DailyEmotionItemSchema = z.object({
  emotionId: z.number(),
  emotionName: z.string(),
  emotionCount: z.number(),
  rank: z.number(),
});

export const DailyReportSchema = z.object({
  period: DailyPeriodSchema,
  summary: DailySummarySchema,
  expenseGraph: DailyExpenseGraphSchema,
  emotions: z.object({
    list: z.array(DailyEmotionItemSchema),
    isEmpty: z.boolean(),
  }),
});

export type MonthlyReport = z.infer<typeof MonthlyReportSchema>;
export type ReportComment = z.infer<typeof CommentSchema>;
export type ReportCategoryItem = z.infer<typeof CategoryItemSchema>;
export type ReportEmotionItem = z.infer<typeof EmotionItemSchema>;
export type ReportSituationItem = z.infer<typeof SituationItemSchema>;
export type CategoryDetail = z.infer<typeof CategoryDetailSchema>;
export type CategoryExpense = z.infer<typeof CategoryExpenseSchema>;
export type CategoryDailyLog = z.infer<typeof DailyLogSchema>;
export type EmotionDetail = z.infer<typeof EmotionDetailSchema>;
export type MonthlyExpenseDetail = z.infer<typeof MonthlyExpenseDetailSchema>;
export type MonthlyExpenseItem = z.infer<typeof MonthlyExpenseItemSchema>;
export type DailyReport = z.infer<typeof DailyReportSchema>;
export type DailyEmotionItem = z.infer<typeof DailyEmotionItemSchema>;
