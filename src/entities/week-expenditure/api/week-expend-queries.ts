import { queryOptions } from '@tanstack/react-query';
import { weekExpendApi } from '@/entities/week-expenditure/api/week-expend-api';

export const weekExpendQueries = {
  all: ["week_expend_queries"],
  getWeekExpendQuery: (token: string) => queryOptions({
    queryKey: [...weekExpendQueries.all, token],
    queryFn: () => weekExpendApi(token)
  })
}