// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASyuH-5bFVkGqpOjYl-4Xj65P3KmVCFTk",
  authDomain: "linklocal-technobytes.firebaseapp.com",
  projectId: "linklocal-technobytes",
  storageBucket: "linklocal-technobytes.firebasestorage.app",
  messagingSenderId: "1066900831439",
  appId: "1:1066900831439:web:1744478f62cfae90d04bba",
  measurementId: "G-P5JZGCSRLG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);