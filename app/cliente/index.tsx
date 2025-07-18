import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { users } from "../../lib/users";

export default function ClienteScreen() {
  const { username } = useLocalSearchParams();
  const router = useRouter();

  const userIndex = users.findIndex((u) => u.username === username);
  const user = users[userIndex];

  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState(user.name || "");
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
  if (userIndex !== -1) {
    users[userIndex].name = newName;
    users[userIndex].password = newPassword;
    users[userIndex].firstLogin = false;
    
    Alert.alert("Guardado", "Los datos fueron actualizados");
    setNewPassword("");
    
    // Redirige al menú del cliente
    router.push({
      pathname: "/cliente/menu",
      params: { username: user.username }
    });
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido!</Text>

      <Text style={styles.label}>Cambiar Nombre:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nuevo nombre"
        placeholderTextColor="#888"
        value={newName}
        onChangeText={setNewName}
      />

      <Text style={styles.label}>Cambiar Contraseña:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        placeholderTextColor="#888"
        secureTextEntry={!showPassword}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.toggle}>
          {showPassword ? "Ocultar contraseña" : "Ver contraseña"}
        </Text>
      </TouchableOpacity>

      <Button title="GUARDAR" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20, paddingTop: 60 },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30
  },
  label: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold"
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    color: "#fff",
    backgroundColor: "#000"
  },
  toggle: {
    color: "#1E90FF",
    textAlign: "right",
    marginBottom: 20
  }
});
