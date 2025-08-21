import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
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
  tiposResponse,
} from '../app/auth/register/domain/response/register.response';
import { EncabezadoResponse } from '../app/admin/landing/encabezado/domain/response/encabezado.response';
import {
  AudienceRequest,
  EncabezadoRequest,
  FaqRequest,
  FeaturesRequest,
  FooterRequest,
  HowItWorksRequest,
  TestimonialsRequest,
} from '../app/admin/landing/encabezado/domain/request/encabezado.request';
import { environment } from '../environments/environment';
import { getLandingAudienceResponse } from '../app/admin/landing/quienes/domain/quienes.response';
import { getLandingHowItWorksResponse } from '../app/admin/landing/funcionamiento/domain/funcionamiento.response';
import { FooterResponse } from '../app/admin/landing/pie-pagina/domain/pie-pagina.response';
import {
  getLandingFAQResponse,
  getLandingFeaturesResponse,
} from '../app/admin/landing/cuerpo/domain/cuerpo.response';
import { getMantTiposResponse } from '../app/admin/accesos/roles/domain/roles.response';
import { getMantUsuariosRequest } from '../app/admin/accesos/usuarios/domain/usuarios.request';
import { getMantUsuariosResponse } from '../app/admin/accesos/usuarios/domain/usuarios.response';
@Injectable({
  providedIn: 'root',
})
export class LandingService {
  private apiUrl = environment.urlApi;
  // private apiUrl = 'https://ecommerce-backend-na5u.onrender.com/api'; // URL de tu API

  constructor(private http: HttpClient) {}

  getLandingEncabezado(): Observable<EncabezadoResponse> {
    return this.http.get<EncabezadoResponse>(
      `${this.apiUrl}/landing/encabezado`
    );
  }

  updateLandingEncabezado(
    encabezado: EncabezadoRequest
  ): Observable<EncabezadoResponse> {
    return this.http.put<EncabezadoResponse>(
      `${this.apiUrl}/landing/encabezado`,
      encabezado
    );
  }

  getLandingAudience(): Observable<getLandingAudienceResponse> {
    return this.http.get<getLandingAudienceResponse>(
      `${this.apiUrl}/landing/audiences`
    );
  }

  updateLandingAudience(id: number, payload: AudienceRequest): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/landing/audiences/${id}`,
      payload
    );
  }

  getLandingHowItWork(): Observable<getLandingHowItWorksResponse> {
    return this.http.get<getLandingHowItWorksResponse>(
      `${this.apiUrl}/landing/how-it-works`
    );
  }

  updateLandingHowItWord(
    id: number,
    encabezado: HowItWorksRequest
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/landing/how-it-works/${id}`,
      encabezado
    );
  }

  getLandingTestimonials(): Observable<getLandingHowItWorksResponse> {
    return this.http.get<getLandingHowItWorksResponse>(
      `${this.apiUrl}/landing/testimonials`
    );
  }

  updateLandingTestimonials(
    id: number,
    encabezado: TestimonialsRequest
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/landing/testimonials/${id}`,
      encabezado
    );
  }

  getLandingFooter(): Observable<FooterResponse> {
    return this.http.get<FooterResponse>(`${this.apiUrl}/landing/footer`);
  }

  updateLandingFooter(id: number, encabezado: FooterRequest): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/landing/footer/${id}`,
      encabezado
    );
  }

  getLandingFAQ(): Observable<getLandingFAQResponse> {
    return this.http.get<getLandingFAQResponse>(`${this.apiUrl}/landing/faq`);
  }

  updateLandingFAQ(id: number, encabezado: FaqRequest): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/landing/faq/${id}`, encabezado);
  }

  getLandingFeatures(): Observable<getLandingFeaturesResponse> {
    return this.http.get<getLandingFeaturesResponse>(
      `${this.apiUrl}/landing/features`
    );
  }

  getMantUsuarios(
    params: getMantUsuariosRequest
  ): Observable<getMantUsuariosResponse> {
    return this.http.post<getMantUsuariosResponse>(`${this.apiUrl}/users`, {
      params,
    });
  }

  updateLandingFeatures(
    id: number,
    encabezado: FeaturesRequest
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/landing/features/${id}`,
      encabezado
    );
  }
}
