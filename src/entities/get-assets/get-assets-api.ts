import { apiClient } from '@/shared/api/api-instance';

export interface GetAssetsParams {
  categoryId?: number;
  sort?: 'LATEST' | 'OLDEST' | 'AMOUNT_ASC' | 'AMOUNT_DESC';
  page?: number;
  size?: number;
}

export interface AssetItem {
  assetId: number;
  amount: number;
  assetDate: string;
  memo: string;
  assetCategoryId: number;
}

export interface AssetsResponse {
  assets: AssetItem[];
  categoryName: string;
  categoryTotalAmount: number;
  hasNext: boolean;
  page: number;
  size: number;
}

export async function getAssetsApi(params: GetAssetsParams): Promise<AssetsResponse> {
  const queryParams = new URLSearchParams();
  if (params.categoryId) queryParams.append('categoryId', params.categoryId.toString());
  if (params.sort) queryParams.append('sort', params.sort);
  queryParams.append('page', (params.page ?? 0).toString());
  queryParams.append('size', (params.size ?? 100).toString());

  const query = queryParams.toString();
  const url = `/api/v1/assets${query ? `?${query}` : ''}`;

  return apiClient(url, {
    method: 'GET',
  });
}
