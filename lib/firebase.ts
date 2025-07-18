// lib/firebase.ts
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app); // conexión a Firestore

export { app, db };

