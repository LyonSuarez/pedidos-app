// lib/firestoreClient.ts
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

export const guardarClienteEnFirestore = async (cliente: any) => {
  try {
    const docRef = await addDoc(collection(db, 'clientes'), cliente);
    console.log('Cliente guardado con ID:', docRef.id);
    return true;
  } catch (error) {
    console.error('Error al guardar cliente en Firestore:', error);
    return false;
  }
};
