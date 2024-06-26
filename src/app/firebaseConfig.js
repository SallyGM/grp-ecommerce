// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSPGMOHgN2c-upekhipXtTanKqsL0kle0",
  authDomain: "buster-games-356c2.firebaseapp.com",
  databaseURL: "https://buster-games-356c2-default-rtdb.firebaseio.com",
  projectId: "buster-games-356c2",
  storageBucket: "buster-games-356c2.appspot.com",
  messagingSenderId: "464994833682",
  appId: "1:464994833682:web:110a059e68d28ce95a4fcb",
  measurementId: "G-RMSPSMCP28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getDatabase(app);
export default app
