import { AssetRequestBody, postAssetApi } from '@/features/post-asset/api/post-asset-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function usePostAsset() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<unknown, unknown, AssetRequestBody>({
    mutationFn: (req) => postAssetApi(req),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ refetchType: 'all' });
      router.push('/asset');
      router.refresh();
    }
  });
}