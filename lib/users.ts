export type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  clientType?: "CF" | "Mayorista" | "";
  dni: string;
  telefono: string;
  direccion: string;
  role: 'admin' | 'cliente';
  online: boolean;
  firstLogin?: boolean;
};

export const users: User[] = [
  {
    id: '0001',
    username: 'cliente1',
    password: '1234',
    name: 'Cliente Uno',
    clientType: 'CF',
    dni: '12345678',
    telefono: '1112345678',
    direccion: 'Calle Falsa 123',
    role: 'cliente',
    online: false,
    firstLogin: true
  },
  {
    id: '0002',
    username: 'cliente2',
    password: '4567',
    name: 'Cliente Dos',
    clientType: 'Mayorista',
    dni: '87654321',
    telefono: '1123456789',
    direccion: 'Av. Siempre Viva 742',
    role: 'cliente',
    online: false,
    firstLogin: true
  },
  {
    id: 'admin',
    username: 'ADMIN',
    password: 'Lyonkpo2000.',
    name: 'Administrador',
    clientType: 'CF',
    dni: '0',
    telefono: '0',
    direccion: 'Sistema',
    role: 'admin',
    online: false
  }
];



