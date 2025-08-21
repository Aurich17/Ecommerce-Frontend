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
  user: {
    id: string;
    full_name: string;
    email: string;
    phone_e164: string;
    social_security_code: string;
    status: 'habilitado' | 'deshabilitado';
  };
  roles: Array<{ tab: string; cod: string; desc: string }>;
  rol: string;       // "Admin"
  rol_cod: string;   // "3"
  next: string;      // "/admin"
  menu: ApiMenuItem[];
  token: string;
  expires_in: number; // segundos (900)
}

export interface ApiMenuItem {
  id: number;
  label: string;
  icon?: string;         // "like" en tu API; luego lo mapeamos a PrimeIcons
  isSubmenu: boolean;
  parentId: number | null;
  perms?: { add: boolean; edit: boolean; delete: boolean };
  children: ApiMenuItem[];
}
