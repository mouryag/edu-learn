// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBatzZBgZDZccT6lo-BWNm4hm936BBkLbM",
  authDomain: "fire-learn-edu-app.firebaseapp.com",
  projectId: "fire-learn-edu-app",
  storageBucket: "fire-learn-edu-app.firebasestorage.app",
  messagingSenderId: "835969451813",
  appId: "1:835969451813:web:c12f356d902a6af579bccc"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, auth };
