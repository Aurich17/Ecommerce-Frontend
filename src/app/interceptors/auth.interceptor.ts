import { HttpInterceptorFn } from '@angular/common/http';

function getTokenFromStorage(): string | null {
  const raw = localStorage.getItem('session');
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    // opcional: validar expiración si guardas expAt
    if (s?.expAt && Date.now() > Number(s.expAt)) return null;
    return s?.token ?? null;
  } catch {
    return null;
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // No adjuntar token a login/refresh (opcional)
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const token = getTokenFromStorage();
  if (token) {
    const withAuth = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(withAuth);
  }
  return next(req);
};
