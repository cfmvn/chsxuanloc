import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

// Cấu hình Firebase Client SDK
export const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || "AIzaSyDqpHnIWyPAA1rlGimPHBeaW4SIZfUX9-w",
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || "xuanlocchs.firebaseapp.com",
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || "xuanlocchs",
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || "xuanlocchs.firebasestorage.app",
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "173381053400",
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || "1:173381053400:web:1f59ec02ad7ad05ea620ad",
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID || "G-G6S5FJGLBE"
};

// Khởi tạo Firebase App (Singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Khởi tạo Firebase Analytics (Client-side tracking)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn('Firebase Analytics not supported in this environment:', err);
  });
}

export { analytics };
export default app;
