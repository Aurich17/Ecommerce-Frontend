import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LandingComponent } from './landing/landing.component';
import { ClienteComponent } from './auth/register/cliente/cliente.component';
import { EmpresaComponent } from './auth/register/empresa/empresa.component';
import { PrincipalComponent } from './admin/principal/principal.component';
import { ComentariosComponent } from './admin/landing/comentarios/comentarios.component';
import { CuerpoComponent } from './admin/landing/cuerpo/cuerpo.component';
import { EncabezadoComponent } from './admin/landing/encabezado/encabezado.component';
import { FuncionamientoComponent } from './admin/landing/funcionamiento/funcionamiento.component';
import { PiePaginaComponent } from './admin/landing/pie-pagina/pie-pagina.component';
import { QuienesComponent } from './admin/landing/quienes/quienes.component';

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
  },
  {
    path: 'principal',
    component: PrincipalComponent,
    children: [
      { path: 'comentarios', component: ComentariosComponent }, // selección
      { path: 'cuerpo', component: CuerpoComponent },
      { path: 'encabezado', component: EncabezadoComponent },
      { path: 'funcionamiento', component: FuncionamientoComponent },
      { path: 'piepagina', component: PiePaginaComponent },
      { path: 'quienes', component: QuienesComponent }
    ]
  }

];
