import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  guardarCotizacion,
  obtenerUltimasCotizaciones,
} from '../../lib/firestoreCotizaciones';

export default function ModificarPrecios() {
  const [cotizacionDolar, setCotizacionDolar] = useState('');
  const [cotizacionReal, setCotizacionReal] = useState('');

  const [ultimaDolar, setUltimaDolar] = useState<{ fecha: string; precio: string } | null>(null);
  const [ultimaReal, setUltimaReal] = useState<{ fecha: string; precio: string } | null>(null);

  // 🔄 Cargar desde Firebase al iniciar
  useEffect(() => {
    const cargarCotizaciones = async () => {
      const data = await obtenerUltimasCotizaciones();
      if (data.dolar) setUltimaDolar(data.dolar);
      if (data.real) setUltimaReal(data.real);
    };
    cargarCotizaciones();
  }, []);

  const guardarDolar = async () => {
    if (!cotizacionDolar || isNaN(Number(cotizacionDolar))) {
      Alert.alert('Error', 'Ingresá una cotización válida para el dólar.');
      return;
    }

    const exito = await guardarCotizacion('dolar', cotizacionDolar);
    if (exito) {
      const ahora = new Date().toLocaleString('es-AR');
      setUltimaDolar({ precio: cotizacionDolar, fecha: ahora });
      setCotizacionDolar('');
      Alert.alert('Éxito', `Cotización del dólar guardada: $${cotizacionDolar}`);
    }
  };

  const guardarReal = async () => {
    if (!cotizacionReal || isNaN(Number(cotizacionReal))) {
      Alert.alert('Error', 'Ingresá una cotización válida para el real.');
      return;
    }

    const exito = await guardarCotizacion('real', cotizacionReal);
    if (exito) {
      const ahora = new Date().toLocaleString('es-AR');
      setUltimaReal({ precio: cotizacionReal, fecha: ahora });
      setCotizacionReal('');
      Alert.alert('Éxito', `Cotización del real guardada: $${cotizacionReal}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>COTIZACION</Text>

      {/* Última actualización */}
      <View style={styles.row}>
        <View style={[styles.card, { backgroundColor: 'red' }]}>
          <Text style={styles.cardTitle}>DOLAR</Text>
          <Text style={styles.cardText}>FECHA: {ultimaDolar?.fecha || '-'}</Text>
          <Text style={styles.cardText}>PRECIO: {ultimaDolar?.precio || '-'}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: 'green' }]}>
          <Text style={styles.cardTitle}>REAL</Text>
          <Text style={styles.cardText}>FECHA: {ultimaReal?.fecha || '-'}</Text>
          <Text style={styles.cardText}>PRECIO: {ultimaReal?.precio || '-'}</Text>
        </View>
      </View>

      <Text style={styles.subtitulo}>DOLAR</Text>
      <TextInput
        style={styles.input}
        placeholder="US$0.00"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={cotizacionDolar}
        onChangeText={setCotizacionDolar}
      />
      <Text style={styles.descripcion}>
        US$0.00 (Actualiza todos los productos con precios en DÓLARES)
      </Text>
      <TouchableOpacity style={styles.boton} onPress={guardarDolar}>
        <Text style={styles.botonTexto}>GUARDAR</Text>
      </TouchableOpacity>

      <Text style={styles.subtitulo}>REAL</Text>
      <TextInput
        style={styles.input}
        placeholder="R$0.00"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={cotizacionReal}
        onChangeText={setCotizacionReal}
      />
      <Text style={styles.descripcion}>
        R$0.00 (Actualiza todos los productos con precios en REALES)
      </Text>
      <TouchableOpacity style={styles.boton} onPress={guardarReal}>
        <Text style={styles.botonTexto}>GUARDAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  cardTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 14,
  },
  cardText: {
    color: 'white',
    fontSize: 12,
  },
  subtitulo: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'black',
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  descripcion: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
  },
  boton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 25,
  },
  botonTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
