// app/admin/categorias.tsx
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderAdmin from '../../components/HeaderAdmin';
import {
  agregarCategoria,
  agregarMarcaACategoria,
  editarNombreCategoria,
  eliminarCategoria,
  eliminarMarcaDeCategoria,
  obtenerCategoriasDesdeFirestore,
} from '../../lib/fireCategorias';


interface Categoria {
  id: string;
  nombre: string;
  marcas: string[];
}

const CategoriasScreen = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [editandoCategoriaId, setEditandoCategoriaId] = useState<string | null>(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [nuevasMarcas, setNuevasMarcas] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    const data = await obtenerCategoriasDesdeFirestore();
    setCategorias(data as Categoria[]);
  };

  const manejarAgregarCategoria = async () => {
    if (!nuevaCategoria.trim()) return;
    await agregarCategoria(nuevaCategoria.trim());
    setNuevaCategoria('');
    cargarCategorias();
  };

  const manejarEliminarCategoria = (id: string, nombre: string) => {
    Alert.alert(
      'Eliminar Categoría',
      `¿Seguro que querés eliminar la categoría "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await eliminarCategoria(id);
            cargarCategorias();
          },
        },
      ]
    );
  };

  const manejarEditarCategoria = async (id: string) => {
    if (!nombreEditado.trim()) return;
    await editarNombreCategoria(id, nombreEditado.trim());
    setEditandoCategoriaId(null);
    setNombreEditado('');
    cargarCategorias();
  };

  const manejarAgregarMarca = async (id: string) => {
    const nuevaMarca = nuevasMarcas[id]?.trim();
    if (!nuevaMarca) return;
    await agregarMarcaACategoria(id, nuevaMarca);
    setNuevasMarcas(prev => ({ ...prev, [id]: '' }));
    cargarCategorias();
  };

  const manejarEliminarMarca = async (idCategoria: string, marca: string) => {
    await eliminarMarcaDeCategoria(idCategoria, marca);
    cargarCategorias();
  };

  const renderCategoria = ({ item }: { item: Categoria }) => {
    const estaEditando = editandoCategoriaId === item.id;
    return (
      <View style={styles.card}>
        {estaEditando ? (
          <>
            <TextInput
              style={styles.input}
              value={nombreEditado}
              onChangeText={setNombreEditado}
              placeholder="Nuevo nombre"
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity style={styles.botonGuardar} onPress={() => manejarEditarCategoria(item.id)}>
              <Text style={styles.botonTexto}>GUARDAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonCancelar} onPress={() => setEditandoCategoriaId(null)}>
              <Text style={styles.botonTexto}>CANCELAR</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.titulo}>{item.nombre}</Text>
            <TouchableOpacity style={styles.botonEditar} onPress={() => {
              setEditandoCategoriaId(item.id);
              setNombreEditado(item.nombre);
            }}>
              <Text style={styles.botonTexto}>EDITAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonEliminar} onPress={() => manejarEliminarCategoria(item.id, item.nombre)}>
              <Text style={styles.botonTexto}>ELIMINAR CATEGORÍA</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.subtitulo}>Marcas:</Text>
        {item.marcas.map(marca => (
          <View key={marca} style={styles.marcaFila}>
            <Text style={styles.marcaTexto}>{marca}</Text>
            <TouchableOpacity onPress={() => manejarEliminarMarca(item.id, marca)}>
              <Text style={styles.marcaEliminar}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.agregarMarcaContenedor}>
          <TextInput
            style={styles.input}
            placeholder="Agregar marca"
            placeholderTextColor="#ccc"
            value={nuevasMarcas[item.id] || ''}
            onChangeText={text =>
              setNuevasMarcas(prev => ({ ...prev, [item.id]: text }))
            }
          />
          <TouchableOpacity
            style={styles.botonAgregarMarca}
            onPress={() => manejarAgregarMarca(item.id)}
          >
            <Text style={styles.botonTexto}>AÑADIR</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderAdmin titulo="CATEGORÍAS" />

      <View style={styles.agregarContenedor}>
        <TextInput
          style={styles.input}
          placeholder="Nueva categoría"
          placeholderTextColor="#ccc"
          value={nuevaCategoria}
          onChangeText={setNuevaCategoria}
        />
        <TouchableOpacity style={styles.botonAgregarCategoria} onPress={manejarAgregarCategoria}>
          <Text style={styles.botonTexto}>CREAR</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categorias}
        keyExtractor={item => item.id}
        renderItem={renderCategoria}
      />
    </View>
  );
};

export default CategoriasScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', padding: 16 },
  tituloSeccion: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#111', padding: 14, borderRadius: 10, marginBottom: 20 },
  titulo: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  subtitulo: { color: '#ccc', fontSize: 14, marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: '#222', color: 'white', padding: 10, borderRadius: 6, marginBottom: 8 },
  botonAgregarCategoria: { backgroundColor: '#1E90FF', padding: 10, borderRadius: 6, marginLeft: 8 },
  botonAgregarMarca: { backgroundColor: '#28a745', padding: 10, borderRadius: 6, marginTop: 8 },
  botonEditar: { backgroundColor: '#444', padding: 8, borderRadius: 6, marginTop: 8 },
  botonEliminar: { backgroundColor: '#b22222', padding: 8, borderRadius: 6, marginTop: 8 },
  botonGuardar: { backgroundColor: '#007bff', padding: 8, borderRadius: 6, marginTop: 8 },
  botonCancelar: { backgroundColor: '#888', padding: 8, borderRadius: 6, marginTop: 8 },
  botonTexto: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  agregarContenedor: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  agregarMarcaContenedor: { marginTop: 12 },
  marcaFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    padding: 8,
    borderRadius: 5,
    marginBottom: 4,
  },
  marcaTexto: { color: 'white' },
  marcaEliminar: { color: '#ff4d4d', fontWeight: 'bold', fontSize: 16 },
});
