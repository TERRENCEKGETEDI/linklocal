import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyASyuH-5bFVkGqpOjYl-4Xj65P3KmVCFTk",
  authDomain: "linklocal-technobytes.firebaseapp.com",
  projectId: "linklocal-technobytes",
  storageBucket: "linklocal-technobytes.firebasestorage.app",
  messagingSenderId: "1066900831439",
  appId: "1:1066900831439:web:1744478f62cfae90d04bba",
  measurementId: "G-P5JZGCSRLG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

