import { dailyExpendApi } from '@/entities/daily-expend/api/daily-expend-api';
import { queryOptions } from '@tanstack/react-query';

export const dailyExpendQueries = {
  all: ['daily-expend'],
  getDailyQueries: (year: number, month: number, day: number) =>
    queryOptions({
      queryKey: [...dailyExpendQueries.all, year, month, day],
      queryFn: () => dailyExpendApi(year, month, day),
    }),
};
