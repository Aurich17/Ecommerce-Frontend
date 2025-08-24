import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private apiUrl = environment.urlApi; // URL del backend NestJS

  constructor(private http: HttpClient) {}

  sendMail(to: string, subject: string, text: string) {
    return this.http.post(`${this.apiUrl}/mail/send`, { to, subject, text });
  }
}
