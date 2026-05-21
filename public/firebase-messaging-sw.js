importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDwhdstQqeiAsuMpUMPElDPure78hDcnQg',
  authDomain: 'feel-log-3de41.firebaseapp.com',
  projectId: 'feel-log-3de41',
  storageBucket: 'feel-log-3de41.firebasestorage.app',
  messagingSenderId: '955303189262',
  appId: '1:955303189262:web:291a97797f6c4a9cc3955f',
});

const messaging = firebase.messaging();

const FALLBACK_URL = '/notification';

function toSafeInternalUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl || FALLBACK_URL, self.location.origin);
    if (parsed.origin !== self.location.origin) return FALLBACK_URL;
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || FALLBACK_URL;
  } catch {
    return FALLBACK_URL;
  }
}

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || '알림';
  const options = {
    body: payload.notification?.body || '',
    icon: '/svg/icon_bell.svg',
    data: { url: toSafeInternalUrl(payload.data?.url) },
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = toSafeInternalUrl(event.notification.data?.url);
  const targetFullUrl = new URL(targetUrl, self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetFullUrl && 'focus' in client) {
          return client.focus();
        }
      }
      for (const client of clientList) {
        if ('focus' in client && 'navigate' in client) {
          return client.focus().then(() => client.navigate(targetUrl));
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    }),
  );
});
