const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

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
const auth = getAuth(app);

async function createAdminUser() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, 'admin@example.com', 'adminpass');
    console.log('Admin user created successfully:', userCredential.user.email);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Admin user already exists');
    } else {
      console.error('Error creating admin user:', error);
    }
  }
}

createAdminUser();