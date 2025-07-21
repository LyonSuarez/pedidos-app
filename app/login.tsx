import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { db } from '../lib/firebase';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleLogin = async () => {
    if (username === 'ADMIN' && password === 'Lyonkpo2000.') {
      await AsyncStorage.setItem(
        'usuarioLogueado',
        JSON.stringify({
          username: 'ADMIN',
          password: 'Lyonkpo2000.',
          clientType: 'ADMIN',
        })
      );
      router.replace('/admin/menu');
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, 'clientes'));
      const usuario = snapshot.docs.find(doc => doc.data().username === username);

      if (!usuario) {
        Alert.alert('Error', 'Usuario no encontrado');
        return;
      }

      const data = usuario.data();
      if (data.password !== password) {
        Alert.alert('Error', 'Contraseña incorrecta');
        return;
      }

      await AsyncStorage.setItem(
        'usuarioLogueado',
        JSON.stringify({
          username: data.username,
          password: data.password,
          clientType: data.clientType || 'CF',
        })
      );

      router.replace('/cliente/menu-cliente');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un problema al iniciar sesión.');
    }
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
