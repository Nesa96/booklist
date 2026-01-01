import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-3VB7PUm5qlSJc5zid8uC0ll4Asg98vQ",
  authDomain: "book-list-5ca29.firebaseapp.com",
  projectId: "book-list-5ca29",
  storageBucket: "book-list-5ca29.firebasestorage.app",
  messagingSenderId: "218728186368",
  appId: "1:218728186368:web:e1c27b56414edd73854ee5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);