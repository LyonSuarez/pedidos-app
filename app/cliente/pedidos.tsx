import React from 'react';
import { StyleSheet, View } from 'react-native';
import HeaderCliente from '../../components/HeaderCliente';

export default function Pedidos() {
  return (
    <View style={styles.container}>
      <HeaderCliente titulo="MIS PEDIDOS" />
      {/* contenido de pedidos */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});
