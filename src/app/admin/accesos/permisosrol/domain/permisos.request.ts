export interface PermissionUpdateDto {
  idMenu: number;
  activo?: boolean;
  addRegister?: boolean;
  editRegister?: boolean;
  deleteRegister?: boolean;
}

export interface BulkUpdatePermissionsDto {
  permisos: PermissionUpdateDto[];
}

export interface CreateAccesoDto {
  idRol: number;
  idMenu: number;
  activo?: boolean;
  addRegister?: boolean;
  editRegister?: boolean;
  deleteRegister?: boolean;
}