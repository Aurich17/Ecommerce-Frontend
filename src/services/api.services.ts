import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
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
import { ResponseTipos, Tipo } from '../app/tipos/reponse/tipos.response';
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
}
