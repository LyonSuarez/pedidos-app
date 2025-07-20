// lib/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración real de tu app
export const firebaseConfig = {
  apiKey: "AIzaSyAhLa5vASq30rkxdFPxb41xED5t2_qZog8",
  authDomain: "pedidos-app-df98a.firebaseapp.com",
  projectId: "pedidos-app-df98a",
  storageBucket: "pedidos-app-df98a.appspot.com",
  messagingSenderId: "452514757879",
  appId: "1:452514757879:web:f88b4e53e3f3efdb2be7f2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar la base de datos Firestore
export const db = getFirestore(app);
