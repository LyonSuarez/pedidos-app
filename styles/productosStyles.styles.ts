import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  barraBusqueda: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  inputBusqueda: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
  },
  botonEliminar: {
    backgroundColor: '#e53935',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoBotonEliminar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'column',
  },
  cardSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imagenCuadrada: {
    width: 60,
    height: 60,
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagenSeleccionada: {
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  imagenTexto: {
    color: '#aaa',
    fontSize: 10,
  },
  detalleProducto: {
    flex: 1,
  },
  codigoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  descripcionTexto: {
    color: '#bbb',
    fontSize: 13,
  },
  botonVer: {
    backgroundColor: '#444',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotonVer: {
    color: '#fff',
    fontSize: 16,
  },
  detallesExtra: {
    marginTop: 10,
    backgroundColor: '#1f1f1f',
    padding: 10,
    borderRadius: 10,
  },
  infoTexto: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  botonEditar: {
    backgroundColor: '#ff8c00ff',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  textoBotonEditar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botonGuardar: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  selectorContenedor: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginTop: 10,
    justifyContent: 'center',
    height: 50,
    overflow: 'hidden',
  },
  selector: {
    color: '#fff',
    height: 50,
    width: '100%',
  },
});