import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export type Proveedor = {
  id: string;
  nombre: string;
  telefono: string;
  direccion: string;
  pais: 'Paraguay' | 'Brasil';
  correo?: string;
  notas?: string;
};

export async function obtenerProveedoresDesdeFirestore(): Promise<Proveedor[]> {
  try {
    const snapshot = await getDocs(collection(db, "proveedores"));
    return snapshot.docs.map(doc => ({
      ...(doc.data() as Proveedor),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error obteniendo proveedores:", error);
    return [];
  }
}

export async function guardarProveedorEnFirestore(proveedor: Proveedor): Promise<boolean> {
  try {
    const ref = doc(db, "proveedores", proveedor.id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, proveedor);
    } else {
      await setDoc(ref, proveedor);
    }
    return true;
  } catch (error) {
    console.error("Error guardando proveedor:", error);
    return false;
  }
}

export async function eliminarProveedorDeFirestore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "proveedores", id));
    return true;
  } catch (error) {
    console.error("Error eliminando proveedor:", error);
    return false;
  }
}
