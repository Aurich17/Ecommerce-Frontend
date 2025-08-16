import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { ciudadesResponse, paisesResponse, provinciasResponse, RegisterClienteResponse, tiposResponse } from '../app/auth/register/domain/response/register.response';
import { RegisterClienteRequest } from '../app/auth/register/domain/request/register.request';
import { environment } from '../environments/environment';
import { RequestTipos } from '../app/tipos/request/tipos.request';
import { ResponseTipos, Tipo } from '../app/tipos/reponse/tipos.response';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.urlApi;

  constructor(private http: HttpClient) { }

  getPaises(): Observable<paisesResponse[]> {
    return this.http.get<paisesResponse[]>(`${this.apiUrl}/paises`);  // Cambiar tab_table por tabla_tab
  }

  getProvincias(): Observable<provinciasResponse[]> {
    return this.http.get<provinciasResponse[]>(`${this.apiUrl}/provincias`);  // Cambiar tab_table por tabla_tab
  }

  getCiudades(provinciaId: number): Observable<ciudadesResponse[]> {
    const params = new HttpParams().set('provinciaId', provinciaId);
    return this.http.get<ciudadesResponse[]>(`${this.apiUrl}/ciudades`, { params });  // Cambiar tab_table por tabla_tab
  }

  getGeneros(): Observable<tiposResponse[]> {
    return this.http.get<tiposResponse[]>(`${this.apiUrl}/generos`);
  }

  getOcupaciones(): Observable<tiposResponse[]> {
    return this.http.get<tiposResponse[]>(`${this.apiUrl}/ocupaciones`);
  }

  registerClient(encabezado: RegisterClienteRequest): Observable<RegisterClienteResponse> {
    return this.http.post<RegisterClienteResponse>(`${this.apiUrl}/clientes/registro-completo`, encabezado);
  }

  obtenerTipos(req: RequestTipos): Observable<Tipo[]> {
    return this.http
      .post<ResponseTipos>(`${this.apiUrl}/tipos`, req)
      .pipe(map(r => r.data)); // ajusta si tu API responde distinto
  }
}
