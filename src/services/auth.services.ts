// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginRequest } from '../app/auth/login/domain/request/login.request';
import { LoginResponse } from '../app/auth/login/domain/response/login.response';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.urlApi;
  constructor(private http: HttpClient, private store: AuthStore) {}

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, body)
      .pipe(tap((res) => this.store.setFromLogin(res))); // guarda token/exp/rol/menu
  }
}
