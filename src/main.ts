import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { importProvidersFrom } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideAnimations(),
    importProvidersFrom(LeafletModule),
    provideHttpClient(withInterceptors([authInterceptor])),
    ...(appConfig.providers ?? []),
  ],
}).catch((err) => console.error(err));
