import { HouseHoldPostRequest, postHouseHoldApi } from '@/features/post-house-hold/api/post-house-hold-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useHouseHoldPost(
  type: string,
  houseHoldPostRequest: HouseHoldPostRequest
) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<void>({
    mutationFn: async () => postHouseHoldApi(houseHoldPostRequest),
    onSuccess: async () => {
      // 월별 지출 데이터 쿼리 무효화하여 새로운 데이터 fetch
      const year = parseInt(houseHoldPostRequest.expenseDate.split('-')[0]);
      const month = parseInt(houseHoldPostRequest.expenseDate.split('-')[1]);

      // 데이터 무효화 및 refetch
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['today-expend', year, month]
        }),
        queryClient.invalidateQueries({
          queryKey: ['week_expend_queries']
        })
      ]);

      // refetch 수행
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ['today-expend', year, month]
        }),
        queryClient.refetchQueries({
          queryKey: ['week_expend_queries']
        })
      ]);

      router.push('/');
    },
    onError: (error: unknown) => {
      console.error('추가 실패');
      console.log(error);
    },
  });

  return mutation;
}