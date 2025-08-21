import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthTokenStore {
  private KEY = 'token';

  setToken(token: string) { localStorage.setItem(this.KEY, token); }
  getToken(): string | null { return localStorage.getItem(this.KEY); }
  clear() { localStorage.removeItem(this.KEY); }
}
