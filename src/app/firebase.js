// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import 'dotenv/config'

const firebaseConfig = {
 apiKey: "AIzaSyAs-VtzaGW1UNQ2mLJ_sRHC63FoZpa0L-4",
authDomain: "morafiq-aviation-services.firebaseapp.com",
projectId: "morafiq-aviation-services",
storageBucket: "morafiq-aviation-services.appspot.com",
messagingSenderId: "46889375086",
appId: "1:46889375086:web:8dba29b8ed5a3fb4e95d7f"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
