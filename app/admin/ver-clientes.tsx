import { Picker } from '@react-native-picker/picker';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { guardarClienteEnFirestore, obtenerClientesDesdeFirestore } from '../../lib/firestoreClient';
import { User } from '../../lib/users';

export default function VerClientes() {
  const [search, setSearch] = useState('');
  const [clientes, setClientes] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const navigation = useNavigation();

  useEffect(() => {
    const cargarClientes = async () => {
      const clientesObtenidos = await obtenerClientesDesdeFirestore();
      setClientes(clientesObtenidos);
      setFilteredUsers(clientesObtenidos);
    };
    cargarClientes();
  }, []);

  const generarNuevoId = (): string => {
    const idsNumericos = clientes
      .map((u) => parseInt(u.id || '0'))
      .filter((n) => !isNaN(n));
    const maxId = Math.max(0, ...idsNumericos);
    return String(maxId + 1).padStart(4, '0');
  };

  const generarNuevoUsername = (): string => {
    let numero = 1;
    while (clientes.some((u) => u.username === `cliente${numero}`)) {
      numero++;
    }
    return `cliente${numero}`;
  };

  const agregarCliente = () => {
    const nuevo: User = {
      id: generarNuevoId(),
      username: generarNuevoUsername(),
      password: '',
      name: '',
      clientType: '',
      dni: '',
      telefono: '',
      direccion: '',
      role: 'cliente',
      online: false,
      firstLogin: true
    };
    const actualizados = [...clientes, nuevo];
    setClientes(actualizados);
    setFilteredUsers(actualizados);
    setExpanded({ ...expanded, [nuevo.username]: true });
  };

  const handleInputChange = (
    username: string,
    field: keyof User,
    value: string
  ) => {
    const index = clientes.findIndex((u) => u.username === username);
    if (index !== -1) {
      const copia = [...clientes];
      (copia[index][field] as string | undefined) = value;
      setClientes(copia);
      setFilteredUsers(copia);
    }
  };

  const handleSave = async (username: string) => {
    const user = clientes.find((u) => u.username === username);
    if (
      !user?.name?.trim() ||
      !user?.password?.trim() ||
      !user?.clientType?.trim() ||
      !user?.dni?.trim() ||
      !user?.telefono?.trim() ||
      !user?.direccion?.trim()
    ) {
      Alert.alert('Error', 'Todos los campos deben estar completos.');
      return;
    }
    if (!/^[0-9]+$/.test(user.dni)) {
      Alert.alert('Error', 'El DNI debe ser solo numérico.');
      return;
    }

    const exito = await guardarClienteEnFirestore(user);
    if (exito) {
      Alert.alert('CLIENTE GUARDADO');
      setExpanded({ ...expanded, [username]: false });
    } else {
      Alert.alert('Error', 'Hubo un problema al guardar el cliente.');
    }
  };

  const handleDelete = (username: string, name: string) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro que deseas eliminar a este Cliente (${name})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const nuevos = clientes.filter((u) => u.username !== username);
            setClientes(nuevos);
            setFilteredUsers(nuevos);
          }
        }
      ]
    );
  };

  const filterUsers = () => {
    const term = search.toLowerCase();
    const result = clientes.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term) ||
        (u.id && u.id.toLowerCase().includes(term))
    );
    setFilteredUsers(result);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <TextInput
          placeholder="Buscar por nombre, ID o usuario"
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            filterUsers();
          }}
          style={[styles.searchInput, { flex: 1 }]}
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={agregarCliente} style={styles.addButton}>
          <Text style={{ color: 'white' }}>AGREGAR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 100 }}>
        {filteredUsers.map((item) => (
          <View key={`${item.id}_${item.username}`} style={styles.clientCard}>
            <Text style={styles.clientName}>{item.name || item.username}</Text>

            {!expanded[item.username] && (
              <TouchableOpacity
                onPress={() =>
                  setExpanded({ ...expanded, [item.username]: true })
                }
                style={styles.viewButton}
              >
                <Text style={styles.viewButtonText}>VER</Text>
              </TouchableOpacity>
            )}

            {expanded[item.username] && (
              <View>
                <TextInput value={item.username} editable={false} style={styles.input} />
                <TextInput
                  value={item.name}
                  onChangeText={(text) => handleInputChange(item.username, 'name', text)}
                  style={styles.input}
                  placeholder="Nombre"
                  placeholderTextColor="#999"
                />
                <TextInput
                  value={item.password}
                  onChangeText={(text) => handleInputChange(item.username, 'password', text)}
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#999"
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={item.clientType}
                    onValueChange={(value: 'CF' | 'Mayorista' | '') =>
                      handleInputChange(item.username, 'clientType', value)
                    }
                    style={styles.picker}
                    dropdownIconColor="white"
                  >
                    <Picker.Item label="Seleccionar tipo" value="" />
                    <Picker.Item label="CF" value="CF" />
                    <Picker.Item label="Mayorista" value="Mayorista" />
                  </Picker>
                </View>
                <TextInput
                  value={item.dni}
                  keyboardType="numeric"
                  onChangeText={(text) => handleInputChange(item.username, 'dni', text)}
                  style={styles.input}
                  placeholder="DNI"
                  placeholderTextColor="#999"
                />
                <TextInput
                  value={item.telefono}
                  onChangeText={(text) => handleInputChange(item.username, 'telefono', text)}
                  style={styles.input}
                  placeholder="Teléfono"
                  placeholderTextColor="#999"
                />
                <TextInput
                  value={item.direccion}
                  onChangeText={(text) => handleInputChange(item.username, 'direccion', text)}
                  style={styles.input}
                  placeholder="Dirección"
                  placeholderTextColor="#999"
                />
                <Button title="Guardar Cambios" color="#4CAF50" onPress={() => handleSave(item.username)} />
                <View style={{ height: 8 }} />
                <Button
                  title="Eliminar Cliente"
                  color="#FF4444"
                  onPress={() => handleDelete(item.username, item.name || '')}
                />
                <View style={{ height: 8 }} />
                <Button
                  title="Cancelar"
                  color="#1E90FF"
                  onPress={() => {
                    const esNuevo = !item.name?.trim();
                    if (esNuevo) {
                      const nuevos = clientes.filter((u) => u.username !== item.username);
                      setClientes(nuevos);
                      setFilteredUsers(nuevos);
                    }
                    setExpanded({ ...expanded, [item.username]: false });
                  }}
                />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: 'black' },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: 'white',
    padding: 8,
    borderRadius: 5,
    marginRight: 8
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 5
  },
  clientCard: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10
  },
  clientName: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  viewButton: {
    marginTop: 8,
    backgroundColor: '#0080ff',
    padding: 6,
    borderRadius: 5
  },
  viewButtonText: { color: 'white', textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
    color: 'white'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    marginVertical: 5
  },
  picker: { color: 'white', backgroundColor: 'black' }
});
