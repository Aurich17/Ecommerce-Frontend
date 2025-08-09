import { Injectable } from '@angular/core';
import { LoginResponse } from '../../app/auth/login/domain/response/login.response';


@Injectable({ providedIn: 'root' })
export class SessionService {
  private USER_KEY = 'fx_user';
  private TOKEN_KEY = 'fx_token';

  setFromLogin(res: LoginResponse) {
    localStorage.setItem(this.USER_KEY, JSON.stringify({
      id: res.cliente.id,
      email: res.cliente.email,
      rol: res.rol,
    }));
    if (res.token) {
      localStorage.setItem(this.TOKEN_KEY, res.token);
    }
  }

  clear() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
