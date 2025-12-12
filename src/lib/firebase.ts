// Minimal Firebase client setup with safe fallback when env vars are missing.
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function hasConfig() {
  return (
    !!cfg.apiKey && !!cfg.projectId && !!cfg.appId
  );
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (hasConfig()) {
  app = initializeApp(cfg);
  db = getFirestore(app);
  auth = getAuth(app);
}

export const firebaseApp = app;
export const firestore = db;
export const firebaseConfigured = hasConfig();
export const firebaseAuth = auth;
