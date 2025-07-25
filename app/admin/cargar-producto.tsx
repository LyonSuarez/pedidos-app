import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as XLSX from 'xlsx';
import HeaderAdmin from '../../components/HeaderAdmin';
import { db } from '../../lib/firebase';
import { obtenerCategoriasDesdeFirestore } from '../../lib/fireCategorias';

interface Producto {
  codigo: string;
  descripcionCorta: string;
  descripcion: string;
  tipoMoneda: 'DOLAR' | 'REAL';
  precio: number;
  proveedorId: string;
  imagen?: string;
  categoria: string;
  marca?: string;
}

interface CategoriaFirestore {
  id: string;
  nombre: string;
  marcas: string[];
}

export default function CargarProductosScreen() {
  const [producto, setProducto] = useState<Producto>({
    codigo: '',
    descripcionCorta: '',
    descripcion: '',
    tipoMoneda: 'DOLAR',
    precio: 0,
    proveedorId: '',
    imagen: '',
    categoria: '',
    marca: '',
  });
  const [precioTexto, setPrecioTexto] = useState('');
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<CategoriaFirestore[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [resumenImportacion, setResumenImportacion] = useState({ validos: 0, erroneos: 0 });
  const [archivoProductos, setArchivoProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const cargarTodo = async () => {
      const provSnap = await getDocs(collection(db, 'proveedores'));
      const provList = provSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProveedores(provList);

      const catList = await obtenerCategoriasDesdeFirestore();
      setCategorias(catList as CategoriaFirestore[]);
    };
    cargarTodo();
  }, []);

  const marcasDisponibles = categorias.find(c => c.nombre === producto.categoria)?.marcas || [];

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets?.[0]?.uri) {
      setProducto({ ...producto, imagen: resultado.assets[0].uri });
    }
  };

  const guardarProducto = async () => {
    if (!producto.codigo || !producto.descripcionCorta || !producto.descripcion || !producto.tipoMoneda || !producto.precio || !producto.proveedorId || !producto.categoria) {
      Alert.alert('Error', 'Por favor, completá todos los campos obligatorios.');
      return;
    }

    const snapshot = await getDocs(collection(db, 'productos'));
    const existeCodigo = snapshot.docs.some(doc => doc.data().codigo === producto.codigo);

    if (existeCodigo) {
      Alert.alert('Error', 'El código ya está en uso.');
      return;
    }

    const precioFormateado = parseFloat(producto.precio.toFixed(2));
    await addDoc(collection(db, 'productos'), { ...producto, precio: precioFormateado });
    Alert.alert('Éxito', 'Producto guardado correctamente.');
    setProducto({
      codigo: '',
      descripcionCorta: '',
      descripcion: '',
      tipoMoneda: 'DOLAR',
      precio: 0,
      proveedorId: '',
      imagen: '',
      categoria: '',
      marca: '',
    });
    setPrecioTexto('');
  };

  const verFormatoExcel = () => {
    Alert.alert(
      'Formato del Excel',
      `Las columnas deben llamarse exactamente así:
- codigo
- descripcionCorta
- descripcion
- tipoMoneda (DOLAR o REAL)
- precio
- proveedorId
- categoria
- marca (opcional)
- imagen (opcional)`
    );
  };

  const importarDesdeExcel = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;

    const file = await fetch(result.assets[0].uri).then(res => res.arrayBuffer());
    const workbook = XLSX.read(file, { type: 'buffer' });
    const hoja = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[hoja]);

    const productos: Producto[] = [];
    let errores = 0;

    data.forEach((item: any) => {
      if (
        item.codigo &&
        item.descripcionCorta &&
        item.descripcion &&
        (item.tipoMoneda === 'DOLAR' || item.tipoMoneda === 'REAL') &&
        item.precio &&
        item.proveedorId &&
        item.categoria
      ) {
        productos.push({
          codigo: item.codigo,
          descripcionCorta: item.descripcionCorta,
          descripcion: item.descripcion,
          tipoMoneda: item.tipoMoneda,
          precio: parseFloat(item.precio.toString().replace(',', '.')),
          proveedorId: item.proveedorId,
          categoria: item.categoria,
          marca: item.marca || '',
          imagen: item.imagen || '',
        });
      } else {
        errores++;
      }
    });

    setArchivoProductos(productos);
    setResumenImportacion({ validos: productos.length, erroneos: errores });
    setModalVisible(true);
  };

  const confirmarImportacion = async () => {
    for (const prod of archivoProductos) {
      const precioFormateado = parseFloat(prod.precio.toFixed(2));
      await addDoc(collection(db, 'productos'), { ...prod, precio: precioFormateado });
    }
    Alert.alert('Éxito', 'Productos importados correctamente.');
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <HeaderAdmin titulo="CARGAR PRODUCTO" />

      <TextInput
        style={styles.input}
        placeholder="CODIGO"
        placeholderTextColor="#aaa"
        value={producto.codigo}
        onChangeText={text => setProducto({ ...producto, codigo: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="DESCRIPCION CORTA"
        placeholderTextColor="#aaa"
        value={producto.descripcionCorta}
        onChangeText={text => setProducto({ ...producto, descripcionCorta: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="DESCRIPCION"
        placeholderTextColor="#aaa"
        value={producto.descripcion}
        onChangeText={text => setProducto({ ...producto, descripcion: text })}
      />

      <Picker
        selectedValue={producto.tipoMoneda}
        onValueChange={val => setProducto({ ...producto, tipoMoneda: val })}
        style={styles.picker}
        dropdownIconColor="white"
        itemStyle={{ color: 'white' }}
      >
        <Picker.Item label="DOLAR" value="DOLAR" />
        <Picker.Item label="REAL" value="REAL" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="PRECIO"
        placeholderTextColor="#aaa"
        keyboardType="decimal-pad"
        value={precioTexto}
        onChangeText={text => {
          const limpio = text.replace(',', '.');
          setPrecioTexto(text);
          const numero = parseFloat(limpio);
          setProducto({ ...producto, precio: isNaN(numero) ? 0 : numero });
        }}
      />

      <Picker
        selectedValue={producto.proveedorId}
        onValueChange={val => setProducto({ ...producto, proveedorId: val })}
        style={styles.picker}
        dropdownIconColor="white"
        itemStyle={{ color: 'white' }}
      >
        <Picker.Item label="Seleccionar proveedor" value="" />
        {proveedores.map(p => (
          <Picker.Item key={p.id} label={p.nombre} value={p.id} />
        ))}
      </Picker>

      <Picker
        selectedValue={producto.categoria}
        onValueChange={val => setProducto({ ...producto, categoria: val, marca: '' })}
        style={styles.picker}
        dropdownIconColor="white"
        itemStyle={{ color: 'white' }}
      >
        <Picker.Item label="Seleccionar categoría" value="" />
        {categorias.map(cat => (
          <Picker.Item key={cat.id} label={cat.nombre} value={cat.nombre} />
        ))}
      </Picker>

      {marcasDisponibles.length > 0 && (
        <Picker
          selectedValue={producto.marca}
          onValueChange={val => setProducto({ ...producto, marca: val })}
          style={styles.picker}
          dropdownIconColor="white"
          itemStyle={{ color: 'white' }}
        >
          <Picker.Item label="Seleccionar marca" value="" />
          {marcasDisponibles.map(marca => (
            <Picker.Item key={marca} label={marca} value={marca} />
          ))}
        </Picker>
      )}

      <TouchableOpacity onPress={seleccionarImagen} style={styles.botonImagen}>
        <Text style={styles.botonTexto}>SELECCIONAR IMAGEN</Text>
      </TouchableOpacity>
      {producto.imagen ? <Image source={{ uri: producto.imagen }} style={styles.imagen} /> : null}

      <TouchableOpacity onPress={importarDesdeExcel} style={[styles.boton, { backgroundColor: 'green' }]}>
        <Text style={styles.botonTexto}>IMPORTAR DESDE EXCEL</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={guardarProducto} style={[styles.boton, { backgroundColor: '#1E90FF' }]}>
        <Text style={styles.botonTexto}>GUARDAR PRODUCTO</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={verFormatoExcel} style={[styles.boton, { backgroundColor: 'gray' }]}>
        <Text style={styles.botonTexto}>VER FORMATO EXCEL</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Resumen de importación</Text>
            <Text style={styles.modalTexto}>Correctos: {resumenImportacion.validos}</Text>
            <Text style={styles.modalTexto}>Erróneos: {resumenImportacion.erroneos}</Text>
            <View style={styles.modalBotones}>
              <TouchableOpacity onPress={confirmarImportacion} style={[styles.boton, { backgroundColor: 'green' }]}>
                <Text style={styles.botonTexto}>CONFIRMAR</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.boton, { backgroundColor: 'red' }]}>
                <Text style={styles.botonTexto}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'black', padding: 20, flexGrow: 1 },
  titulo: { fontSize: 24, color: 'white', fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#222', color: 'white', borderRadius: 5, padding: 10, marginBottom: 10 },
  picker: { backgroundColor: '#222', color: 'white', marginBottom: 10 },
  boton: { padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  botonTexto: { color: 'white', fontWeight: 'bold' },
  botonImagen: { padding: 12, borderRadius: 5, alignItems: 'center', backgroundColor: '#444', marginBottom: 10 },
  imagen: { width: '100%', aspectRatio: 1, marginBottom: 10, borderRadius: 5 },
  modalFondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContenido: { backgroundColor: 'white', borderRadius: 10, padding: 20, width: '80%' },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalTexto: { marginBottom: 5 },
  modalBotones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
});

