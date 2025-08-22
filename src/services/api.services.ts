import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import {
  ciudadesResponse,
  paisesResponse,
  provinciasResponse,
  RegisterClienteResponse,
  tiposResponse,
} from '../app/auth/register/domain/response/register.response';
import { RegisterClienteRequest } from '../app/auth/register/domain/request/register.request';
import { environment } from '../environments/environment';
import { RequestTipos } from '../app/tipos/request/tipos.request';
import {
  AccesoApi,
  MenuApi,
  PermisoRow,
  ResponseTipos,
  RoleApi,
  RoleRow,
  Tipo,
} from '../app/tipos/reponse/tipos.response';
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
}
