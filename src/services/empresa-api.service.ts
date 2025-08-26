// src/app/services/empresa-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

export interface RegistroEmpresaOut {
  user_id: string;
  social_security: string;
}

export interface RegistroEmpresaRequest {
  company_name: string;
  ruc: string;
  email: string;
  password: string;
  phone_e164?: string;
  business_type_cod?: string;
  country_cod: string;
  province_cod: string;
  municipality_cod: string;
  founded_on?: string;
  employee_count?: number;
  fiscal_address?: string;
  city?: string;
  postal_code?: string;
  website?: string;
  doc_urls?: string[];
  role_id?: number;
}

@Injectable({ providedIn: 'root' })
export class EmpresaApiService {
  private base = environment.urlApi;

  constructor(private http: HttpClient) {}

  // Sube 1 archivo y devuelve la URL pública
  uploadDoc(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http
      .post<{ url: string }>(`${this.base}/docs`, form)
      .pipe(map((r) => r.url));
  }

  // Registrar empresa usando la nueva API
  registrar(dto: RegistroEmpresaRequest): Observable<RegistroEmpresaOut> {
    return this.http.post<RegistroEmpresaOut>(
      `${this.base}/companies/register`,
      dto
    );
  }

  // Listar todas las empresas
  listarEmpresas(): Observable<any> {
    return this.http.get(`${this.base}/companies`);
  }

  // Obtener empresa por ID
  obtenerEmpresa(userId: string): Observable<any> {
    return this.http.get(`${this.base}/companies/${userId}`);
  }

  // Actualizar empresa
  actualizarEmpresa(
    userId: string,
    datos: Partial<RegistroEmpresaRequest>
  ): Observable<any> {
    return this.http.patch(`${this.base}/companies/${userId}`, datos);
  }
}
