'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@/shared/store';
import { registerDeviceToken } from '@/features/post-device-token';
import { updateNotificationSettingsApi } from '@/entities/notification/api/notification-api';
import { requestNotificationPermission } from '@/shared/lib/firebase';

export function AutoRequestNotificationPermission() {
  const isLoaded = useUser((s) => s.isLoaded);
  const id = useUser((s) => s.id);
  const nickname = useUser((s) => s.nickname);
  const triedRef = useRef(false);

  useEffect(() => {
    if (triedRef.current) return;
    if (typeof window === 'undefined') return;
    if (typeof Notification === 'undefined') return;
    if (!isLoaded) return;
    if (!id) return;
    if (nickname.startsWith('guest')) return;
    if (Notification.permission !== 'default') return;

    triedRef.current = true;
    (async () => {
      try {
        const permission = await requestNotificationPermission();
        if (permission !== 'granted') return;
        const fcmToken = await registerDeviceToken();
        if (!fcmToken) return;
        await updateNotificationSettingsApi({ pushEnabled: true });
      } catch (error) {
        console.error('알림 자동 권한 요청 실패:', error);
      }
    })();
  }, [isLoaded, id, nickname]);

  return null;
}
