import { apiClient } from '@/shared/api/api-instance';
import { Income } from '@/entities/income/model/income-schema';

export function getMonthlyIncomesApi({
  year,
  month,
  token,
}: {
  year: number;
  month: number;
  token: string;
}): Promise<Income[]> {
  return apiClient<Income[]>(
    `/api/v1/incomes/monthly?year=${year}&month=${month}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}
