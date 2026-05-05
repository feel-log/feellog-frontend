import { apiClient } from '@/shared/api/api-instance';
import { MonthlyExpendType } from '@/entities/today-expenditure/model/monthly-expend-type';

export function todayExpendApi(year: number, month: number) {
  return apiClient<MonthlyExpendType[]>(`/api/v1/expenses/monthly?year=${year}&month=${month}`, {
    method: 'GET',
  })
}