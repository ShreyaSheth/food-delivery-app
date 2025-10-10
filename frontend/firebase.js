// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "craveo-28bfd.firebaseapp.com",
  projectId: "craveo-28bfd",
  storageBucket: "craveo-28bfd.firebasestorage.app",
  messagingSenderId: "815063785061",
  appId: "1:815063785061:web:a577b1e48155f494df308c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
