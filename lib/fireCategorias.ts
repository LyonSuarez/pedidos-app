import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const coleccion = collection(db, 'categorias');

// Obtener todas las categorías
export const obtenerCategoriasDesdeFirestore = async () => {
  const snapshot = await getDocs(coleccion);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Agregar una nueva categoría (sin marcas al principio)
export const agregarCategoria = async (nombre: string) => {
  await addDoc(coleccion, {
    nombre,
    marcas: [],
  });
};

// Eliminar categoría completa
export const eliminarCategoria = async (id: string) => {
  await deleteDoc(doc(db, 'categorias', id));
};

// Editar el nombre de una categoría
export const editarNombreCategoria = async (id: string, nuevoNombre: string) => {
  await updateDoc(doc(db, 'categorias', id), {
    nombre: nuevoNombre,
  });
};

// Agregar marca a una categoría
export const agregarMarcaACategoria = async (id: string, marca: string) => {
  await updateDoc(doc(db, 'categorias', id), {
    marcas: arrayUnion(marca),
  });
};

// Eliminar marca de una categoría
export const eliminarMarcaDeCategoria = async (id: string, marca: string) => {
  await updateDoc(doc(db, 'categorias', id), {
    marcas: arrayRemove(marca),
  });
};
