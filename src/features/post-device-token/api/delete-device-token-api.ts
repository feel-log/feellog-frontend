import { apiClient } from '@/shared/api/api-instance';

export function deleteDeviceTokenApi(token: string): Promise<void> {
  return apiClient<void>(`/api/v1/device-tokens?token=${encodeURIComponent(token)}`, {
    method: 'DELETE',
  });
}
