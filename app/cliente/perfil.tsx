import React from 'react';
import { StyleSheet, View } from 'react-native';
import HeaderCliente from '../../components/HeaderCliente';

export default function Perfil() {
  return (
    <View style={styles.container}>
      <HeaderCliente titulo="PERFIL" />
      {/* datos del perfil */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});
