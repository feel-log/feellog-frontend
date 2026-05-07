import { AssetRequestBody, patchAssetApi } from '@/features/post-asset/api/post-asset-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useUpdateAsset() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<unknown, unknown, { assetId: number; request: AssetRequestBody }>({
    mutationFn: ({ assetId, request }) => patchAssetApi(assetId, request),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['assets'] });
      router.push('/asset');
    }
  });
}
