import { apiClient } from '@/shared/api/api-instance';
import {
  CategoryDetail,
  EmotionDetail,
  MonthlyExpenseDetail,
  MonthlyReport,
} from '@/entities/report/model/report-schema';

interface MonthlyReportParams {
  year: number;
  month: number;
  token: string;
}

export function getMonthlyReportApi({
  year,
  month,
  token,
}: MonthlyReportParams): Promise<MonthlyReport> {
  return apiClient<MonthlyReport>(
    `/api/v1/reports/monthly?year=${year}&month=${month}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export type CategoryDetailSort =
  | 'LATEST'
  | 'OLDEST'
  | 'AMOUNT_DESC'
  | 'AMOUNT_ASC';

interface CategoryDetailParams {
  categoryId: number;
  year: number;
  month: number;
  token: string;
  sort?: CategoryDetailSort;
  page?: number;
  size?: number;
}

export function getCategoryDetailApi({
  categoryId,
  year,
  month,
  token,
  sort = 'LATEST',
  page = 1,
  size = 100,
}: CategoryDetailParams): Promise<CategoryDetail> {
  const query = new URLSearchParams({
    year: String(year),
    month: String(month),
    sort,
    page: String(page),
    size: String(size),
  });
  return apiClient<CategoryDetail>(
    `/api/v1/reports/categories/${categoryId}/expenses?${query}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

interface EmotionDetailParams {
  emotionId: number;
  year: number;
  month: number;
  token: string;
  sort?: CategoryDetailSort;
  page?: number;
  size?: number;
}

export function getEmotionDetailApi({
  emotionId,
  year,
  month,
  token,
  sort = 'LATEST',
  page = 1,
  size = 100,
}: EmotionDetailParams): Promise<EmotionDetail> {
  const query = new URLSearchParams({
    year: String(year),
    month: String(month),
    sort,
    page: String(page),
    size: String(size),
  });
  return apiClient<EmotionDetail>(
    `/api/v1/reports/emotions/${emotionId}/expenses?${query}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

interface MonthlyExpenseDetailParams {
  year: number;
  month: number;
  token: string;
  sort?: CategoryDetailSort;
  page?: number;
  size?: number;
}

export function getMonthlyExpenseDetailApi({
  year,
  month,
  token,
  sort = 'LATEST',
  page = 1,
  size = 100,
}: MonthlyExpenseDetailParams): Promise<MonthlyExpenseDetail> {
  const query = new URLSearchParams({
    year: String(year),
    month: String(month),
    sort,
    page: String(page),
    size: String(size),
  });
  return apiClient<MonthlyExpenseDetail>(
    `/api/v1/reports/monthly/expenses?${query}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
