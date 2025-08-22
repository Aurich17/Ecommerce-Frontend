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
  FooterRequest,
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
import {
  FaqRequest,
  FeaturesRequest,
} from '../app/admin/landing/cuerpo/domain/cuerpo.request';
import { HowItWorksRequest } from '../app/admin/landing/funcionamiento/domain/funcionamiento.request';
import { TestimonialsRequest } from '../app/admin/landing/comentarios/domain/comentarios.request';
import {
  ApiListResponse,
  SliderDto,
  ApiOneResponse,
  SliderCreateDto,
  SliderUpdateDto,
} from '../app/admin/landing/slider/domain/slider.dto';
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

  createdLandingAudience(payload: AudienceRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/landing/audiences`, payload);
  }

  deleteLandingAudience(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/landing/audiences/${id}`);
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

  createdLandingHowItWord(payload: HowItWorksRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/landing/how-it-works`, payload);
  }

  deleteLandingHowItWord(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/landing/how-it-works/${id}`);
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

  createdLandingTestimonials(payload: TestimonialsRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/landing/testimonials`, payload);
  }

  deleteLandingTestimonials(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/landing/testimonials/${id}`);
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

  createdLandingFAQ(payload: FaqRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/landing/faq`, payload);
  }

  deleteLandingFAQ(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/landing/faq/${id}`);
  }

  getLandingFeatures(): Observable<getLandingFeaturesResponse> {
    return this.http.get<getLandingFeaturesResponse>(
      `${this.apiUrl}/landing/features`
    );
  }

  updateLandingFeatures(id: number, payload: FeaturesRequest): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/landing/features/${id}`,
      payload
    );
  }

  createdLandingFeatures(payload: FeaturesRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/landing/features`, payload);
  }

  deleteLandingFeatures(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/landing/features/${id}`);
  }

  getMantUsuarios(
    params: getMantUsuariosRequest
  ): Observable<getMantUsuariosResponse> {
    return this.http.post<getMantUsuariosResponse>(`${this.apiUrl}/users`, {
      params,
    });
  }

  // LIST
  sliderList(params: {
    page?: number;
    limit?: number;
    q?: string;
    status?: string; // 'true' | 'false'
  }): Observable<ApiListResponse<SliderDto>> {
    let hp = new HttpParams();
    if (params?.page != null) hp = hp.set('page', String(params.page));
    if (params?.limit != null) hp = hp.set('limit', String(params.limit));
    if (params?.q) hp = hp.set('q', params.q);
    if (params?.status != null) hp = hp.set('status', params.status);

    return this.http.get<ApiListResponse<SliderDto>>(
      `${this.apiUrl}/landing/slider`,
      { params: hp }
    );
  }

  // GET ONE
  sliderGet(id: number): Observable<ApiOneResponse<SliderDto>> {
    return this.http.get<ApiOneResponse<SliderDto>>(
      `${this.apiUrl}/landing/slider/${id}`
    );
  }

  // CREATE
  sliderCreate(body: SliderCreateDto): Observable<ApiOneResponse<SliderDto>> {
    return this.http.post<ApiOneResponse<SliderDto>>(
      `${this.apiUrl}/landing/slider`,
      body
    );
  }

  // UPDATE
  sliderUpdate(
    id: number,
    body: SliderUpdateDto
  ): Observable<ApiOneResponse<SliderDto>> {
    return this.http.patch<ApiOneResponse<SliderDto>>(
      `${this.apiUrl}/landing/slider/${id}`,
      body
    );
  }

  // DELETE
  sliderDelete(id: number): Observable<{ success: boolean; data: true }> {
    return this.http.delete<{ success: boolean; data: true }>(
      `${this.apiUrl}/landing/slider/${id}`
    );
  }
}
