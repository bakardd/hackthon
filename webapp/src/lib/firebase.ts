import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBWEtduPzSv4en6E2yMLiv7qaTnZ4DNhGY",
  authDomain: "farmforward-ebd84.firebaseapp.com",
  projectId: "farmforward-ebd84",
  storageBucket: "farmforward-ebd84.firebasestorage.app",
  messagingSenderId: "524338938477",
  appId: "1:524338938477:web:bcb579acc1718dc11e7564",
  measurementId: "G-LH8TT25N70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
