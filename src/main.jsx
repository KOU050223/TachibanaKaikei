import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoQwLb9nmh_02HqSSJ8Y0JHaJNm0YlSIA",
  authDomain: "tachibana-kaikei.firebaseapp.com",
  projectId: "tachibana-kaikei",
  storageBucket: "tachibana-kaikei.appspot.com",
  messagingSenderId: "377640979573",
  appId: "1:377640979573:web:723d2e297db6f3d508fc3c",
  measurementId: "G-C4G1JD2LC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
