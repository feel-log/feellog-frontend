import { todayExpendApi } from '@/entities/today-expenditure/api/today-expend-api';
import { queryOptions } from '@tanstack/react-query';

export const todayExpendQueries = {
  all: ["today_expend_queries"],
  getTodayQueries: (token: string, year: number, month: number) => queryOptions({
    queryKey: [...todayExpendQueries.all, "token"],
    queryFn: () => todayExpendApi(token, year, month),
    staleTime: 1000 * 60
  })
}