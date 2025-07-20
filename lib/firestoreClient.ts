import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "./users";

// 🔄 Obtener todos los clientes
export async function obtenerClientesDesdeFirestore(): Promise<User[]> {
  try {
    const snapshot = await getDocs(collection(db, "clientes"));
    const clientes = snapshot.docs.map((doc) => ({
      ...(doc.data() as User),
      id: doc.id
    }));
    return clientes;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return [];
  }
}

// 💾 Guardar o actualizar cliente
export async function guardarClienteEnFirestore(cliente: User): Promise<boolean> {
  try {
    // ✅ Validar que el ID no esté vacío
    if (!cliente.id) throw new Error("El ID del cliente es inválido o está vacío");

    // ✅ Forzar el ID a tipo string para evitar error de Firebase
    const ref = doc(db, "clientes", String(cliente.id));
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      // 🔄 Actualizar si ya existe
      await updateDoc(ref, {
        name: cliente.name,
        password: cliente.password,
        clientType: cliente.clientType,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        dni: cliente.dni,
        firstLogin: false
      });
    } else {
      // 🆕 Crear si no existe
      await setDoc(ref, {
        ...cliente,
        firstLogin: false
      });
    }

    return true;
  } catch (error) {
    console.error("Error guardando cliente:", error);
    return false;
  }
}


