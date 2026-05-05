import { apiClient } from '@/shared/api/api-instance';
import { WeekExpendType } from '@/entities/week-expenditure/model/week-expend-type';

export function weekExpendApi(accessToken: string) {
  return apiClient<WeekExpendType>("/api/v1/reports/weekly", {
    method: 'GET',
  })
}