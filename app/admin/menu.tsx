import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const opciones = [
  { label: 'Productos', ruta: 'productos' },           // Edicion de los productos
  { label: 'Cargar Productos', ruta: 'cargar-producto' },   // Alta productos
  { label: 'Ver Pedidos', ruta: 'pedidos' },       // Ver pedidos realizados por clientes
  { label: 'Precios', ruta: 'modificar-precios' },     // Modificar precios de productos
  { label: 'Clientes', ruta: 'ver-clientes' },         // Añadir, buscar y editar clientes
  { label: 'Proveedores', ruta: 'proveedores' },       // Info de proveedores y vinculación con productos
  { label: 'Configuración', ruta: 'configuracion' },   // Modificar datos del admin
];

export default function MenuAdmin() {
  const router = useRouter();
  const username = 'ADMIN'; // podría venir por props o auth context

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Administración</Text>
      {opciones.map((op, i) => (
        <TouchableOpacity
          key={i}
          style={styles.button}
          onPress={() => router.push(`/admin/${op.ruta}` as any)}
        >
          <Text style={styles.buttonText}>{op.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
