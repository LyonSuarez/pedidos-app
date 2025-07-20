export type User = {
  id?: string;
  username: string;
  password: string;
  name: string;
  clientType: "CF" | "Mayorista" | "";
  dni: string;
  telefono: string;
  direccion: string;
  role: 'admin' | 'cliente';
  online: boolean;
  firstLogin: boolean;
};

export const users: User[] = []; // Lista vacía




