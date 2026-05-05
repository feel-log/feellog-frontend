import { queryOptions } from '@tanstack/react-query';
import {
  CategoryDetailSort,
  getCategoryDetailApi,
  getDailyReportApi,
  getEmotionDetailApi,
  getMonthlyExpenseDetailApi,
  getMonthlyReportApi,
} from '@/entities/report/api/report-api';

export const reportQueries = {
  all: () => ['report'] as const,
  monthly: (token: string, year: number, month: number) =>
    queryOptions({
      queryKey: [...reportQueries.all(), 'monthly', year, month],
      queryFn: () => getMonthlyReportApi({ year, month, token }),
      staleTime: 1000 * 60,
    }),
  categoryDetail: (
    token: string,
    categoryId: number,
    year: number,
    month: number,
    sort: CategoryDetailSort = 'LATEST',
  ) =>
    queryOptions({
      queryKey: [
        ...reportQueries.all(),
        'categories',
        categoryId,
        year,
        month,
        sort,
      ],
      queryFn: () =>
        getCategoryDetailApi({ categoryId, year, month, token, sort }),
      staleTime: 1000 * 60,
    }),
  emotionDetail: (
    token: string,
    emotionId: number,
    year: number,
    month: number,
    sort: CategoryDetailSort = 'LATEST',
  ) =>
    queryOptions({
      queryKey: [
        ...reportQueries.all(),
        'emotions',
        emotionId,
        year,
        month,
        sort,
      ],
      queryFn: () =>
        getEmotionDetailApi({ emotionId, year, month, token, sort }),
      staleTime: 1000 * 60,
    }),
  monthlyExpenseDetail: (
    token: string,
    year: number,
    month: number,
    sort: CategoryDetailSort = 'LATEST',
  ) =>
    queryOptions({
      queryKey: [
        ...reportQueries.all(),
        'monthly-expenses',
        year,
        month,
        sort,
      ],
      queryFn: () =>
        getMonthlyExpenseDetailApi({ year, month, token, sort }),
      staleTime: 1000 * 60,
    }),
  daily: (token: string) =>
    queryOptions({
      queryKey: [...reportQueries.all(), 'daily'],
      queryFn: () => getDailyReportApi(token),
      staleTime: 1000 * 30,
    }),
};
