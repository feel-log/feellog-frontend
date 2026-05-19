import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReviewApi } from '@/features/delete-review/api/delete-review-api';
import { reviewQueries } from '@/entities/review/api/review-queries';

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: (reviewDate: string) => deleteReviewApi(reviewDate),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...reviewQueries.all(), 'monthly'],
      });
    },
    onError: (error: unknown) => {
      console.error('회고 삭제 실패:', error);
    },
  });
}
