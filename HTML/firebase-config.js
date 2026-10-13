
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7lu6zwfV2xVAyMU9IFSzlDrOGRRFIHEE",
  authDomain: "learning-hub-fc831.firebaseapp.com",
  databaseURL: "https://learning-hub-fc831-default-rtdb.firebaseio.com",
  projectId: "learning-hub-fc831",
  storageBucket: "learning-hub-fc831.firebasestorage.app",
  messagingSenderId: "769248182402",
  appId: "1:769248182402:web:6855f3c81832790f15749b",
  measurementId: "G-0PKQL6KJ8Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

console.log("Firebase connected successfully!");

export { app, auth, database };
