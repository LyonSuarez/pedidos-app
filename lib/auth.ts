// lib/auth.ts
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from './firebase';
const db = getFirestore(app);

export const autenticarUsuarioAdmin = async (username: string, password: string) => {
  const snapshot = await getDocs(collection(db, 'usuarios'));
  const usuarios = snapshot.docs.map(doc => doc.data());
  return usuarios.some(u => u.username === username && u.password === password && u.role === 'admin');
};

export const autenticarUsuarioCliente = async (username: string, password: string) => {
  const snapshot = await getDocs(collection(db, 'clientes'));
  const clientes = snapshot.docs.map(doc => doc.data());
  return clientes.find(c => c.username === username && c.password === password);
};
