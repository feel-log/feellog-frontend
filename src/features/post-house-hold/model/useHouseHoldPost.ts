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
      await queryClient.invalidateQueries({ refetchType: 'all' });
      router.push('/');
      router.refresh();
    },
    onError: (error: unknown) => {
      console.error('추가 실패');
      console.log(error);
    },
  });

  return mutation;
}