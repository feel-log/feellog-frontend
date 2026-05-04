import { HouseHoldPostRequest, postHouseHoldApi } from '@/features/post-house-hold/api/post-house-hold-api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { MonthlyExpendType } from '@/entities/today-expenditure/model/monthly-expend-type';
import { apiClient } from '@/shared/api/api-instance';

export function useHouseHoldPost(
  type: string,
  accessToken: string,
  houseHoldPostRequest: HouseHoldPostRequest
) {
  const router = useRouter();

  const mutation = useMutation<void>({
    mutationFn: async () => postHouseHoldApi(accessToken, houseHoldPostRequest),
    onSuccess: async () => {
      router.push('/');
      apiClient<MonthlyExpendType[]>(
        `/api/v1/expenses/monthly?year=${new Date(houseHoldPostRequest.expenseDate).getFullYear()}&month=${new Date(houseHoldPostRequest.expenseDate).getMonth() + 1}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onError: (error: unknown) => {
      console.error('추가 실패');
      console.log(error);
    },
  });

  return mutation;
}