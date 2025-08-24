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

export interface GetMenusResponse {
  success: boolean;
  data: MenuResponseDto[];
}