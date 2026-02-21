// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApBQ4uvOD-cqv_7foq5zlof9pZnxafI5I",
  authDomain: "postremaniac-b11f5.firebaseapp.com",
  projectId: "postremaniac-b11f5",
  storageBucket: "postremaniac-b11f5.firebasestorage.app",
  messagingSenderId: "98160884304",
  appId: "1:98160884304:web:f495295dfb53b70abbaf55",
  measurementId: "G-3B9RBXG60V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);