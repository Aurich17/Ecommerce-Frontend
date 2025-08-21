import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideAnimations(),
    provideHttpClient(),
    ...(appConfig.providers ?? []),
  ]
})
  .catch((err) => console.error(err));
