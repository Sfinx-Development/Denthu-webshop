import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3biDDLJ6a2NtRnw7ncWWvGwNMPNAmGOI",
  authDomain: "denthu-webshop.firebaseapp.com",
  projectId: "denthu-webshop",
  storageBucket: "denthu-webshop.appspot.com",
  messagingSenderId: "228010490117",
  appId: "1:228010490117:web:42e90dc476691516f4df6c",
  measurementId: "G-RMX490WWSZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
