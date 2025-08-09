import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';
import { LoginResponse } from '../app/auth/login/domain/response/login.response';
import { LoginRequest } from '../app/auth/login/domain/request/login.request';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  // private apiUrl = 'https://ecommerce-backend-na5u.onrender.com/api'; // URL de tu API

  constructor(private http: HttpClient) {}

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, body);
  }

}
