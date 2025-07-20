import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const opciones = [
  { label: 'Productos', ruta: 'productos' },
  { label: 'Cargar Productos', ruta: 'cargar-producto' },
  { label: 'Ver Pedidos', ruta: 'pedidos' },
  { label: 'Precios', ruta: 'modificar-precios' },
  { label: 'Clientes', ruta: 'ver-clientes' },
  { label: 'Proveedores', ruta: 'proveedores' },
];

export default function MenuAdmin() {
  const router = useRouter();
  const [key, setKey] = useState(Date.now());

  useFocusEffect(
    React.useCallback(() => {
      setKey(Date.now());
    }, [])
  );

  return (
    <ImageBackground
      key={key}
      source={require('../../assets/menu/fondoapp.png')}
      style={styles.fondo}
    >
      {/* Configuración */}
      <TouchableOpacity
        style={styles.iconoEngranaje}
        onPress={() => router.push('/admin/configuracion')}
      >
        <Image
          source={require('../../assets/menu/cuadrado.png')}
          style={styles.baseIconoGrande}
        />
        <Image
          source={require('../../assets/menu/engranaje.png')}
          style={styles.iconoCentrado}
        />
      </TouchableOpacity>

      {/* Volver */}
      <TouchableOpacity
        style={styles.iconoFlecha}
        onPress={() => router.push('/login')}
      >
        <Image
          source={require('../../assets/menu/cuadrado.png')}
          style={styles.baseIconoGrande}
        />
        <Image
          source={require('../../assets/menu/flecha.png')}
          style={styles.iconoCentrado}
        />
      </TouchableOpacity>

      {/* Título animado */}
      <Animatable.Text animation="fadeInDown" duration={800} style={styles.titulo}>
        INICIO
      </Animatable.Text>

      <View style={styles.contenedorBotones}>
        {opciones.map((op, i) => (
          <Animatable.View
            key={i}
            animation="fadeInUp"
            delay={i * 200}
            duration={700}
            easing="ease-out-back"
            style={styles.botonContenedor}
          >
            <TouchableOpacity
              onPress={() => router.push(`/admin/${op.ruta}` as any)}
              style={styles.botonTouchable}
              activeOpacity={0.85}
            >
              <Image
                source={require('../../assets/menu/rectangulo.png')}
                style={styles.botonFondo}
              />
              <View style={styles.circuloDecorativo} />
              <Text style={styles.botonTexto}>{op.label}</Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    resizeMode: 'cover',
    paddingHorizontal: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  contenedorBotones: {
    width: '100%',
    alignItems: 'center',
  },
  botonContenedor: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  botonTouchable: {
    width: '100%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonFondo: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  botonTexto: {
    position: 'absolute',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  circuloDecorativo: {
    position: 'absolute',
    left: -14,
    top: '50%',
    marginTop: -12,
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    zIndex: 10,
  },
  iconoFlecha: {
    position: 'absolute',
    top: 30,
    left: 20,
    width: 60,
    height: 60,
  },
  iconoEngranaje: {
    position: 'absolute',
    top: 30,
    right: 20,
    width: 60,
    height: 60,
  },
  baseIconoGrande: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    position: 'absolute',
  },
  iconoCentrado: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 9,
  },
});

