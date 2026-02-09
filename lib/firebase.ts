import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAoCL5lJjF0OtnjRf9l-cKU-vT3hHmk13g",
  authDomain: "ranchie-taxi-1e166.firebaseapp.com",
  projectId: "ranchie-taxi-1e166",
  storageBucket: "ranchie-taxi-1e166.firebasestorage.app",
  messagingSenderId: "878235673378",
  appId: "1:878235673378:web:27c56cd1c6b91207827b7b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Messaging (only in browser)
export const VAPID_KEY = 'BC7OLgrJymcyNpkmVS-IpTI_piPh__zKKA959yzA4ko3uMT3CTipHv_9dQ23iNabe9PUTIUVjy9XRVgganNIZRc';

export const initMessaging = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const messaging = getMessaging(app);
      return messaging;
    } catch (error) {
      console.error('Messaging init error:', error);
      return null;
    }
  }
  return null;
};

export const requestNotificationPermission = async () => {
  try {
    const messaging = await initMessaging();
    if (!messaging) return null;
    
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};