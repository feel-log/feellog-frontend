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

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || '알림';
  const options = {
    body: payload.notification?.body || '',
    icon: '/svg/icon_bell.svg',
  };
  self.registration.showNotification(title, options);
});
