import { useQuery } from '@tanstack/react-query';
import { dailyExpendQueries } from '@/entities/daily-expend/api/daily-expend-queries';

export function useDailyExpend(year: number, month: number, day: number) {
  return useQuery({
    ...dailyExpendQueries.getDailyQueries(year, month, day),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
