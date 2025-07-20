// lib/firebaseProductos.ts
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const actualizarProductoEnFirestore = async (id: string, datosActualizados: any) => {
  try {
    const productoRef = doc(db, "productos", id);
    await updateDoc(productoRef, datosActualizados);
    console.log("Producto actualizado en Firestore.");
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    throw error;
  }
};
