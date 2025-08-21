import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, ActivatedRouteSnapshot,
  RouterStateSnapshot, UrlTree, Router
} from '@angular/router';
import { AuthTokenStore } from '../auth-token.store';

type JwtPayload = { exp: number; rol?: string | null; rol_cod?: string | null };

function decodeJwt<T = any>(token: string): T | null {
  try {
    const payload = token.split('.')[1]
      .replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(escape(atob(payload)));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private store: AuthTokenStore, private router: Router) {}

  private check(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const token = this.store.getToken();
    if (!token) {
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    const payload = decodeJwt<JwtPayload>(token);
    const now = Math.floor(Date.now() / 1000);
    if (!payload || !payload.exp || payload.exp <= now) {
      this.store.clear();
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    // Autorización por rol (opcional)
    const requiredRoles = route.data?.['roles'] as string[] | undefined;
    if (requiredRoles?.length) {
      const userRoleDesc = (payload.rol || '').toLowerCase();
      const userRoleCod  = String(payload.rol_cod ?? '').toLowerCase();
      const ok =
        requiredRoles.some(r => r.toLowerCase() === userRoleDesc) ||
        requiredRoles.some(r => r.toLowerCase() === userRoleCod);
      if (!ok) return this.router.createUrlTree(['/forbidden']); // crea esta ruta si quieres
    }

    return true;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.check(route, state);
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.check(route, state);
  }
}
