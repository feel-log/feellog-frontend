'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

function getFirebaseApp(): FirebaseApp {
  return getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
}

function getMessagingInstance(): Messaging | null {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;
  return getMessaging(getFirebaseApp());
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return await Notification.requestPermission();
}

export async function getFcmToken(): Promise<string | null> {
  try {
    const messaging = getMessagingInstance();
    if (!messaging || !VAPID_KEY) return null;

    await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const registration = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    return token || null;
  } catch (error) {
    console.error('FCM token 발급 실패:', error);
    return null;
  }
}

export function subscribeForegroundMessage(handler: (payload: unknown) => void) {
  const messaging = getMessagingInstance();
  if (!messaging) return () => {};
  return onMessage(messaging, handler);
}
