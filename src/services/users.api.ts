import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment';

export interface UsersListResponse {
  success: boolean;
  data: {
    items: Array<{
      id: string;
      fullName: string;
      email: string;
      status: string;
      roles: { tab: string; cod: string; desc: string }[];
      accountState: { tab: string; cod: string; desc: string };
      createdAt: string;
      // Si luego expones más campos (province, city, address, representative) agrégalos aquí
    }>;
    total: number;
    page: number; // base 1 (Nest)
    limit: number;
  };
}

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private http = inject(HttpClient);
  private base = environment.urlApi; // ajusta a tu backend

  list(opts: {
    page: number;
    limit: number;
    q?: string;
    roleCod?: string;
    estCod?: string;
  }) {
    let params = new HttpParams()
      .set('page', String(opts.page)) // base 1
      .set('limit', String(opts.limit));
    if (opts.q) params = params.set('q', opts.q);
    if (opts.roleCod) params = params.set('roleCod', opts.roleCod);
    if (opts.estCod) params = params.set('estCod', opts.estCod);

    return this.http.get<UsersListResponse>(`${this.base}/users`, { params });
  }
}
