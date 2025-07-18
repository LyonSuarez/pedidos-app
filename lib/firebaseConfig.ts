// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// firebaseConfig.ts
export const firebaseConfig = {
  apiKey: "AIzaSyAhLa5vASq30rkxdFPxb41xED5t2_qZog8",
  authDomain: "pedidos-app-df98a.firebaseapp.com",
  projectId: "pedidos-app-df98a",
  storageBucket: "pedidos-app-df98a.appspot.com", // corregido el dominio
  messagingSenderId: "452514757879",
  appId: "1:452514757879:web:f88b4e53e3f3efdb2be7f2"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);