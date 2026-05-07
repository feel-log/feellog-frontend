import { apiClient } from '@/shared/api/api-instance';

export interface AssetRequestBody {
  assetCategoryId: number;
  amount: number;
  assetDate: string;
  memo: string;
}

export function postAssetApi(req: AssetRequestBody) {
  return apiClient("/api/v1/assets", {
    method: "POST",
    body: JSON.stringify(req)
  });
}

export function patchAssetApi(assetId: number, req: AssetRequestBody) {
  return apiClient(`/api/v1/assets/${assetId}`, {
    method: "PATCH",
    body: JSON.stringify(req)
  });
}

export function deleteAssetApi(assetId: number) {
  return apiClient(`/api/v1/assets/${assetId}`, {
    method: "DELETE"
  });
}