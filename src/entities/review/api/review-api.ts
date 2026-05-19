import { apiClient } from '@/shared/api/api-instance';
import {
  ReviewMonthlyResponse,
  ReviewOptions,
  ReviewResponse,
  ReviewUpsertRequest,
} from '@/entities/review/model/review-schema';

export function getReviewOptionsApi(token: string): Promise<ReviewOptions> {
  return apiClient<ReviewOptions>('/api/v1/reviews/options', {
    method: 'GET',
  });
}

export function getReviewByDateApi({
  reviewDate,
  token,
}: {
  reviewDate: string;
  token: string;
}): Promise<ReviewResponse> {
  return apiClient<ReviewResponse>(`/api/v1/reviews/${reviewDate}`, {
    method: 'GET',
  });
}

export function getReviewMonthlyApi({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<ReviewMonthlyResponse> {
  return apiClient<ReviewMonthlyResponse>(
    `/api/v1/reviews/monthly?year=${year}&month=${month}`,
    { method: 'GET' }
  );
}

export function upsertReviewApi({
  reviewDate,
  body,
  token,
}: {
  reviewDate: string;
  body: ReviewUpsertRequest;
  token: string;
}): Promise<ReviewResponse> {
  return apiClient<ReviewResponse>(`/api/v1/reviews/${reviewDate}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}
