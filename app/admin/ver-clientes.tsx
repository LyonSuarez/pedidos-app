import { Picker } from '@react-native-picker/picker';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
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
import { guardarClienteEnFirestore } from '../../lib/firestoreClient'; // NUEVO
import { users as initialUsers, User } from '../../lib/users';

export default function VerClientes() {
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([...initialUsers]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const navigation = useNavigation();

  const generarNuevoId = (): string => {
    const idsNumericos = filteredUsers
      .map((u) => parseInt(u.id || '0'))
      .filter((n) => !isNaN(n));
    const maxId = Math.max(0, ...idsNumericos);
    return String(maxId + 1).padStart(4, '0');
  };

  const generarNuevoUsername = (): string => {
    let numero = 1;
    while (filteredUsers.some((u) => u.username === `cliente${numero}`)) {
      numero++;
    }
    return `cliente${numero}`;
  };

  const handleAgregarCliente = async () => {
    const nuevo: User = {
      id: generarNuevoId(),
      username: generarNuevoUsername(),
      password: '',
      name: '',
      clientType: 'CF',
      dni: '',
      telefono: '',
      direccion: '',
      role: 'cliente',
      online: false,
      firstLogin: true
    };

    const exito = await guardarClienteEnFirestore(nuevo);
    if (exito) {
      setFilteredUsers([...filteredUsers, nuevo]);
      setExpanded({ ...expanded, [nuevo.username]: true });
    } else {
      Alert.alert('Error', 'No se pudo guardar el cliente.');
    }
  };

  const handleInputChange = (
    username: string,
    field: keyof User,
    value: string
  ) => {
    const index = filteredUsers.findIndex((u) => u.username === username);
    if (index !== -1) {
      const copia = [...filteredUsers];
      (copia[index][field] as string | undefined) = value;
      setFilteredUsers(copia);
    }
  };

  const handleSave = (username: string) => {
    const user = filteredUsers.find((u) => u.username === username);
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
    if (!/^\d+$/.test(user.dni)) {
      Alert.alert('Error', 'El DNI debe ser solo numérico.');
      return;
    }

    Alert.alert('CLIENTE GUARDADO');
    setExpanded({ ...expanded, [username]: false });
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
            const nuevos = filteredUsers.filter((u) => u.username !== username);
            setFilteredUsers(nuevos);
          }
        }
      ]
    );
  };

  const filterUsers = () => {
    const term = search.toLowerCase();
    const result = initialUsers.filter(
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
        <TouchableOpacity onPress={handleAgregarCliente} style={styles.addButton}>
          <Text style={{ color: 'white' }}>AGREGAR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 100 }}>
        {filteredUsers
          .filter((u) => u.role !== 'admin')
          .map((item) => (
            <View key={item.username} style={styles.clientCard}>
              <Text style={styles.clientName}>{item.name || item.username}</Text>

              {!expanded[item.username] && (
                <TouchableOpacity
                  onPress={() => setExpanded({ ...expanded, [item.username]: true })}
                  style={styles.viewButton}
                >
                  <Text style={styles.viewButtonText}>VER</Text>
                </TouchableOpacity>
              )}

              {expanded[item.username] && (
                <View>
                  <TextInput
                    value={item.username}
                    editable={false}
                    style={styles.input}
                    placeholder="Usuario"
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    value={item.name}
                    onChangeText={(text) =>
                      handleInputChange(item.username, 'name', text)
                    }
                    style={styles.input}
                    placeholder="Nombre"
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    value={item.password}
                    onChangeText={(text) =>
                      handleInputChange(item.username, 'password', text)
                    }
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#999"
                  />
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={item.clientType}
                      onValueChange={(value: "CF" | "Mayorista" | "") =>
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
                    onChangeText={(text) =>
                      handleInputChange(item.username, 'dni', text)
                    }
                    style={styles.input}
                    placeholder="DNI"
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    value={item.telefono}
                    onChangeText={(text) =>
                      handleInputChange(item.username, 'telefono', text)
                    }
                    style={styles.input}
                    placeholder="Teléfono"
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    value={item.direccion}
                    onChangeText={(text) =>
                      handleInputChange(item.username, 'direccion', text)
                    }
                    style={styles.input}
                    placeholder="Dirección"
                    placeholderTextColor="#999"
                  />

                  <Button
                    title="Guardar Cambios"
                    color="#4CAF50"
                    onPress={() => handleSave(item.username)}
                  />
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
                      const esNuevo = !initialUsers.some(u => u.username === item.username);
                      if (esNuevo) {
                        const nuevos = filteredUsers.filter((u) => u.username !== item.username);
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
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: 'black'
  },
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
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  viewButton: {
    marginTop: 8,
    backgroundColor: '#0080ff',
    padding: 6,
    borderRadius: 5
  },
  viewButtonText: {
    color: 'white',
    textAlign: 'center'
  },
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
  picker: {
    color: 'white',
    backgroundColor: 'black'
  }
});
