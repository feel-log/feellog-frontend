import { HouseHoldPostRequest, postHouseHoldApi } from '@/features/post-house-hold/api/post-house-hold-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
    onError: () => {
      toast.error('지출 저장에 실패했어요. 잠시 후 다시 시도해주세요.');
    },
  });

  return mutation;
}