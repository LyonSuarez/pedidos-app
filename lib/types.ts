export interface Producto {
  id: string; // 👈 necesario para listar, editar y seleccionar
  codigo: string;
  descripcionCorta: string;
  descripcion: string;
  tipoMoneda: 'DOLAR' | 'REAL';
  precio: number;
  proveedorId: string;
  imagen?: string;
  categoria: string;
  marca: string;
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

export type ProductoEnCarrito = {
  id: string;
  nombre: string;
  cantidad: number;
};