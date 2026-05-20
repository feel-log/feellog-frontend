import { queryOptions } from '@tanstack/react-query';
import {
  getNotificationSettingsApi,
  getNotificationsApi,
} from '@/entities/notification/api/notification-api';

export const notificationQueries = {
  all: () => ['notification'] as const,
  list: () =>
    queryOptions({
      queryKey: [...notificationQueries.all(), 'list'],
      queryFn: () => getNotificationsApi(),
      staleTime: 1000 * 30,
    }),
  settings: () =>
    queryOptions({
      queryKey: [...notificationQueries.all(), 'settings'],
      queryFn: () => getNotificationSettingsApi(),
      staleTime: 1000 * 60,
    }),
};
