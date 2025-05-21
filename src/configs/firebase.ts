// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPk1HtaTmql9cDiJoR0ohbPa12F6PZaD8",
  authDomain: "ai-trip-planner-8a9ca.firebaseapp.com",
  projectId: "ai-trip-planner-8a9ca",
  storageBucket: "ai-trip-planner-8a9ca.firebasestorage.app",
  messagingSenderId: "936207899908",
  appId: "1:936207899908:web:1ba90a3ec50de69f6a4451",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

