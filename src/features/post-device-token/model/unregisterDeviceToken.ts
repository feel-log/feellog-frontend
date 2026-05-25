import { FCM_TOKEN_KEY } from '@/shared/constants/storage';
import { deleteDeviceTokenApi } from '../api/delete-device-token-api';

export async function unregisterDeviceToken(): Promise<void> {
  const token = localStorage.getItem(FCM_TOKEN_KEY);
  if (!token) return;
  localStorage.removeItem(FCM_TOKEN_KEY);
  try {
    await deleteDeviceTokenApi(token);
  } catch (error) {
    console.error('디바이스 토큰 삭제 실패:', error);
  }
}
