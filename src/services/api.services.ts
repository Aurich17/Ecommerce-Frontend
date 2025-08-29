import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { RegisterClienteResponse } from '../app/auth/register/domain/response/register.response';
import { RegisterClienteRequest } from '../app/auth/register/domain/request/register.request';
import { environment } from '../environments/environment';
import {
  AccesoApi,
  MenuApi,
  PermisoRow,
  ResponseTipos,
  RoleApi,
  RoleRow,
  Tipo,
} from '../app/tipos/reponse/tipos.response';
import {
  MenuResponseDto,
  MenuWithPermissionsDto,
  BulkUpdateResponse,
} from '../app/admin/accesos/permisosrol/domain/permisos.response';
import {
  BulkUpdatePermissionsDto,
  CreateAccesoDto,
} from '../app/admin/accesos/permisosrol/domain/permisos.request';
import {
  ProductListResponse,
  ProductDetail,
  CreateProductDto,
  UpdateProductDto,
} from '../app/admin/mantenimiento/productos/domain/productos.response';
import {
  Currency,
  CreateCurrencyDto,
  UpdateCurrencyDto,
} from '../app/admin/mantenimiento/monedas/domain/monedas.response';
// import { CurrencyFilters } from '../app/admin/mantenimiento/monedas/domain/monedas.request';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.urlApi;

  constructor(private http: HttpClient) {}

  registerClient(
    encabezado: RegisterClienteRequest
  ): Observable<RegisterClienteResponse> {
    return this.http.post<RegisterClienteResponse>(
      `${this.apiUrl}/clientes/registro-completo`,
      encabezado
    );
  }

  obtenerTipos(tab: string): Observable<Tipo[]> {
    return this.http
      .get<ResponseTipos>(`${this.apiUrl}/tipos/${encodeURIComponent(tab)}`)
      .pipe(map((r) => r.data));
  }

  obtenerRoles(): Observable<RoleRow[]> {
    return this.http.get<RoleApi[]>(`${this.apiUrl}/roles`).pipe(
      map((roles) =>
        roles.map((r) => ({
          id: r.id,
          nombre: r.descripcion, // usamos 'descripcion' como nombre
          descripcion: r.descripcion, // si luego tienes campo desc-larga, cámbialo aquí
          fechacreacion: r.datecrea ?? '',
        }))
      )
    );
  }

  crearRol(body: {
    descripcion: string;
    ussercrea?: string;
    activo?: boolean;
  }) {
    return this.http.post<RoleApi>(`${this.apiUrl}/roles`, body);
  }

  eliminarRol(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/roles/${id}`);
  }

  // 1) Accesos por rol (crudo)
  private obtenerAccesosPorRol(idRol: number): Observable<AccesoApi[]> {
    return this.http.get<AccesoApi[]>(`${this.apiUrl}/accesos/rol/${idRol}`);
  }

  // 2) Menús (lista completa para mapear nombres). Cambia a /menus si es tu ruta.
  private obtenerMenus(): Observable<MenuApi[]> {
    return this.http.get<MenuApi[]>(`${this.apiUrl}/menu`);
  }

  // 3) Permisos por rol ya combinados (acceso + nombre de menú)
  obtenerPermisosRol(idRol: number): Observable<PermisoRow[]> {
    return forkJoin([
      this.obtenerAccesosPorRol(idRol),
      this.obtenerMenus(),
    ]).pipe(
      map(([accesos, menus]) => {
        const m = new Map(menus.map((x) => [x.id, x]));
        return accesos.map<PermisoRow>((a) => ({
          id: a.id,
          idMenu: a.id_menu,
          nombre: m.get(a.id_menu)?.nombre ?? `Menú ${a.id_menu}`,
          acceso: a.activo,
          ver: a.activo, // alias
          agregar: a.add_register,
          editar: a.edit_register,
          eliminar: a.delete_register,
        }));
      })
    );
  }

  // 4) Actualizar un acceso (PATCH /accesos/:id)
  actualizarAcceso(
    idAcceso: number,
    dto: Partial<{
      activo: boolean;
      addRegister: boolean;
      editRegister: boolean;
      deleteRegister: boolean;
    }>
  ) {
    return this.http.patch<AccesoApi>(
      `${this.apiUrl}/accesos/${idAcceso}`,
      dto
    );
  }

  obtenerRolPorId(id: number): Observable<RoleApi | undefined> {
    return this.http
      .get<RoleApi[]>(`${this.apiUrl}/roles`)
      .pipe(map((rs) => rs.find((x) => x.id === id)));
  }

  // ===== NUEVOS MÉTODOS PARA GESTIÓN DE PERMISOS =====

  // Obtener todos los menús
  getAllMenus(): Observable<MenuResponseDto[]> {
    return this.http.get<MenuResponseDto[]>(`${this.apiUrl}/accesos/menus`);
  }

  // Obtener permisos de un rol específico
  getRolePermissions(roleId: number): Observable<MenuWithPermissionsDto[]> {
    return this.http.get<MenuWithPermissionsDto[]>(
      `${this.apiUrl}/accesos/rol/${roleId}/menus-permisos`
    );
  }

  // Actualizar permisos masivamente
  bulkUpdatePermissions(
    roleId: number,
    permissions: BulkUpdatePermissionsDto
  ): Observable<BulkUpdateResponse> {
    return this.http.patch<BulkUpdateResponse>(
      `${this.apiUrl}/accesos/rol/${roleId}/permisos-masivos`,
      permissions
    );
  }

  // Crear nuevo acceso
  createAccess(access: CreateAccesoDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/accesos`, access);
  }

  // ===== MÉTODOS PARA GESTIÓN DE PRODUCTOS =====

  getProducts(filters?: {
    sellerUserId?: string;
    page?: number;
    limit?: number;
    q?: string;
    enabled?: string;
  }): Observable<ProductListResponse> {
    let params = new HttpParams();
    if (filters?.sellerUserId)
      params = params.set('sellerUserId', filters.sellerUserId);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());
    if (filters?.q) params = params.set('q', filters.q);
    if (filters?.enabled) params = params.set('enabled', filters.enabled);
    return this.http.get<ProductListResponse>(`${this.apiUrl}/products`, {
      params,
    });
  }

  getProductById(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.apiUrl}/products/${id}`);
  }

  createProduct(product: CreateProductDto): Observable<ProductDetail> {
    return this.http.post<ProductDetail>(`${this.apiUrl}/products`, product);
  }

  updateProduct(
    id: number,
    updates: UpdateProductDto
  ): Observable<ProductDetail> {
    return this.http.patch<ProductDetail>(
      `${this.apiUrl}/products/${id}`,
      updates
    );
  }

  getProductsBySeller(sellerId: string): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(
      `${this.apiUrl}/products/seller/${sellerId}`
    );
  }

  disableProduct(id: number): Observable<ProductDetail> {
    return this.http.patch<ProductDetail>(
      `${this.apiUrl}/products/${id}/disable`,
      {}
    );
  }

  enableProduct(id: number): Observable<ProductDetail> {
    return this.http.patch<ProductDetail>(
      `${this.apiUrl}/products/${id}/enable`,
      {}
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  // ===== MÉTODOS DE LA API DE MONEDAS =====

  // Listar todas las monedas con filtros opcionales
  // getCurrencies(filters?: CurrencyFilters): Observable<Currency[]> {
  //   let params = new HttpParams();

  //   if (filters?.status !== undefined) {
  //     params = params.set('status', filters.status.toString());
  //   }
  //   if (filters?.page) {
  //     params = params.set('page', filters.page.toString());
  //   }
  //   if (filters?.limit) {
  //     params = params.set('limit', filters.limit.toString());
  //   }
  //   if (filters?.q) {
  //     params = params.set('q', filters.q);
  //   }

  //   return this.http.get<Currency[]>(`${this.apiUrl}/currencies`, { params });
  // }

  // Obtener moneda por ID
  getCurrencyById(id: number): Observable<Currency> {
    return this.http.get<Currency>(`${this.apiUrl}/currencies/${id}`);
  }

  // Crear nueva moneda
  createCurrency(currency: CreateCurrencyDto): Observable<Currency> {
    return this.http.post<Currency>(`${this.apiUrl}/currencies`, currency);
  }

  // Actualizar moneda
  updateCurrency(id: number, updates: UpdateCurrencyDto): Observable<Currency> {
    return this.http.patch<Currency>(
      `${this.apiUrl}/currencies/${id}`,
      updates
    );
  }

  // Cambiar estado de moneda (toggle)
  toggleCurrencyStatus(id: number): Observable<Currency> {
    return this.http.patch<Currency>(
      `${this.apiUrl}/currencies/${id}/toggle-status`,
      {}
    );
  }

  // Eliminar moneda
  deleteCurrency(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/currencies/${id}`);
  }
}
