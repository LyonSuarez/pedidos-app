import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { actualizarProductoEnFirestore } from "../lib/firebaseProductos";

export type Producto = {
  id: string;
  codigo: string;
  descripcionCorta: string;
  descripcionGeneral: string;
  tipoMoneda: "Dólar" | "Real";
  precio: string;
  proveedor: string;
  imagen?: string;
};

type Props = {
  producto: Producto;
  proveedoresDisponibles?: string[]; // nuevo: lista de proveedores para usar en el Picker
};

const ProductoItem = ({ producto, proveedoresDisponibles = [] }: Props) => {
  const [expandido, setExpandido] = useState(false);
  const [editando, setEditando] = useState(false);
  const [datos, setDatos] = useState(producto);
  const [imagenLocal, setImagenLocal] = useState<string | undefined>(producto.imagen);

  const manejarSeleccionImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setImagenLocal(resultado.assets[0].uri);
    }
  };

  const quitarImagen = () => {
    setImagenLocal(undefined);
  };

  const confirmarCambios = async () => {
    if (
      !datos.descripcionCorta.trim() ||
      !datos.descripcionGeneral.trim() ||
      !datos.precio.trim() ||
      !datos.proveedor.trim()
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      await actualizarProductoEnFirestore(producto.id, {
        descripcionCorta: datos.descripcionCorta,
        descripcionGeneral: datos.descripcionGeneral,
        tipoMoneda: datos.tipoMoneda,
        precio: datos.precio,
        proveedor: datos.proveedor,
        imagen: imagenLocal || "",
      });
      Alert.alert("Éxito", "Producto guardado correctamente.");
      setEditando(false);
    } catch {
      Alert.alert("Error", "No se pudo guardar el producto.");
    }
  };

  const cancelarEdicion = () => {
    setDatos(producto);
    setImagenLocal(producto.imagen);
    setEditando(false);
  };

  return (
    <View style={{ marginBottom: 15, padding: 10, backgroundColor: "#1c1c1c", borderRadius: 12 }}>
      <TouchableOpacity onPress={() => setExpandido(!expandido)}>
        <Text style={{ fontSize: 18, color: "white" }}>
          {producto.codigo} - {producto.descripcionCorta}
        </Text>
      </TouchableOpacity>

      {expandido && (
        <View style={{ marginTop: 10 }}>
          {imagenLocal ? (
            <Image source={{ uri: imagenLocal }} style={{ width: 100, height: 100, borderRadius: 8 }} />
          ) : (
            <Text style={{ color: "#aaa" }}>Sin imagen seleccionada</Text>
          )}

          <Text style={{ color: "#aaa" }}>Código: {producto.codigo}</Text>

          <Text style={{ color: "#ccc", marginTop: 5 }}>Descripción corta:</Text>
          {editando ? (
            <TextInput
              value={datos.descripcionCorta}
              onChangeText={(text) => setDatos({ ...datos, descripcionCorta: text })}
              style={{ color: "white", borderBottomWidth: 1, borderColor: "#555" }}
            />
          ) : (
            <Text style={{ color: "white" }}>{producto.descripcionCorta}</Text>
          )}

          <Text style={{ color: "#ccc", marginTop: 5 }}>Descripción general:</Text>
          {editando ? (
            <TextInput
              value={datos.descripcionGeneral}
              onChangeText={(text) => setDatos({ ...datos, descripcionGeneral: text })}
              multiline
              style={{ color: "white", borderBottomWidth: 1, borderColor: "#555" }}
            />
          ) : (
            <Text style={{ color: "white" }}>{producto.descripcionGeneral}</Text>
          )}

          <Text style={{ color: "#ccc", marginTop: 5 }}>Tipo de moneda:</Text>
          {editando ? (
            <Picker
              selectedValue={datos.tipoMoneda}
              onValueChange={(itemValue) => setDatos({ ...datos, tipoMoneda: itemValue })}
              style={{ color: "white", backgroundColor: '#1e1e1e', borderRadius: 8 }}
            >
              <Picker.Item label="Dólar" value="Dólar" />
              <Picker.Item label="Real" value="Real" />
            </Picker>
          ) : (
            <Text style={{ color: "white" }}>{producto.tipoMoneda}</Text>
          )}

          <Text style={{ color: "#ccc", marginTop: 5 }}>Precio:</Text>
          {editando ? (
            <TextInput
              value={datos.precio}
              onChangeText={(text) => setDatos({ ...datos, precio: text })}
              keyboardType="numeric"
              style={{ color: "white", borderBottomWidth: 1, borderColor: "#555" }}
            />
          ) : (
            <Text style={{ color: "white" }}>{producto.precio}</Text>
          )}

          <Text style={{ color: "#ccc", marginTop: 5 }}>Proveedor:</Text>
          {editando ? (
            <Picker
              selectedValue={datos.proveedor}
              onValueChange={(value) => setDatos({ ...datos, proveedor: value })}
              style={{ color: "white", backgroundColor: '#1e1e1e', borderRadius: 8 }}
            >
              {proveedoresDisponibles.map((nombre) => (
                <Picker.Item key={nombre} label={nombre} value={nombre} />
              ))}
            </Picker>
          ) : (
            <Text style={{ color: "white" }}>{producto.proveedor}</Text>
          )}

          {editando ? (
            <View style={{ flexDirection: "row", marginTop: 10, flexWrap: "wrap", gap: 10 }}>
              <TouchableOpacity onPress={confirmarCambios} style={{ backgroundColor: "green", padding: 10, borderRadius: 8 }}>
                <Text style={{ color: "white" }}>CONFIRMAR</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelarEdicion} style={{ backgroundColor: "gray", padding: 10, borderRadius: 8 }}>
                <Text style={{ color: "white" }}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={manejarSeleccionImagen} style={{ backgroundColor: "blue", padding: 10, borderRadius: 8 }}>
                <Text style={{ color: "white" }}>CAMBIAR IMAGEN</Text>
              </TouchableOpacity>
              {imagenLocal && (
                <TouchableOpacity onPress={quitarImagen} style={{ backgroundColor: "red", padding: 10, borderRadius: 8 }}>
                  <Text style={{ color: "white" }}>QUITAR IMAGEN</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditando(true)} style={{ marginTop: 10, backgroundColor: "#555", padding: 10, borderRadius: 8 }}>
              <Text style={{ color: "white" }}>EDITAR</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default ProductoItem;
