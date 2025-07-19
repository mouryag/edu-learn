// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBatzZBgZDZccT6lo-BWNm4hm936BBkLbM",
  authDomain: "fire-learn-edu-app.firebaseapp.com",
  projectId: "fire-learn-edu-app",
  storageBucket: "fire-learn-edu-app.firebasestorage.app",
  messagingSenderId: "835969451813",
  appId: "1:835969451813:web:c12f356d902a6af579bccc"
};

// Initialize Firebase only if no apps exist
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use existing app
}

// Initialize Firebase Authentication with persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // If auth is already initialized, get the existing instance
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

// Initialize Cloud Firestore
const db = getFirestore(app);

export { app, auth, db };