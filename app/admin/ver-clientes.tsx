import { Picker } from '@react-native-picker/picker';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { users as initialUsers, User } from '../../lib/users';

export default function VerClientes() {
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([...initialUsers]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const navigation = useNavigation();

  // 🧠 Generador de ID incremental único
  const generarNuevoId = (): string => {
    const idsNumericos = filteredUsers
      .map((u) => parseInt(u.id || '0'))
      .filter((n) => !isNaN(n));
    const maxId = Math.max(0, ...idsNumericos);
    return String(maxId + 1).padStart(4, '0');
  };

  // 🧠 Generador de nombre de usuario único tipo cliente0001
  const generarNuevoUsername = (): string => {
    let numero = 1;
    while (filteredUsers.some((u) => u.username === `cliente${numero}`)) {
      numero++;
    }
    return `cliente${numero}`;
  };

  // ➕ AGREGAR CLIENTE NUEVO
  const agregarCliente = () => {
    const nuevo: User = {
      id: generarNuevoId(),
      username: generarNuevoUsername(),
      password: '',
      name: '',
      clientType: undefined,
      dni: '',
      telefono: '',
      direccion: '',
      role: 'cliente',
      online: false,
      firstLogin: true
    };
    setFilteredUsers([...filteredUsers, nuevo]);
    setExpanded({ ...expanded, [nuevo.username]: true });
  };

  // ✏️ CAMBIO DE CAMPO
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

  // 💾 GUARDAR CLIENTE
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

  // ❌ ELIMINAR CLIENTE
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

  // 🔍 FILTRAR
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
        <TouchableOpacity onPress={agregarCliente} style={styles.addButton}>
          <Text style={{ color: 'white' }}>AGREGAR</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUsers.filter((u) => u.role !== 'admin')}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={styles.clientCard}>
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
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16
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
