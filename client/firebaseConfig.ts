// Import the required Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyBtVGt6sbDY9-vwj1GUX6_0QO35DY-gayI",
  authDomain: "newsapp-503ed.firebaseapp.com",
  databaseURL: "https://newsapp-503ed-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "newsapp-503ed",
  storageBucket: "newsapp-503ed.appspot.com",
  messagingSenderId: "346355739713",
  appId: "1:346355739713:web:5c7e21dca810f362f56ac0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Export db and storage for use
export { db, storage };
