import { apiClient } from '@/shared/api/api-instance';

export function deleteReviewApi(reviewDate: string) {
  return apiClient<void>(`/api/v1/reviews/${reviewDate}`, { method: 'DELETE' });
}
