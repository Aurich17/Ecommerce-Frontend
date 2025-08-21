// services/auth.store.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiMenuItem, LoginResponse } from '../app/auth/login/domain/response/login.response';


@Injectable({ providedIn: 'root' })
export class AuthStore {
  private _menu$ = new BehaviorSubject<ApiMenuItem[]>([]);
  menu$ = this._menu$.asObservable();

  snapshot = {
    token: null as string | null,
    expAt: null as number | null,
    rol: null as string | null,
    menu: [] as ApiMenuItem[],
  };

  restore() {
    const raw = localStorage.getItem('session');
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      if (s?.expAt && s.expAt > Date.now()) {
        this.snapshot = s;
        this._menu$.next(s.menu || []);
      } else {
        this.clear();
      }
    } catch { this.clear(); }
  }

  setFromLogin(res: LoginResponse) {
    const expAt = Date.now() + res.expires_in * 1000;
    this.snapshot = {
      token: res.token,
      expAt,
      rol: res.rol,
      menu: res.menu ?? [],
    };
    localStorage.setItem('session', JSON.stringify(this.snapshot));
    this._menu$.next(this.snapshot.menu);
  }

  clear() {
    this.snapshot = { token: null, expAt: null, rol: null, menu: [] };
    localStorage.removeItem('session');
    this._menu$.next([]);
  }
}
