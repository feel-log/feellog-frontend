import { getFcmToken } from '@/shared/lib/firebase';
import { FCM_TOKEN_KEY } from '@/shared/constants/storage';
import { postDeviceTokenApi } from '../api/post-device-token-api';

export async function registerDeviceToken(): Promise<string | null> {
  const fcmToken = await getFcmToken();
  if (!fcmToken) return null;
  await postDeviceTokenApi({ token: fcmToken, deviceType: 'WEB' });
  localStorage.setItem(FCM_TOKEN_KEY, fcmToken);
  return fcmToken;
}
