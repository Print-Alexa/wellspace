import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7IK2ZYAOpcHyhXms-PKHEdaSHdxUHxcA",
  authDomain: "wellspace-d81e5.firebaseapp.com",
  projectId: "wellspace-d81e5",
  storageBucket: "wellspace-d81e5.firebasestorage.app",
  messagingSenderId: "645173865167",
  appId: "1:645173865167:web:8886bd9da3653d28e625ba",
  measurementId: "G-M362SWHP57",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
