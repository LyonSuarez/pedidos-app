import { router } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleLogin = () => {
    router.push('/admin/menu');
  };

  return (
    <ImageBackground
      source={require('../assets/menu/fondoapp.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <Animatable.Text animation="fadeInDown" duration={800} style={styles.titulo}>
        Inicio de Sesión
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" delay={300} duration={900} style={styles.cuadro}>
        <Text style={styles.label}>USUARIO</Text>
        <TextInput
          placeholder="Ingresá tu usuario"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <Text style={styles.label}>CONTRASEÑA</Text>
        <TextInput
          placeholder="Ingresá tu contraseña"
          placeholderTextColor="#888"
          secureTextEntry={!mostrarPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
          <Text style={styles.ver}>Ver contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton} onPress={handleLogin}>
          <Text style={styles.textoBoton}>INGRESAR</Text>
        </TouchableOpacity>
      </Animatable.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  titulo: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    backgroundColor: 'black',
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 12,
    marginBottom: 20,
  },
  cuadro: {
    backgroundColor: 'black',
    padding: 25,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  ver: {
    alignSelf: 'flex-end',
    color: '#3399FF',
    marginTop: 8,
    marginBottom: 16,
  },
  boton: {
    backgroundColor: '#3399FF',
    padding: 14,
    borderRadius: 5,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
  },
});

