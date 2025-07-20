import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const adminDocRef = doc(db, 'usuarios', 'ADMIN');

export const obtenerAdmin = async () => {
  const snapshot = await getDoc(adminDocRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  } else {
    throw new Error('No se encontró el usuario ADMIN.');
  }
};

export const actualizarAdmin = async (nuevosDatos: { name?: string; password?: string }) => {
  await updateDoc(adminDocRef, nuevosDatos);
};
