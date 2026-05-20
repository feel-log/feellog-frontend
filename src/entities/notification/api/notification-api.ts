import { apiClient } from '@/shared/api/api-instance';
import type {
  Notification,
  NotificationSettings,
} from '@/entities/notification/model/notification-schema';

export function getNotificationsApi(): Promise<Notification[]> {
  return apiClient<Notification[]>('/api/v1/notifications', { method: 'GET' });
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

export function getNotificationSettingsApi(): Promise<NotificationSettings> {
  return apiClient<NotificationSettings>('/api/v1/notification-settings', { method: 'GET' });
}

export function updateNotificationSettingsApi(
  body: NotificationSettings,
): Promise<NotificationSettings> {
  return apiClient<NotificationSettings>('/api/v1/notification-settings', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
