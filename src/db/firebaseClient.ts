import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyAzOuD74bR0dJA-zVhUF27kdjlPPTsgdfg",
  authDomain: "labasuna-fe053.firebaseapp.com",
  projectId: "labasuna-fe053",
  storageBucket: "labasuna-fe053.firebasestorage.app",
  messagingSenderId: "266131713864",
  appId: "1:266131713864:web:5289a3680e60c917e2cd7d"
};

// Initialize Firebase safely
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const firebaseDb = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
