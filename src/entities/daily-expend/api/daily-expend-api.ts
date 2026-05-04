import { apiClient } from '@/shared/api/api-instance';
import { DailyExpendType } from '@/entities/daily-expend/model/daily-expend-type';

export function dailyExpendApi(year: number, month: number, day: number) {
  return apiClient<DailyExpendType[]>(
    `/api/v1/expenses/daily?year=${year}&month=${month}&day=${day}`,
    { method: 'GET' }
  );
}
