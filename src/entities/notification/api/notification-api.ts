import { apiClient } from '@/shared/api/api-instance';
import {
  NotificationListSchema,
  NotificationSettingsSchema,
  type Notification,
  type NotificationSettings,
} from '@/entities/notification/model/notification-schema';

export async function getNotificationsApi(): Promise<Notification[]> {
  const data = await apiClient<unknown>('/api/v1/notifications', { method: 'GET' });
  return NotificationListSchema.parse(data);
}

export function readAllNotificationsApi(): Promise<void> {
  return apiClient<void>('/api/v1/notifications/read-all', { method: 'PATCH' });
}

export function readNotificationApi(notificationId: number): Promise<void> {
  return apiClient<void>(`/api/v1/notifications/${notificationId}/read`, { method: 'PATCH' });
}

export function deleteAllNotificationsApi(): Promise<void> {
  return apiClient<void>('/api/v1/notifications', { method: 'DELETE' });
}

export function deleteNotificationApi(notificationId: number): Promise<void> {
  return apiClient<void>(`/api/v1/notifications/${notificationId}`, { method: 'DELETE' });
}

export async function getNotificationSettingsApi(): Promise<NotificationSettings> {
  const data = await apiClient<unknown>('/api/v1/notification-settings', { method: 'GET' });
  return NotificationSettingsSchema.parse(data);
}

export async function updateNotificationSettingsApi(
  body: NotificationSettings,
): Promise<NotificationSettings> {
  const data = await apiClient<unknown>('/api/v1/notification-settings', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  return NotificationSettingsSchema.parse(data);
}
