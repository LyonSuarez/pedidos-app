import React from 'react';
import { StyleSheet, View } from 'react-native';
import HeaderCliente from '../../components/HeaderCliente';

export default function Productos() {
  return (
    <View style={styles.container}>
      <HeaderCliente titulo="PRODUCTOS" />
      {/* listado de productos */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});
