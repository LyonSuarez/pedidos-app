export interface Producto {
  id: string;
  codigo: string;
  descripcionCorta: string;
  descripcion: string; // <-- esta línea es la clave
  tipoMoneda: 'DOLAR' | 'REAL';
  precio: number;
  proveedorId: string;
  imagen?: string;
}
export type Proveedor = {
  id: string;
  nombre: string;
  telefono: string;
  direccion: string;
  pais: 'Paraguay' | 'Brasil';
  correo?: string;
  notas?: string;
};

