import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthStore } from '../auth.store';
// import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private store: AuthStore, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    this.store.restore(); // por si acaso
    const expectedRoles: string[] = route.data?.['roles'] ?? [];
    const current = this.store.snapshot;

    const isLoggedIn = !!current.token && !!current.expAt && current.expAt > Date.now();
    const hasRole = expectedRoles.length === 0 || expectedRoles.includes(current.rol || '');

    if (isLoggedIn && hasRole) return true;

    return this.router.parseUrl('/login'); // o a donde prefieras
  }
}
