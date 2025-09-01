// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC1LDslfOG4GyTYl49TBd4N8Ki-pWL4ruY",
  authDomain: "expense-tracker-webapp-96e67.firebaseapp.com",
  databaseURL:
    "https://expense-tracker-webapp-96e67-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "expense-tracker-webapp-96e67",
  // ✅ แก้ตรงนี้ให้เป็น appspot.com (ชื่อ bucket มาตรฐานของ Firebase)
  storageBucket: "expense-tracker-webapp-96e67.appspot.com",
  messagingSenderId: "419150472680",
  appId: "1:419150472680:web:af5f2ea20cd01b7fbf305d",
  measurementId: "G-WNTY8WRR2H",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);
// ✅ export storage ออกไปใช้ให้ชัดเจน
export const storage = getStorage(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;
