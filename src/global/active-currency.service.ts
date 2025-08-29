// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { map, tap, shareReplay, finalize } from 'rxjs/operators';
// import { Currency } from '../app/admin/mantenimiento/monedas/domain/monedas.response';
// import { ApiService } from '../services/api.services';
// // import { ApiService } from '../api.services';
// // import { Currency } from '@/app/pages/.../domain/monedas.response';

// @Injectable({ providedIn: 'root' })
// export class ActiveCurrencyService {
//   private readonly STORAGE_KEY = 'activeCurrency:v1';

//   private subject = new BehaviorSubject<Currency | null>(
//     this.loadFromStorage()
//   );
//   /** Úsalo en templates con | async */
//   readonly active$ = this.subject.asObservable();

//   private inflight$?: Observable<Currency | null>;

//   constructor(private api: ApiService) {}

//   /** Carga del backend (solo una vez) o fuerza recarga con force=true */
//   load(force = false): Observable<Currency | null> {
//     if (this.subject.value && !force) return of(this.subject.value);
//     if (this.inflight$ && !force) return this.inflight$;

//     this.inflight$ = this.api.getCurrencies({ status: true, limit: 1 }).pipe(
//       map((arr) => (Array.isArray(arr) ? arr[0] : null) ?? null),
//       tap((curr) => this.setActive(curr)),
//       finalize(() => (this.inflight$ = undefined)),
//       shareReplay(1)
//     );
//     return this.inflight$;
//   }

//   /** Estado actual síncrono (para usar en TS) */
//   get snapshot(): Currency | null {
//     return this.subject.value;
//   }

//   /** Asigna manualmente (p. ej., tras activar/desactivar) */
//   setActive(curr: Currency | null) {
//     this.subject.next(curr);
//     this.saveToStorage(curr);
//   }

//   refresh(): Observable<Currency | null> {
//     return this.load(true);
//   }

//   // ---- storage helpers ----
//   private loadFromStorage(): Currency | null {
//     try {
//       const raw = localStorage.getItem(this.STORAGE_KEY);
//       return raw ? (JSON.parse(raw) as Currency) : null;
//     } catch {
//       return null;
//     }
//   }
//   private saveToStorage(curr: Currency | null) {
//     try {
//       if (curr) localStorage.setItem(this.STORAGE_KEY, JSON.stringify(curr));
//       else localStorage.removeItem(this.STORAGE_KEY);
//     } catch {}
//   }
// }
