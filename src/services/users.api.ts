import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment';

export interface UsersListResponse {
  success: boolean;
  data: {
    items: Array<{ id: string; fullName: string /* ... */ }>;
    total: number;
    page: number;
    limit: number;
  };
}

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private http = inject(HttpClient);
  private base = environment.urlApi;
  list(opts: {
    page: number;
    limit: number;
    q?: string;
    roleId?: number;
    estCod?: string;
  }) {
    let params = new HttpParams()
      .set('page', String(opts.page))
      .set('limit', String(opts.limit));

    if (opts.q?.trim()) params = params.set('q', opts.q.trim());
    if (opts.roleId != null) params = params.set('roleId', String(opts.roleId)); // << clave
    if (opts.estCod) params = params.set('estCod', opts.estCod);

    return this.http.get<UsersListResponse>(`${this.base}/users`, { params });
  }
}
