import { todayExpendApi } from '@/entities/today-expenditure/api/today-expend-api';
import { queryOptions } from '@tanstack/react-query';

export const todayExpendQueries = {
  all: ["today-expend"],
  getTodayQueries: (year: number, month: number) => queryOptions({
    queryKey: [...todayExpendQueries.all, year, month],
    queryFn: () => todayExpendApi(year, month),
    staleTime: 1000 * 60
  })
}