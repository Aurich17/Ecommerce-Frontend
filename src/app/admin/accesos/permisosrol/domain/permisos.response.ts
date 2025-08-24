export interface MenuResponseDto {
  id: number;
  descripcion: string;
  icono: string;
  isSubmenu: boolean;
  idpadre: number | null;
  url: string;
  activo: boolean;
  children: MenuResponseDto[];
}

export interface MenuWithPermissionsDto {
  id: number;
  descripcion: string;
  icono: string;
  isSubmenu: boolean;
  idpadre: number | null;
  url: string;
  activo: boolean;
  permisos: {
    accesoId: number;
    activo: boolean;
    addRegister: boolean;
    editRegister: boolean;
    deleteRegister: boolean;
  };
  children: MenuWithPermissionsDto[];
}

export interface BulkUpdateResponse {
  updated: number;
  created: number;
}

export interface GetMenusResponse {
  success: boolean;
  data: MenuResponseDto[];
}

export interface GetRolePermissionsResponse {
  success: boolean;
  data: MenuWithPermissionsDto[];
}