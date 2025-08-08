import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LandingComponent } from './landing/landing.component';
import { EmpresaComponent } from './auth/register/empresa/empresa.component';
import { ClienteComponent } from './auth/register/cliente/cliente.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LandingComponent
  },
  {
  path: 'register',
  children: [
    { path: '', component: RegisterComponent }, // selección
    { path: 'cliente', component: ClienteComponent },
    { path: 'empresa', component: EmpresaComponent }
  ]
}
];
