// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import {getFireStore} from "firebase/firestore";

import { getFirestore } from "firebase/firestore";
import 'dotenv/config'
// Your web app's Firebase configuration
// const app = initializeApp(firebaseConfig);
const firebaseConfig = {
  apiKey: "AIzaSyBk_NaTVjjB7QXQ0Jidd3ttGDycNvCAJYY",
  authDomain: "lead-generation-c0654.firebaseapp.com",
  projectId: "lead-generation-c0654",
  storageBucket: "lead-generation-c0654.appspot.com",
  messagingSenderId: "824452637526",
  appId: "1:824452637526:web:b09870d67b1dcea96c6cf7",
  measurementId: "G-Q5XBQC7BJK"
};
// const firebaseConfig = {
//   apiKey: process.env.API,
//   authDomain: process.env.DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.BUCKET,
//   messagingSenderId: process.env.SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASUREMENT_ID
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
