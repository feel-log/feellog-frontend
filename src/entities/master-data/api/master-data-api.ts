import { apiClient } from '@/shared/api/api-instance';
import { MasterData } from '@/entities/master-data/model/master-data-schema';

export function getMasterDataApi(token: string): Promise<MasterData> {
  return apiClient<MasterData>('/api/v1/master-data', {
    method: 'GET',
  });
}
