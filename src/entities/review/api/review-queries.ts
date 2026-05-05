import { queryOptions } from '@tanstack/react-query';
import {
  getReviewByDateApi,
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
};
