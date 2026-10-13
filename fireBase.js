// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7lu6zwfV2xVAyMU9IFSzlDrOGRRFIHEE",
  authDomain: "learning-hub-fc831.firebaseapp.com",
  projectId: "learning-hub-fc831",
  storageBucket: "learning-hub-fc831.firebasestorage.app",
  messagingSenderId: "769248182402",
  appId: "1:769248182402:web:6855f3c81832790f15749b",
  measurementId: "G-0PKQL6KJ8Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);