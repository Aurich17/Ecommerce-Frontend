export type Rol = 'ADMIN' | 'EMPRESA' | 'CLIENTE' | string;

export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  created_at: string;
}

export interface LoginResponse {
  auth_ok: boolean;
  rol: Rol;
  cliente: Cliente;
  next: string;   // '/admin' | '/empresa' | '/cliente'
  token?: string;
}
