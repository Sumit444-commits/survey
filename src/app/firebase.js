// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import 'dotenv/config'

const firebaseConfig = {
  apiKey: "AIzaSyBk_NaTVjjB7QXQ0Jidd3ttGDycNvCAJYY",
  authDomain: "lead-generation-c0654.firebaseapp.com",
  projectId: "lead-generation-c0654",
  storageBucket: "lead-generation-c0654.appspot.com",
  messagingSenderId: "824452637526",
  appId: "1:824452637526:web:b09870d67b1dcea96c6cf7",
  measurementId: "G-Q5XBQC7BJK"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
