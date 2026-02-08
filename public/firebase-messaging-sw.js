importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC49BbFJhjpHajencr1W6VlpiFwpWTeD8U",
  authDomain: "ranchie-taxi-1e166.firebaseapp.com",
  projectId: "ranchie-taxi-1e166",
  storageBucket: "ranchie-taxi-1e166.firebasestorage.app",
  messagingSenderId: "878235673378",
  appId: "1:878235673378:web:27c56cd1c6b91207827b7b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification?.title || '🚕 New Booking!';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new taxi booking',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'booking-notification',
    requireInteraction: true,
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/driver')
  );
});