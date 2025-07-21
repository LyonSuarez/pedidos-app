import React from 'react';
import { StyleSheet, View } from 'react-native';
import HeaderCliente from '../../components/HeaderCliente';

export default function Carrito() {
  return (
    <View style={styles.container}>
      <HeaderCliente titulo="CARRITO" />
      {/* contenido del carrito */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});
