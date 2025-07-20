import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { autenticarUsuarioAdmin, autenticarUsuarioCliente } from '../lib/auth';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor ingresá usuario y contraseña');
      return;
    }

    // Intentar login como ADMIN
    const esAdmin = await autenticarUsuarioAdmin(username, password);
    if (esAdmin) {
      router.push({ pathname: '../admin', params: { username } });
      return;
    }

    // Si no es admin, intentar login como CLIENTE
    const cliente = await autenticarUsuarioCliente(username, password);
    if (cliente) {
      router.push({ pathname: '../cliente/menu', params: { username } });
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
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
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>CONTRASEÑA</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresá tu contraseña"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.toggle}>
          {showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
        </Text>
      </TouchableOpacity>

      <Button title="INGRESAR" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#000' },
  title: { fontSize: 26, color: '#fff', textAlign: 'center', marginBottom: 30 },
  label: { color: '#fff', fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: '#fff'
  },
  toggle: {
    color: '#1E90FF',
    textAlign: 'right',
    marginBottom: 20
  }
});
