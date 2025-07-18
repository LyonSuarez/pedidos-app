import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { users } from "../lib/users";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    Alert.alert("Error", "Usuario o contraseña incorrectos");
    return;
  }

  if (user.role === "admin") {
    router.push({ pathname: "../admin", params: { username: user.username } });
  } else {
    if (user.firstLogin) {
      router.push({ pathname: "../cliente", params: { username: user.username } });
    } else {
      router.push({ pathname: "../cliente/menu", params: { username: user.username } });
    }
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>

      <Text style={styles.label}>USUARIO</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresá tu usuario"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>CONTRASEÑA</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresá tu contraseña"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.toggle}>
          {showPassword ? "Ocultar contraseña" : "Ver contraseña"}
        </Text>
      </TouchableOpacity>

      <Button title="INGRESAR" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#000" },
  title: { fontSize: 26, color: "#fff", textAlign: "center", marginBottom: 30 },
  label: { color: "#fff", fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: "#fff"
  },
  toggle: {
    color: "#1E90FF",
    textAlign: "right",
    marginBottom: 20
  }
});
