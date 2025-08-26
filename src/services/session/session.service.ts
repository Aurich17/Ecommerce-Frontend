/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { LoginResponse } from '../../app/auth/login/domain/response/login.response';

export interface SessionState {
  token: string | null;
  expAt: number | null; // epoch ms
  rol: string | null;
  menu: any[];
  user: {
    id: string;
    full_name: string;
    email: string;
    phone_e164: string;
    social_security_code: string;
    status: string;
  } | null;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  // estado en memoria
  snapshot: SessionState = {
    token: null,
    expAt: null,
    rol: null,
    menu: [],
    user: null,
  };

  setFromLogin(res: LoginResponse) {
    const expAt = Date.now() + res.expires_in * 1000;
    this.snapshot = {
      token: res.token,
      expAt,
      rol: res.rol ?? null,
      menu: res.menu ?? [],
      user: res.user ?? null,
    };
    localStorage.setItem('session', JSON.stringify(this.snapshot));
  }

  restore() {
    const raw = localStorage.getItem('session');
    if (!raw) return;
    try {
      const s = JSON.parse(raw) as SessionState;
      if (s?.expAt && s.expAt > Date.now()) {
        this.snapshot = s; // sesión válida
      } else {
        this.clear(); // expirada
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
}
