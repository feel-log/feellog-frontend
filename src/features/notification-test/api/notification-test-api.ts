import { apiClient } from '@/shared/api/api-instance';

export function notificationTestApi(): Promise<void> {
  return apiClient<void>('/api/v1/notifications/test', {
    method: 'POST',
  });
}
