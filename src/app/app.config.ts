import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes /*, withDebugTracing() */),
    provideHttpClient(withInterceptorsFromDi()),
    // 👇 Eliminado el APP_INITIALIZER de ActiveCurrencyService
  ],
};
