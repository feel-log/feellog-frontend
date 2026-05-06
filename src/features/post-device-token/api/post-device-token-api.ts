import { apiClient } from '@/shared/api/api-instance';

interface DeviceTokenRequest {
  token: string;
  deviceType: string;
}

export function postDeviceTokenApi(
  request: DeviceTokenRequest,
): Promise<void> {
  return apiClient<void>('/api/v1/device-tokens', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}