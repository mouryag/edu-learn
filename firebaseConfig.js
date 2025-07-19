// firebaseConfig.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Add this import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBatzZBgZDZccT6lo-BWNm4hm936BBkLbM",
  authDomain: "fire-learn-edu-app.firebaseapp.com",
  projectId: "fire-learn-edu-app",
  storageBucket: "fire-learn-edu-app.firebasestorage.app",
  messagingSenderId: "835969451813",
  appId: "1:835969451813:web:c12f356d902a6af579bccc"
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
let auth;
let db; // Add this line

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  // Initialize Auth with AsyncStorage persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  // Initialize Firestore
  db = getFirestore(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app); // Add this line
}

export { app, auth, db }; // Export db
