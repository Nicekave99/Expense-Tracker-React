// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1LDslfOG4GyTYl49TBd4N8Ki-pWL4ruY",
  authDomain: "expense-tracker-webapp-96e67.firebaseapp.com",
  databaseURL:
    "https://expense-tracker-webapp-96e67-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "expense-tracker-webapp-96e67",
  storageBucket: "expense-tracker-webapp-96e67.firebasestorage.app",
  messagingSenderId: "419150472680",
  appId: "1:419150472680:web:af5f2ea20cd01b7fbf305d",
  measurementId: "G-WNTY8WRR2H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const database = getDatabase(app);
export const auth = getAuth(app);

// Initialize Analytics (optional)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;
