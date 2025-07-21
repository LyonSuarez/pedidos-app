import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderAdmin from '../../components/HeaderAdmin';
import { actualizarAdmin, obtenerAdmin } from '../../lib/firestoreAdmin';

export default function ConfiguracionScreen() {
  const router = useRouter();
  const [admin, setAdmin] = useState({ username: '', name: '', password: '' });
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [editandoPassword, setEditandoPassword] = useState(false);

  const [nombreTemp, setNombreTemp] = useState('');
  const [actualPassword, setActualPassword] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const [verActual, setVerActual] = useState(false);
  const [verNueva, setVerNueva] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);

  useEffect(() => {
    const cargarAdmin = async () => {
      try {
        const datos = await obtenerAdmin();
        setAdmin(datos as any);
        setNombreTemp((datos as any).name);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el usuario ADMIN.');
      }
    };
    cargarAdmin();
  }, []);

  const guardarNuevoNombre = async () => {
    if (!nombreTemp.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }

    await actualizarAdmin({ name: nombreTemp });
    setAdmin({ ...admin, name: nombreTemp });
    setEditandoNombre(false);
    Alert.alert('Éxito', 'Nombre actualizado correctamente.');
  };

  const guardarNuevaPassword = async () => {
    if (actualPassword !== admin.password) {
      Alert.alert('Error', 'La contraseña actual es incorrecta.');
      return;
    }

    if (!nuevaPassword || nuevaPassword !== confirmarPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden o están vacías.');
      return;
    }

    await actualizarAdmin({ password: nuevaPassword });
    setAdmin({ ...admin, password: nuevaPassword });
    setEditandoPassword(false);
    setActualPassword('');
    setNuevaPassword('');
    setConfirmarPassword('');
    Alert.alert('Éxito', 'Contraseña actualizada correctamente.');
  };

  return (
    <View style={styles.container}>

      <HeaderAdmin titulo="CONFIGURACIÓN" />

      <View style={styles.campo}>
        <Text style={styles.label}>Usuario:</Text>
        <Text style={styles.valor}>{admin.username}</Text>
      </View>

      <View style={styles.campo}>
        <Text style={styles.label}>Nombre:</Text>
        {editandoNombre ? (
          <>
            <TextInput
              style={styles.input}
              value={nombreTemp}
              onChangeText={setNombreTemp}
            />
            <TouchableOpacity
              style={styles.botonGuardar}
              onPress={guardarNuevoNombre}
            >
              <Text style={styles.botonTexto}>GUARDAR</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.valor}>{admin.name}</Text>
            <TouchableOpacity onPress={() => setEditandoNombre(true)}>
              <Text style={styles.link}>Cambiar nombre</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.campo}>
        <Text style={styles.label}>Contraseña:</Text>
        <Text style={styles.valor}>********</Text>
        {!editandoPassword && (
          <TouchableOpacity onPress={() => setEditandoPassword(true)}>
            <Text style={styles.link}>Cambiar contraseña</Text>
          </TouchableOpacity>
        )}
      </View>

      {editandoPassword && (
        <>
          <View style={styles.inputConIcono}>
            <TextInput
              style={styles.inputInterno}
              placeholder="Contraseña actual"
              placeholderTextColor="#aaa"
              secureTextEntry={!verActual}
              value={actualPassword}
              onChangeText={setActualPassword}
            />
            <TouchableOpacity onPress={() => setVerActual(!verActual)}>
              <Ionicons name={verActual ? 'eye-off' : 'eye'} size={22} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputConIcono}>
            <TextInput
              style={styles.inputInterno}
              placeholder="Nueva contraseña"
              placeholderTextColor="#aaa"
              secureTextEntry={!verNueva}
              value={nuevaPassword}
              onChangeText={setNuevaPassword}
            />
            <TouchableOpacity onPress={() => setVerNueva(!verNueva)}>
              <Ionicons name={verNueva ? 'eye-off' : 'eye'} size={22} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputConIcono}>
            <TextInput
              style={styles.inputInterno}
              placeholder="Confirmar nueva contraseña"
              placeholderTextColor="#aaa"
              secureTextEntry={!verConfirmar}
              value={confirmarPassword}
              onChangeText={setConfirmarPassword}
            />
            <TouchableOpacity onPress={() => setVerConfirmar(!verConfirmar)}>
              <Ionicons name={verConfirmar ? 'eye-off' : 'eye'} size={22} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.botonGuardar} onPress={guardarNuevaPassword}>
            <Text style={styles.botonTexto}>GUARDAR</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  titulo: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  campo: { marginBottom: 20 },
  label: { color: '#aaa', fontSize: 16 },
  valor: { color: 'white', fontSize: 18, marginTop: 5 },
  input: { backgroundColor: '#222', color: 'white', padding: 10, borderRadius: 5, marginTop: 10 },
  botonGuardar: { backgroundColor: '#1E90FF', padding: 12, borderRadius: 5, marginTop: 10, alignItems: 'center' },
  botonTexto: { color: 'white', fontWeight: 'bold' },
  link: { color: '#1E90FF', marginTop: 10, fontSize: 14 },
  inputConIcono: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputInterno: {
    flex: 1,
    color: 'white',
    paddingVertical: 10,
  },
});
