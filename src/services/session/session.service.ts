import { Injectable } from '@angular/core';
import { LoginResponse } from '../../app/auth/login/domain/response/login.response';

// session.service.ts
export interface AccountState {
  tab: string;
  cod: string;
  desc: string;
}

export interface SessionUser {
  id: string;
  full_name: string;
  email: string;
  phone_e164: string;
  social_security_code: string;
  status: string | null; // <- sin undefined
  accountState?: AccountState | null; // opcional
}

export interface SessionState {
  token: string | null;
  expAt: number | null;
  rol: string | null;
  menu: any[];
  user: SessionUser | null;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  snapshot: SessionState = {
    token: null,
    expAt: null,
    rol: null,
    menu: [],
    user: null,
  };

  setFromLogin(res: LoginResponse) {
    const expAt = Date.now() + res.expires_in * 1000;

    const sessionUser: SessionUser | null = res.user
      ? {
          id: res.user.id,
          full_name: res.user.full_name,
          email: res.user.email,
          phone_e164: res.user.phone_e164,
          social_security_code: res.user.social_security_code,
          status: res.user.status ?? null, // <- normaliza
          accountState: res.user.accountState ?? null, // <- normaliza
        }
      : null;

    // opcional: guardar estado también en una clave separada
    if (sessionUser?.accountState) {
      localStorage.setItem(
        'account_state',
        JSON.stringify(sessionUser.accountState)
      );
    } else {
      localStorage.removeItem('account_state');
    }

    this.snapshot = {
      token: res.token,
      expAt,
      rol: res.rol ?? null,
      menu: res.menu ?? [],
      user: sessionUser,
    };

    localStorage.setItem('session', JSON.stringify(this.snapshot));
  }

  restore() {
    const raw = localStorage.getItem('session');
    if (!raw) return;
    try {
      const s = JSON.parse(raw) as SessionState;
      if (s?.expAt && s.expAt > Date.now()) {
        this.snapshot = s;
      } else {
        this.clear();
      }
    } catch {
      this.clear();
    }
  }

  clear() {
    this.snapshot = {
      token: null,
      expAt: null,
      rol: null,
      menu: [],
      user: null,
    };
    localStorage.removeItem('session');
    localStorage.removeItem('account_state');
  }

  get token() {
    return this.snapshot.token;
  }
  get user() {
    return this.snapshot.user;
  }
  get userId() {
    return this.snapshot.user?.id || null;
  }
  get accountState() {
    return this.snapshot.user?.accountState ?? null;
  }
}
