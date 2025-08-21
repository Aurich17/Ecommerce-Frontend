import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { SessionService } from "../session/session.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private session: SessionService, private router: Router) {}

  private check(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    this.session.restore(); // ← ahora existe
    const { token, expAt, rol } = this.session.snapshot; // ← ahora existe

    if (!token) {
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }
    const expOk = !!expAt && expAt > Date.now();
    if (!expOk) {
      this.session.clear();
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    const requiredRoles = route.data?.['roles'] as string[] | undefined;
    if (requiredRoles?.length) {
      const ok = requiredRoles.some(r => r.toLowerCase() === (rol ?? '').toLowerCase());
      if (!ok) return this.router.createUrlTree(['/forbidden']);
    }

    return true;
  }

  canActivate(r: ActivatedRouteSnapshot, s: RouterStateSnapshot) { return this.check(r, s); }
  canActivateChild(r: ActivatedRouteSnapshot, s: RouterStateSnapshot) { return this.check(r, s); }
}
