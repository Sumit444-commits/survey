// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import {getFireStore} from "firebase/firestore";

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// const app = initializeApp(firebaseConfig);
const firebaseConfig = {
  apiKey: "AIzaSyCOPdxJvnm6IsZ5A9BcFjADwwXgwoQmarM",
  authDomain: "expense-tracker-95c4a.firebaseapp.com",
  projectId: "expense-tracker-95c4a",
  storageBucket: "expense-tracker-95c4a.appspot.com",
  messagingSenderId: "710333055637",
  appId: "1:710333055637:web:e843721f0a83c3efa7919c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
