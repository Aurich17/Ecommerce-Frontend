export type TabTipo = 'PAIS' | 'PROVINCIA' | 'MUNICIPIO' | 'OCU' | 'GEN';

export interface Tipo {
  tab: string;
  cod: string;
  desc: string;
}

export type RequestTipos =
  | { tab: 'PAIS' | 'OCU' | 'GEN' }
  | { tab: 'PROVINCIA' | 'MUNICIPIO'; parentId: number };

export interface ResponseTipos {
  data: Tipo[];
  message?: string;
}

// --------- ROLES ---------
// Respuesta real del API Nest
export interface RoleApi {
  id: number;
  descripcion: string; // nombre del rol en tu BD
  datecrea?: string; // YYYY-MM-DD
  ussercrea?: string;
  activo: boolean;
}

// Modelo para tu tabla (lo que pintas en la UI)
export interface RoleRow {
  id: number;
  nombre: string;
  descripcion: string;
  fechacreacion?: string;
}

// ====== MENÚS & ACCESOS ======
// Acceso tal como lo devuelve el backend Nest (GET /accesos/rol/:idRol)
export interface AccesoApi {
  id: number;
  id_rol: number;
  id_menu: number;
  activo: boolean;
  add_register: boolean;
  edit_register: boolean;
  delete_register: boolean;
}

// Menú (ajusta el endpoint si usas /menus)
export interface MenuApi {
  id: number;
  nombre: string;
  // opcional: grupo/categoría si lo tienes
  // grupo?: 'Migración' | 'Mantenimiento';
}

// Fila que usa tu UI en la tabla de permisos
export interface PermisoRow {
  id: number; // id de acceso
  idMenu: number;
  nombre: string; // nombre del menú
  acceso: boolean; // == activo
  ver: boolean; // alias de activo
  agregar: boolean; // add_register
  editar: boolean; // edit_register
  eliminar: boolean; // delete_register
}
