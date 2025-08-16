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
  private apiUrl = environment.urlApi; // URL de tu API desde el entorno
  // private apiUrl = 'http://localhost:3000';
  // private apiUrl = 'https://ecommerce-backend-na5u.onrender.com/api'; // URL de tu API

  constructor(private http: HttpClient) { }

  // insertaUsuario(item: any): Observable<any>{
  //   return this.http.post(`${this.apiUrl}/register`, item);
  // }

  // loginUsuario(loginRequest: LoginRequest): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
  //   const body = new URLSearchParams();
  //   body.set('username', loginRequest.username);
  //   body.set('password', loginRequest.password);

  //   return this.http.post(`${this.apiUrl}/api/login`, body.toString(), { headers }).pipe(
  //     tap((response: any) => {
  //       if (response.access_token) {
  //         localStorage.setItem('access_token', response.access_token);
  //       }
  //     }),
  //     catchError((error) => {
  //       console.error('Error en la solicitud de login:', error);
  //       return throwError(error);
  //     })
  //   );
  // }

  // getProfile(): Observable<any> {
  //   const token = localStorage.getItem('access_token');
  //   if (!token) {
  //     return throwError('Token is missing');
  //   }

  //   let headers = new HttpHeaders();
  //   headers = headers.set('Authorization', `Bearer ${token}`);

  //   return this.http.get(`${this.apiUrl}/api/users/profile`, { headers });
  // }

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

  // createPayment(total: number, currency: string): Observable<PayPalResponse> {
  //   // Suponiendo que haces una solicitud POST a tu API
  //   return this.http.post<PayPalResponse>(`${this.apiUrl}/api/create-payment`, { total, currency });
  // }

  // executePayment(request:paypalRequest): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/api/payment/success`,request);
  // }

  // getPayPalClientId(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/api/paypal-client-id`);
  // }

  // getTipos(request:TipoListaRequest): Observable<Tipos[]> {
  //   return this.http.post<Tipos[]>(`${this.apiUrl}/api/tipos`,request);  // Cambiar tab_table por tabla_tab
  // }

  // gestionaCelular(formData: GestionaCelularRequest): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/api/gestionaCelular`, formData);
  // }

  // getUsers(user_request:UserListaRequest): Observable<UserResponse[]> {
  //   return this.http.post<UserResponse[]>(`${this.apiUrl}/api/user`,user_request);  // Cambiar tab_table por tabla_tab
  // }

  // apiUserManage(requestUser: UserRequest): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/api/user_manage`, requestUser);
  // }

  // insertTipos(requestTipos:InsertTiposRequest):Observable<any>{
  //   return this.http.post<any>(`${this.apiUrl}/api/insertTipos`, requestTipos);
  // }

  // insertWishList(requesWishList:insertWishListRequest):Observable<any>{
  //   return this.http.post<any>(`${this.apiUrl}/api/gestionaWishList`, requesWishList);
  // }

  // listaWishList(request:listaWishListRequest):Observable<WishListResponse[]>{
  //   return this.http.post<WishListResponse[]>(`${this.apiUrl}/api/listaWishList`, request);
  // }

  // userRegister(request:RegisterRequest):Observable<any>{
  //   return this.http.post<any>(`${this.apiUrl}/api/usuario/newUser`, request);
  // }

  registerClient(encabezado: RegisterClienteRequest): Observable<RegisterClienteResponse> {
    return this.http.post<RegisterClienteResponse>(`${this.apiUrl}/clientes/registro-completo`, encabezado);
  }

  obtenerTipos(req: RequestTipos): Observable<Tipo[]> {
    return this.http
      .post<ResponseTipos>(`${this.apiUrl}/tipos`, req)
      .pipe(map(r => r.data)); // ajusta si tu API responde distinto
  }
}
