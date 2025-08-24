import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ActiveCurrencyService } from '../global/active-currency.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes /*, withDebugTracing() */),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      deps: [ActiveCurrencyService],
      multi: true,
      useFactory: (svc: ActiveCurrencyService) => () =>
        firstValueFrom(svc.load()), // <- devuelve una Promise
    },
  ],
};
