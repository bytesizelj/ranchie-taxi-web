importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC49BbFJhjpHajencr1W6VlpiFwpWTeD8U",
  authDomain: "ranchie-taxi-1e166.firebaseapp.com",
  projectId: "ranchie-taxi-1e166",
  storageBucket: "ranchie-taxi-1e166.firebasestorage.app",
  messagingSenderId: "878235673378",
  appId: "1:878235673378:web:27c56cd1c6b91207827b7b",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const title = payload.notification?.title || "🚕 New Booking!";
  const options = {
    body: payload.notification?.body || "You have a new booking request",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
    data: payload.data,
    actions: [
      { action: "open_dashboard", title: "Open Dashboard" },
    ],
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/driver") && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow("/driver");
    })
  );
});