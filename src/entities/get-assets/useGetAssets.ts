import { useQuery } from '@tanstack/react-query';
import { getAssetsApi, GetAssetsParams, AssetItem } from '@/entities/get-assets/get-assets-api';
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
}

export function useGetAssets(params: GetAssetsParams, enabled = true) {
  return useQuery({
    queryKey: ['assets', params],
    enabled,
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
        };
      }

      // 모든 카테고리 조회
      const categoryIds = [1, 2, 3, 4, 5, 6];
      const allAssets: AssetItem[] = [];
      const categoryTotals: Record<number, number> = {};

      const responses = await Promise.all(
        categoryIds.map(categoryId =>
          getAssetsApi({
            ...params,
            categoryId,
          }).catch(() => ({ assets: [], categoryName: '', categoryTotalAmount: 0, hasNext: false, page: 0, size: 100 }))
        )
      );

      responses.forEach((response, idx) => {
        const categoryId = categoryIds[idx];
        const assetsWithCategory = (response.assets || []).map(asset => ({
          ...asset,
          assetCategoryId: categoryId,
        })) as AssetItem[];
        allAssets.push(...assetsWithCategory);
        categoryTotals[categoryId] = response.categoryTotalAmount || 0;
      });

      // 정렬 적용
      const sortedAssets = applySorting(allAssets, params.sort);

      // 페이지네이션 적용
      const page = params.page ?? 0;
      const size = params.size ?? 100;
      const start = page * size;
      const end = start + size;
      const paginatedAssets = sortedAssets.slice(start, end);

      const totalAmount = allAssets.reduce((sum, asset) => sum + asset.amount, 0);

      // 카테고리별 최신/오래된 자산 (날짜 + assetId 보조 정렬)
      // 같은 날짜라면 assetId가 큰 게 더 나중에 등록된 것으로 처리
      const categoryDates: Record<number, { latest: number; oldest: number; latestId: number; oldestId: number }> = {};
      allAssets.forEach((asset) => {
        const time = new Date(asset.assetDate).getTime();
        const cur = categoryDates[asset.assetCategoryId];
        if (!cur) {
          categoryDates[asset.assetCategoryId] = { latest: time, oldest: time, latestId: asset.assetId, oldestId: asset.assetId };
        } else {
          if (time > cur.latest || (time === cur.latest && asset.assetId > cur.latestId)) {
            cur.latest = time;
            cur.latestId = asset.assetId;
          }
          if (time < cur.oldest || (time === cur.oldest && asset.assetId < cur.oldestId)) {
            cur.oldest = time;
            cur.oldestId = asset.assetId;
          }
        }
      });

      // 카테고리별 정보 구성
      const categories = ASSET_CATEGORIES
        .map((cat, idx) => ({
          ...cat,
          total: categoryTotals[idx + 1] || 0,
          latest: categoryDates[idx + 1]?.latest ?? 0,
          oldest: categoryDates[idx + 1]?.oldest ?? 0,
          latestId: categoryDates[idx + 1]?.latestId ?? 0,
          oldestId: categoryDates[idx + 1]?.oldestId ?? 0,
        }))
        .filter(cat => cat.total > 0)
        .sort((a, b) => {
          if (params.sort === 'AMOUNT_DESC') return b.total - a.total;
          if (params.sort === 'AMOUNT_ASC') return a.total - b.total;
          if (params.sort === 'OLDEST') {
            if (a.oldest !== b.oldest) return a.oldest - b.oldest;
            return a.oldestId - b.oldestId;
          }
          // LATEST
          if (a.latest !== b.latest) return b.latest - a.latest;
          return b.latestId - a.latestId;
        });

      return {
        data: paginatedAssets,
        total: allAssets.length,
        totalAmount,
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
