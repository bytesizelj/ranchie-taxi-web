import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC49BbFJhjpHajencr1W6VlpiFwpWTeD8U",
  authDomain: "ranchie-taxi-1e166.firebaseapp.com",
  projectId: "ranchie-taxi-1e166",
  storageBucket: "ranchie-taxi-1e166.firebasestorage.app",
  messagingSenderId: "878235673378",
  appId: "1:878235673378:web:27c56cd1c6b91207827b7b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);