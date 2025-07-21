import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { BackHandler, FlatList, Image, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../lib/firebase';
import { Producto, ProductoEnCarrito } from '../../lib/types';

export default function MenuCliente() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [productosCarrito, setProductosCarrito] = useState<ProductoEnCarrito[]>([]);
  const [totalUSD, setTotalUSD] = useState(0);
  const [totalARS, setTotalARS] = useState(0);

  const obtenerProductos = async () => {
  const snapshot = await getDocs(collection(db, 'productos'));
  const productosRandom: Producto[] = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Producto, 'id'>),
    }))
    .sort(() => 0.5 - Math.random())
    .slice(0, 6);

  setProductos(productosRandom);
};


  useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    // Evita volver a la pantalla anterior (admin)
    return true;
  });

  return () => backHandler.remove();
}, []);





  const cancelarCarrito = () => {
    setProductosCarrito([]);
    setTotalUSD(0);
    setTotalARS(0);
    setCarritoVisible(false);
  };

  return (
    <ImageBackground source={require('../../assets/menu/fondoapp.png')} style={styles.background}>
      {/* Botones superiores */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Image source={require('../../assets/menu/hamburguesa.png')} style={styles.iconoMenu} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCarritoVisible(true)} style={styles.carritoContador}>
          <Image source={require('../../assets/menu/carrito.png')} style={styles.iconoCarrito} />
          {productosCarrito.length > 0 && (
            <View style={styles.contadorCarrito}>
              <Text style={styles.numeroContador}>{productosCarrito.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>IZI PEDIDOS</Text>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.filaProductos}
        renderItem={({ item }) => (
          <View style={styles.cardProducto}>
            {item.imagen ? (
              <Image source={{ uri: item.imagen }} style={styles.imagenProducto} />
            ) : (
              <View style={styles.imagenProducto}><Text style={styles.textoSinImagen}>Sin imagen</Text></View>
            )}
            <Text style={styles.nombreProducto}>{item.descripcionCorta}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.botonComprar} onPress={() => router.push('/cliente/productos')}>
        <Text style={styles.textoBotonComprar}>COMENZAR A COMPRAR</Text>
      </TouchableOpacity>

      {/* Menú lateral */}
      {menuVisible && (
  <View style={styles.menuLateral}>
    <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.flechaAtras}>
      <Ionicons name="arrow-back" size={28} color="white" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.push('/cliente/productos')}>
      <Text style={styles.opcionMenu}>Productos</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.push('/cliente/pedidos')}>
      <Text style={styles.opcionMenu}>Pedidos</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.push('/cliente/perfil')}>
      <Text style={styles.opcionMenu}>Perfil</Text>
    </TouchableOpacity>

    {/* Botón SALIR al final del menú */}
    <TouchableOpacity
      onPress={() => router.replace('/login')}
      style={{
        backgroundColor: '#8B0000', // rojo vino
        padding: 14,
        borderRadius: 12,
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        width: '80%',
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Salir</Text>
    </TouchableOpacity>
  </View>
)}


      {/* Carrito modal */}
      <Modal visible={carritoVisible} transparent animationType="slide">
        <View style={styles.modalFondo}>
          <View style={styles.modalCarrito}>
            <Text style={styles.tituloCarrito}>Carrito de compra</Text>
            {productosCarrito.length === 0 ? (
              <Text>No hay productos en el carrito.</Text>
            ) : (
              productosCarrito.map(prod => (
                <Text key={prod.id}>{prod.nombre} x{prod.cantidad}</Text>
              ))
            )}
            <Text>Total (USD): ${totalUSD}</Text>
            <Text>Total (ARS): ${totalARS}</Text>

            <View style={styles.botonesCarrito}>
              <TouchableOpacity onPress={() => router.push('/cliente/carrito')} style={[styles.botonAccion, { backgroundColor: 'green' }]}> 
                <Text style={styles.textoBoton}>CONFIRMAR</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelarCarrito} style={[styles.botonAccion, { backgroundColor: 'crimson' }]}> 
                <Text style={styles.textoBoton}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 12,
  },
  iconoMenu: { width: 32, height: 32 },
  iconoCarrito: { width: 32, height: 32 },
  carritoContador: { position: 'relative' },
  contadorCarrito: {
    position: 'absolute', top: -6, right: -6,
    backgroundColor: 'red', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2,
  },
  numeroContador: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  titulo: {
    fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 16,
  },
  filaProductos: { justifyContent: 'space-around', marginBottom: 12 },
  cardProducto: { alignItems: 'center', width: '45%' },
  imagenProducto: { width: 100, height: 100, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  textoSinImagen: { color: 'white' },
  nombreProducto: { color: 'white', marginTop: 6 },
  botonComprar: {
    backgroundColor: 'purple', padding: 14, margin: 20, borderRadius: 8,
  },
  textoBotonComprar: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  menuLateral: {
    position: 'absolute', top: 0, left: 0, bottom: 0,
    width: '60%', backgroundColor: '#5f2c56', paddingTop: 60, paddingHorizontal: 20,
  },
  flechaAtras: { position: 'absolute', top: 20, left: 12 },
  opcionMenu: { color: 'white', fontSize: 18, marginVertical: 16 },
  modalFondo: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)'
  },
  modalCarrito: {
    backgroundColor: 'white', padding: 20, borderRadius: 12, width: '80%',
  },
  tituloCarrito: { fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
  botonesCarrito: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  botonAccion: { padding: 12, borderRadius: 8 },
  textoBoton: { color: 'white', fontWeight: 'bold' },
});