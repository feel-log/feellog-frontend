import { queryOptions } from '@tanstack/react-query';
import {
  getReviewByDateApi,
  getReviewMonthlyApi,
  getReviewOptionsApi,
} from '@/entities/review/api/review-api';

export const reviewQueries = {
  all: () => ['review'] as const,
  options: (token: string) =>
    queryOptions({
      queryKey: [...reviewQueries.all(), 'options'],
      queryFn: () => getReviewOptionsApi(token),
      staleTime: 1000 * 60 * 60,
    }),
  byDate: (token: string, reviewDate: string) =>
    queryOptions({
      queryKey: [...reviewQueries.all(), 'date', reviewDate],
      queryFn: () => getReviewByDateApi({ reviewDate, token }),
      staleTime: 1000 * 60,
    }),
  monthly: (token: string, year: number, month: number) =>
    queryOptions({
      queryKey: [...reviewQueries.all(), 'monthly', token, year, month],
      queryFn: () => getReviewMonthlyApi({ year, month, token }),
      staleTime: 1000 * 60,
    }),
};
