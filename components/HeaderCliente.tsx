import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HeaderCliente({ titulo }: { titulo: string }) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botonFlecha} onPress={() => router.replace('/cliente/menu-cliente')}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.titulo}>{titulo}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#5f2c56',
  },
  header: {
  flexDirection: 'row',
  alignItems: 'flex-end', // <-- alinea al fondo del header
  paddingBottom: 16,       // más espacio abajo
  paddingTop: 40,          // menos espacio arriba
  paddingHorizontal: 16,
  backgroundColor: '#5f2c56',
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
},

  titulo: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  botonFlecha: {
    backgroundColor: 'black',
    padding: 8,
    borderRadius: 8,
  },
});

