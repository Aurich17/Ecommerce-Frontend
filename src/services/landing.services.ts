import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { ciudadesResponse, paisesResponse, provinciasResponse, tiposResponse } from '../app/auth/register/domain/response/register.response';
import { EncabezadoResponse } from '../app/admin/landing/encabezado/domain/response/encabezado.response';
import { EncabezadoRequest } from '../app/admin/landing/encabezado/domain/request/encabezado.request';
import { environment } from '../environments/environment';
import { getLandingAudienceResponse } from '../app/admin/landing/quienes/domain/quienes.response';
import { getLandingHowItWorksResponse } from '../app/admin/landing/funcionamiento/domain/funcionamiento.response';
import { FooterResponse } from '../app/admin/landing/pie-pagina/domain/pie-pagina.response';
import { getLandingFAQResponse, getLandingFeaturesResponse } from '../app/admin/landing/cuerpo/domain/cuerpo.response';
@Injectable({
  providedIn: 'root'
})
export class LandingService {
  private apiUrl = environment.urlApi;
  // private apiUrl = 'https://ecommerce-backend-na5u.onrender.com/api'; // URL de tu API

  constructor(private http: HttpClient) {}


  getLandingEncabezado(): Observable<EncabezadoResponse> {
    return this.http.get<EncabezadoResponse>(`${this.apiUrl}/landing/encabezado`);
  }

  updateLandingEncabezado(encabezado: EncabezadoRequest): Observable<EncabezadoResponse> {
    return this.http.put<EncabezadoResponse>(`${this.apiUrl}/landing/encabezado`, encabezado);
  }

  getLandingAudience(): Observable<getLandingAudienceResponse> {
    return this.http.get<getLandingAudienceResponse>(`${this.apiUrl}/landing/audiences`);
  }

  getLandingHowItWork(): Observable<getLandingHowItWorksResponse> {
    return this.http.get<getLandingHowItWorksResponse>(`${this.apiUrl}/landing/how-it-works`);
  }

  getLandingTestimonials(): Observable<getLandingHowItWorksResponse> {
    return this.http.get<getLandingHowItWorksResponse>(`${this.apiUrl}/landing/testimonials`);
  }

  getLandingFooter(): Observable<FooterResponse> {
    return this.http.get<FooterResponse>(`${this.apiUrl}/landing/footer`);
  }

  getLandingFAQ(): Observable<getLandingFAQResponse> {
    return this.http.get<getLandingFAQResponse>(`${this.apiUrl}/landing/faq`);
  }

  getLandingFeatures(): Observable<getLandingFeaturesResponse> {
    return this.http.get<getLandingFeaturesResponse>(`${this.apiUrl}/landing/features`);
  }

}
