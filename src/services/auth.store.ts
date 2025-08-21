// auth.store.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiMenuItem, LoginResponse } from '../app/auth/login/domain/response/login.response';
// import { LoginResponse, ApiMenuItem } from './auth.models';

type SessionState = {
  token: string | null;
  expAt: number | null;     // epoch ms
  rol: string | null;
  menu: ApiMenuItem[];
  userFullName: string | null;
};

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private state: SessionState = {
    token: null,
    expAt: null,
    rol: null,
    menu: [],
    userFullName: null
  };
  private state$ = new BehaviorSubject(this.state);

  get token()      { return this.state.token; }
  get expAt()      { return this.state.expAt; }
  get rol()        { return this.state.rol; }
  get menu$()      { return this.state$.asObservable(); }
  get snapshot()   { return this.state; }

  setLogin(res: LoginResponse) {
    const expAt = Date.now() + res.expires_in * 1000;
    this.state = {
      token: res.token,
      expAt,
      rol: res.rol,
      menu: res.menu ?? [],
      userFullName: res.user.full_name
    };
    this.state$.next(this.state);
    localStorage.setItem('session', JSON.stringify(this.state));
  }

  restore() {
    const raw = localStorage.getItem('session');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as SessionState;
      // expirar si ya caducó
      if (parsed.expAt && parsed.expAt > Date.now()) {
        this.state = parsed;
        this.state$.next(this.state);
      } else {
        this.clear();
      }
    } catch { this.clear(); }
  }

  clear() {
    this.state = { token: null, expAt: null, rol: null, menu: [], userFullName: null };
    this.state$.next(this.state);
    localStorage.removeItem('session');
  }
}
