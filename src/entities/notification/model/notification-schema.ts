import { z } from 'zod';

export const NotificationSchema = z.object({
  notificationId: z.number(),
  type: z.string(),
  title: z.string().nullable(),
  body: z.string(),
  isRead: z.boolean(),
  createdAt: z.string(),
  readAt: z.string().nullable(),
});

export const NotificationListSchema = z.array(NotificationSchema);

export const NotificationSettingsSchema = z.object({
  pushEnabled: z.boolean(),
});

export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>;
