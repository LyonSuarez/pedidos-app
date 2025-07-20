// lib/firebase.ts
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

// Inicializar app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Conexión a Firestore
const db = getFirestore(app);

// Exportaciones
export { app, db };

