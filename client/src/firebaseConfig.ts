import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBtVGt6sbDY9-vwj1GUX6_0QO35DY-gayI",
  authDomain: "newsapp-503ed.firebaseapp.com",
  databaseURL: "https://newsapp-503ed-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "newsapp-503ed",
  storageBucket: "newsapp-503ed.appspot.com",
  messagingSenderId: "346355739713",
  appId: "1:346355739713:web:5c7e21dca810f362f56ac0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc, ref, uploadBytes, getDownloadURL };
