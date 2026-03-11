import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUK4cT5rKNjG2pksciI8gCu1aB-kfF5TM",
  authDomain: "startupos-abeb1.firebaseapp.com",
  projectId: "startupos-abeb1",
  storageBucket: "startupos-abeb1.firebasestorage.app",
  messagingSenderId: "301894841620",
  appId: "1:301894841620:web:2c8e8272bb180365fd7e01",
};

// Ініціалізуємо додаток
const app = initializeApp(firebaseConfig);

// Експортуємо константи ОКРЕМО 
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };