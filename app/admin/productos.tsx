// productos.tsx
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderAdmin from '../../components/HeaderAdmin';
import { db } from '../../lib/firebase';
import { obtenerCategoriasDesdeFirestore } from '../../lib/fireCategorias';
import { obtenerUltimasCotizaciones } from '../../lib/firestoreCotizaciones';
import { Producto } from '../../lib/types';
import { styles } from '../../styles/productosStyles.styles';

interface CategoriaFirestore {
  id: string;
  nombre: string;
  marcas: string[];
}

const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<CategoriaFirestore[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [desplegado, setDesplegado] = useState<string | null>(null);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [cotizaciones, setCotizaciones] = useState<{ dolar: number; real: number }>({ dolar: 0, real: 0 });
  const [modoEdicion, setModoEdicion] = useState<string | null>(null);
  const [datosEditables, setDatosEditables] = useState<any>({});

  useEffect(() => {
    cargarTodo();
  }, []);

  useEffect(() => {
    if (seleccionados.length === 0) {
      setModoSeleccion(false);
    }
  }, [seleccionados]);

  const cargarTodo = async () => {
    const snapshotProductos = await getDocs(collection(db, 'productos'));
    const listaProductos = snapshotProductos.docs.map(doc => ({ id: doc.id, ...doc.data() } as Producto));
    setProductos(listaProductos);

    const snapshotProveedores = await getDocs(collection(db, 'proveedores'));
    const listaProveedores = snapshotProveedores.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProveedores(listaProveedores);

    const listaCategorias = await obtenerCategoriasDesdeFirestore();
    setCategorias(listaCategorias as CategoriaFirestore[]);

    const data = await obtenerUltimasCotizaciones();
    setCotizaciones({
      dolar: parseFloat(data.dolar?.precio || '0'),
      real: parseFloat(data.real?.precio || '0'),
    });
  };

  const toggleSeleccion = (id: string) => {
    if (!modoSeleccion) return;
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const iniciarSeleccion = (id: string) => {
    setModoSeleccion(true);
    setSeleccionados([id]);
  };

  const eliminarSeleccionados = async () => {
    Alert.alert(
      '¿Estás seguro?',
      `¿Desea eliminar ${seleccionados.length} productos seleccionados?`,
      [
        { text: 'CANCELAR', style: 'cancel' },
        {
          text: 'CONFIRMAR',
          onPress: async () => {
            await Promise.all(
              seleccionados.map(id => deleteDoc(doc(db, 'productos', id)))
            );
            setSeleccionados([]);
            setModoSeleccion(false);
            cargarTodo();
          },
        },
      ]
    );
  };

  const guardarCambios = async () => {
    if (!modoEdicion) return;
    const docRef = doc(db, 'productos', modoEdicion);
    await updateDoc(docRef, {
      descripcion: datosEditables.descripcion,
      descripcionCorta: datosEditables.descripcionCorta,
      tipoMoneda: datosEditables.tipoMoneda,
      precio: parseFloat(parseFloat(datosEditables.precio).toFixed(2)),
      proveedorId: datosEditables.proveedorId,
      categoria: datosEditables.categoria,
      marca: datosEditables.marca,
    });
    setModoEdicion(null);
    cargarTodo();
  };

  const productosFiltrados = productos.filter(prod => {
    const texto = busqueda.toLowerCase();
    return (
      prod.codigo.toLowerCase().includes(texto) ||
      prod.descripcionCorta.toLowerCase().includes(texto) ||
      prod.proveedorId?.toLowerCase().includes(texto)
    );
  });

  const renderItem = ({ item }: { item: Producto }) => {
    const proveedor = proveedores.find(p => p.id === item.proveedorId);
    const estaDesplegado = desplegado === item.id;
    const seleccionado = seleccionados.includes(item.id);
    const estaEditando = modoEdicion === item.id;
    const precioARS = item.tipoMoneda === 'DOLAR' ? item.precio * cotizaciones.dolar : item.tipoMoneda === 'REAL' ? item.precio * cotizaciones.real : 0;

    const marcasDisponibles = categorias.find(c => c.nombre === datosEditables.categoria)?.marcas || [];

    return (
      <TouchableOpacity
        onLongPress={() => iniciarSeleccion(item.id)}
        onPress={() => toggleSeleccion(item.id)}
        activeOpacity={modoSeleccion ? 0.7 : 1}
      >
        <View style={[styles.card, seleccionado && styles.imagenSeleccionada]}>
          <View style={styles.cardSuperior}>
            {item.imagen ? (
              <Image source={{ uri: item.imagen }} style={styles.imagenCuadrada} />
            ) : (
              <View style={styles.imagenCuadrada}>
                <Text style={styles.imagenTexto}>Sin imagen</Text>
              </View>
            )}
            <View style={styles.detalleProducto}>
              <Text style={styles.codigoTexto}>{item.codigo}</Text>
              <Text style={styles.descripcionTexto}>{item.descripcionCorta}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setDesplegado(estaDesplegado ? null : item.id)}
              style={styles.botonVer}
            >
              <Ionicons
                name={estaDesplegado ? 'chevron-down' : 'chevron-forward'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {estaDesplegado && (
            <View style={styles.detallesExtra}>
              {estaEditando ? (
                <>
                  <TextInput
                    style={styles.inputBusqueda}
                    value={datosEditables.descripcionCorta}
                    onChangeText={text => setDatosEditables({ ...datosEditables, descripcionCorta: text })}
                    placeholder="Descripción corta"
                  />
                  <TextInput
                    style={styles.inputBusqueda}
                    value={datosEditables.descripcion}
                    onChangeText={text => setDatosEditables({ ...datosEditables, descripcion: text })}
                    placeholder="Descripción general"
                  />
                  <View style={styles.selectorContenedor}>
                    <Picker
                      selectedValue={datosEditables.tipoMoneda}
                      onValueChange={value => setDatosEditables({ ...datosEditables, tipoMoneda: value })}
                      style={styles.selector}
                    >
                      <Picker.Item label="DOLAR" value="DOLAR" />
                      <Picker.Item label="REAL" value="REAL" />
                    </Picker>
                  </View>
                  <TextInput
                    style={styles.inputBusqueda}
                    value={String(datosEditables.precio)}
                    onChangeText={text => setDatosEditables({ ...datosEditables, precio: text.replace(',', '.') })}
                    keyboardType="numeric"
                    placeholder="Precio"
                  />
                  <View style={styles.selectorContenedor}>
                    <Picker
                      selectedValue={datosEditables.proveedorId}
                      onValueChange={value => setDatosEditables({ ...datosEditables, proveedorId: value })}
                      style={styles.selector}
                    >
                      {proveedores.map(p => (
                        <Picker.Item key={p.id} label={p.nombre} value={p.id} />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.selectorContenedor}>
                    <Picker
                      selectedValue={datosEditables.categoria}
                      onValueChange={value => setDatosEditables({ ...datosEditables, categoria: value, marca: '' })}
                      style={styles.selector}
                    >
                      {categorias.map(cat => (
                        <Picker.Item key={cat.id} label={cat.nombre} value={cat.nombre} />
                      ))}
                    </Picker>
                  </View>
                  {marcasDisponibles.length > 0 && (
                    <View style={styles.selectorContenedor}>
                      <Picker
                        selectedValue={datosEditables.marca}
                        onValueChange={value => setDatosEditables({ ...datosEditables, marca: value })}
                        style={styles.selector}
                      >
                        <Picker.Item label="Seleccionar marca" value="" />
                        {marcasDisponibles.map(m => (
                          <Picker.Item key={m} label={m} value={m} />
                        ))}
                      </Picker>
                    </View>
                  )}
                  <TouchableOpacity style={styles.botonGuardar} onPress={guardarCambios}>
                    <Text style={styles.textoBotonEditar}>GUARDAR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.botonEliminar} onPress={() => setModoEdicion(null)}>
                    <Text style={styles.textoBotonEliminar}>CANCELAR</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.infoTexto}>{item.descripcion}</Text>
                  <Text style={styles.infoTexto}>Moneda: {item.tipoMoneda}</Text>
                  <Text style={styles.infoTexto}>Precio: ${item.precio.toFixed(2)}</Text>
                  <Text style={styles.infoTexto}>Precio ARS: {precioARS.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                  <Text style={styles.infoTexto}>Proveedor: {proveedor?.nombre || item.proveedorId}</Text>
                  <Text style={styles.infoTexto}>Categoría: {item.categoria || 'N/A'}</Text>
                  <Text style={styles.infoTexto}>Marca: {item.marca || 'N/A'}</Text>
                  <TouchableOpacity
                    style={styles.botonEditar}
                    onPress={() => {
                      setModoEdicion(item.id);
                      setDatosEditables({
                        descripcion: item.descripcion,
                        descripcionCorta: item.descripcionCorta,
                        tipoMoneda: item.tipoMoneda,
                        precio: item.precio.toFixed(2),
                        proveedorId: item.proveedorId,
                        categoria: item.categoria || '',
                        marca: item.marca || '',
                      });
                    }}
                  >
                    <Text style={styles.textoBotonEditar}>EDITAR</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
  <View style={styles.container}>
    <HeaderAdmin titulo="PRODUCTOS" />

    <View style={styles.barraBusqueda}>
      <TextInput
        style={styles.inputBusqueda}
        placeholder="Buscar por código, descripción o proveedor"
        placeholderTextColor="#ccc"
        value={busqueda}
        onChangeText={text => setBusqueda(text)}
      />
    </View>


      {seleccionados.length > 0 && (
        <TouchableOpacity style={styles.botonEliminar} onPress={eliminarSeleccionados}>
          <Text style={styles.textoBotonEliminar}>ELIMINAR SELECCIONADOS</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={productosFiltrados}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Productos;

