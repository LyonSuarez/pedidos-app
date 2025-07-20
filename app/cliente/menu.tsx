import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { db } from "../../lib/firebase";

export default function MenuCliente() {
  const { username } = useLocalSearchParams();
  const [nombre, setNombre] = useState<string | null>(null);

  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const snapshot = await getDoc(doc(db, "clientes", String(username)));
        if (snapshot.exists()) {
          const data = snapshot.data();
          setNombre(data.name || "");
        } else {
          setNombre("No encontrado");
        }
      } catch (error) {
        console.error("Error al cargar cliente:", error);
        setNombre("Error al cargar");
      }
    };
    cargarNombre();
  }, [username]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido al menú, {nombre}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold" }
});
