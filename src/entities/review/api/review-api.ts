import { apiClient } from '@/shared/api/api-instance';
import {
  ReviewOptions,
  ReviewResponse,
  ReviewUpsertRequest,
} from '@/entities/review/model/review-schema';

export function getReviewOptionsApi(token: string): Promise<ReviewOptions> {
  return apiClient<ReviewOptions>('/api/v1/reviews/options', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
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
    headers: { Authorization: `Bearer ${token}` },
  });
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
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}
