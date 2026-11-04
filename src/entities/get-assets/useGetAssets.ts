import { useQuery } from '@tanstack/react-query';
import {
  getAssetsApi,
  getAssetsSummaryApi,
  GetAssetsParams,
  AssetItem,
} from '@/entities/get-assets/get-assets-api';
import { ASSET_CATEGORIES } from '@/shared/constants/assetData';

interface CategoryAsset {
  id: string;
  label: string;
  color: string;
  total: number;
}

interface MergedAssetsResponse {
  data: AssetItem[];
  total: number;
  totalAmount: number;
  categories: CategoryAsset[];
  categoryName?: string;
}

export function useGetAssets(params: GetAssetsParams, enabled = true) {
  return useQuery({
    queryKey: ['assets', params],
    enabled,
    throwOnError: false,
    retry: (failureCount, error) =>
      !(error instanceof Error && error.message === 'Session expired') && failureCount < 2,
    queryFn: async (): Promise<MergedAssetsResponse> => {
      // 특정 카테고리만 조회하는 경우
      if (params.categoryId) {
        const response = await getAssetsApi(params);
        const assetsWithCategory = response.assets.map(asset => ({
          ...asset,
          assetCategoryId: params.categoryId!,
        })) as AssetItem[];
        const totalAmount = assetsWithCategory.reduce((sum, asset) => sum + asset.amount, 0);
        return {
          data: assetsWithCategory,
          total: assetsWithCategory.length,
          totalAmount,
          categories: [],
          categoryName: response.categoryName,
        };
      }

      // 서버에 실제로 존재하는 카테고리만 조회한다.
      const summary = await getAssetsSummaryApi();
      const categorySummaries = summary.categories ?? [];
      const allAssets: AssetItem[] = [];

      const responses = await Promise.all(
        categorySummaries.map(({ assetCategoryId }) =>
          getAssetsApi({
            ...params,
            categoryId: assetCategoryId,
            page: 0,
            size: 1000,
          })
        )
      );

      responses.forEach((response, idx) => {
        const categoryId = categorySummaries[idx].assetCategoryId;
        const assetsWithCategory = (response.assets || []).map(asset => ({
          ...asset,
          assetCategoryId: categoryId,
        })) as AssetItem[];
        allAssets.push(...assetsWithCategory);
      });

      // 정렬 적용
      const sortedAssets = applySorting(allAssets, params.sort);

      // 페이지네이션 적용
      const page = params.page ?? 0;
      const size = params.size ?? 100;
      const start = page * size;
      const end = start + size;
      const paginatedAssets = sortedAssets.slice(start, end);

      const categories = categorySummaries.map((category, idx) => ({
        id: String(category.assetCategoryId),
        label: category.categoryName,
        color: ASSET_CATEGORIES[idx % ASSET_CATEGORIES.length]?.color ?? '#CACDD2',
        total: category.totalAmount ?? 0,
      }));

      return {
        data: paginatedAssets,
        total: allAssets.length,
        totalAmount: summary.totalAssetAmount ?? 0,
        categories,
      };
    },
  });
}

function applySorting(assets: AssetItem[], sort?: string): AssetItem[] {
  const sorted = [...assets];

  if (sort === 'AMOUNT_DESC') {
    sorted.sort((a, b) => b.amount - a.amount);
  } else if (sort === 'AMOUNT_ASC') {
    sorted.sort((a, b) => a.amount - b.amount);
  } else if (sort === 'OLDEST') {
    sorted.sort((a, b) => new Date(a.assetDate).getTime() - new Date(b.assetDate).getTime());
  } else {
    // LATEST (최신순) - assetDate 역순
    sorted.sort((a, b) => new Date(b.assetDate).getTime() - new Date(a.assetDate).getTime());
  }

  return sorted;
}
