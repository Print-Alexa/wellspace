import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7IK2ZYAOpcHyhXms-PKHEdaSHdxUHxcA",
  // Same-origin auth domain: the Firebase sign-in helpers are vendored in
  // public/__/auth and served from this app's own domain. A cross-origin
  // authDomain (the default *.firebaseapp.com) is silently broken on every
  // modern browser because storage partitioning blocks the auth iframe —
  // the sign-in result never reaches the app and it bounces back to the
  // landing page. Same-origin auth avoids that entirely.
  authDomain: "wellspacebya.netlify.app",
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
