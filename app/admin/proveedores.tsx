import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Proveedor = {
  id: string;
  nombre: string;
  telefono: string;
  direccion: string;
  pais: 'Paraguay' | 'Brasil';
  correo?: string;
  notas?: string;
};

export default function ProveedoresScreen() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nuevoProveedor, setNuevoProveedor] = useState<Proveedor>({
    id: '',
    nombre: '',
    telefono: '',
    direccion: '',
    pais: 'Paraguay',
    correo: '',
    notas: '',
  });

  const generarID = () => {
    const num = proveedores.length + 1;
    return num.toString().padStart(4, '0');
  };

  const handleGuardar = () => {
    if (!nuevoProveedor.nombre || !nuevoProveedor.telefono || !nuevoProveedor.direccion) {
      Alert.alert('Error', 'Completa todos los campos obligatorios.');
      return;
    }

    if (editandoId && editandoId !== 'nuevo') {
      const actualizados = proveedores.map((prov) =>
        prov.id === editandoId ? { ...nuevoProveedor, id: editandoId } : prov
      );
      setProveedores(actualizados);
    } else {
      const id = generarID();
      setProveedores([...proveedores, { ...nuevoProveedor, id }]);
    }

    setNuevoProveedor({
      id: '',
      nombre: '',
      telefono: '',
      direccion: '',
      pais: 'Paraguay',
      correo: '',
      notas: '',
    });
    setEditandoId(null);
  };

  const handleEliminar = (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro que deseas eliminar este proveedor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setProveedores(proveedores.filter((p) => p.id !== id));
            setEditandoId(null);
          },
        },
      ]
    );
  };

  const handleEditar = (proveedor: Proveedor) => {
    setNuevoProveedor(proveedor);
    setEditandoId(proveedor.id);
  };

  const handleCancelar = () => {
    setNuevoProveedor({
      id: '',
      nombre: '',
      telefono: '',
      direccion: '',
      pais: 'Paraguay',
      correo: '',
      notas: '',
    });
    setEditandoId(null);
  };

  const filtrados = proveedores.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre"
        placeholderTextColor="#aaa"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            {!editandoId || editandoId !== item.id ? (
              <TouchableOpacity onPress={() => handleEditar(item)}>
                <Text style={styles.ver}>VER</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      />

      {editandoId && (
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del local o empresa"
            placeholderTextColor="#aaa"
            value={nuevoProveedor.nombre}
            onChangeText={(text) => setNuevoProveedor({ ...nuevoProveedor, nombre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={nuevoProveedor.telefono}
            onChangeText={(text) => setNuevoProveedor({ ...nuevoProveedor, telefono: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            placeholderTextColor="#aaa"
            value={nuevoProveedor.direccion}
            onChangeText={(text) => setNuevoProveedor({ ...nuevoProveedor, direccion: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo (opcional)"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={nuevoProveedor.correo}
            onChangeText={(text) => setNuevoProveedor({ ...nuevoProveedor, correo: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Notas (opcional)"
            placeholderTextColor="#aaa"
            value={nuevoProveedor.notas}
            onChangeText={(text) => setNuevoProveedor({ ...nuevoProveedor, notas: text })}
          />

          {/* Dropdown País */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={nuevoProveedor.pais}
              onValueChange={(value) =>
                setNuevoProveedor({ ...nuevoProveedor, pais: value as 'Paraguay' | 'Brasil' })
              }
              dropdownIconColor="white"
              style={styles.picker}
            >
              <Picker.Item label="Paraguay" value="Paraguay" />
              <Picker.Item label="Brasil" value="Brasil" />
            </Picker>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.boton, { backgroundColor: '#4CAF50', marginRight: 5 }]}
              onPress={handleGuardar}
            >
              <Text style={styles.botonTexto}>GUARDAR CAMBIOS</Text>
            </TouchableOpacity>
            {editandoId !== 'nuevo' && (
              <TouchableOpacity
                style={[styles.boton, { backgroundColor: '#F44336', marginLeft: 5 }]}
                onPress={() => handleEliminar(nuevoProveedor.id)}
              >
                <Text style={styles.botonTexto}>ELIMINAR PROVEEDOR</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.boton, { backgroundColor: '#1E90FF', marginTop: 10 }]}
            onPress={handleCancelar}
          >
            <Text style={styles.botonTexto}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      )}

      {!editandoId && (
        <TouchableOpacity
          style={[styles.boton, { backgroundColor: '#1E90FF', marginTop: 20 }]}
          onPress={() => {
            setNuevoProveedor({
              id: '',
              nombre: '',
              telefono: '',
              direccion: '',
              pais: 'Paraguay',
              correo: '',
              notas: '',
            });
            setEditandoId('nuevo');
          }}
        >
          <Text style={styles.botonTexto}>AGREGAR NUEVO PROVEEDOR</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16,
  },
  input: {
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 6,
    marginBottom: 10,
  },
  picker: {
    color: 'white',
    backgroundColor: 'black',
    height: 50,
    width: '100%',
  },
  card: {
    borderColor: 'white',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  nombre: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ver: {
    color: '#1E90FF',
    marginTop: 5,
    fontWeight: 'bold',
  },
  boton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
