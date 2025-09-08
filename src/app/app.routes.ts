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
import { CategoriasComponent } from './admin/mantenimiento/categorias/categorias.component';
import { SolicitudesComponent } from './admin/mantenimiento/solicitudes/solicitudes.component';
import { ValoresComponent } from './admin/mantenimiento/valores/valores.component';
import { InsigniasComponent } from './admin/mantenimiento/insignias/insignias.component';
// import { MonedasComponent } from './admin/mantenimiento/monedas/monedas.component';
import { OcupacionesComponent } from './admin/mantenimiento/ocupaciones/ocupaciones.component';
import { ProductosComponent } from './admin/mantenimiento/productos/productos.component';
import { PuntosComponent } from './admin/mantenimiento/puntos/puntos.component';
import { UsuariosComponent } from './admin/accesos/usuarios/usuarios.component';
import { RolesComponent } from './admin/accesos/roles/roles.component';
import { ModulosComponent } from './admin/accesos/modulos/modulos.component';
import { PermisosrolComponent } from './admin/accesos/permisosrol/permisosrol.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { StoreProductsComponent } from './marketplace/store-products/store-products.component';
import { AuthGuard } from '../services/guard/auth.guard';
import { ForgotpasswordComponent } from './auth/login/mant-login/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './auth/login/mant-login/resetpassword/resetpassword.component';
import { SolicitudCompraComponent } from './admin/pedidos/solicitud-compra/solicitud-compra.component';
import { SliderComponent } from './admin/landing/slider/slider.component';
import { MisComentariosComponent } from './mis-comentarios/mis-comentarios.component';
import { NegociosComponent } from './admin/mantenimiento/negocios/negocios.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'landing' }, // ⬅️ cambia esto
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingComponent },
  {
    path: 'register',
    children: [
      { path: '', component: RegisterComponent }, // selección
      { path: 'cliente', component: ClienteComponent },
      { path: 'empresa', component: EmpresaComponent },
    ],
  },
  {
    path: 'principal',
    component: PrincipalComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'landing/comentarios', component: ComentariosComponent }, // selección
      { path: 'landing/cuerpo', component: CuerpoComponent },
      { path: 'landing/encabezado', component: EncabezadoComponent },
      { path: 'landing/funcionamiento', component: FuncionamientoComponent },
      { path: 'landing/piepagina', component: PiePaginaComponent },
      { path: 'landing/quienes', component: QuienesComponent },
      { path: 'landing/slider', component: SliderComponent },
      { path: 'mant/categorias', component: CategoriasComponent },
      { path: 'mant/insignias', component: InsigniasComponent },
      // { path: 'mant/monedas', component: MonedasComponent },
      { path: 'mant/negocios', component: NegociosComponent },
      { path: 'mant/ocupaciones', component: OcupacionesComponent },
      { path: 'mant/productos', component: ProductosComponent },
      { path: 'mant/puntos', component: PuntosComponent },
      { path: 'mant/solicitudes', component: SolicitudesComponent },
      { path: 'mant/valores', component: ValoresComponent },
      { path: 'accesos/roles', component: RolesComponent },
      { path: 'accesos/usuarios', component: UsuariosComponent },
      { path: 'accesos/modulos', component: ModulosComponent },
      { path: 'accesos/permisosrol', component: PermisosrolComponent },
      { path: 'marketplace', component: MarketplaceComponent },
      { path: 'store-products/:storeId', component: StoreProductsComponent },
      // { path: 'store-products/:storeId', component: StoreProductsComponent },
      { path: 'pedidos/solicitud-compra', component: SolicitudCompraComponent },
      { path: 'miscomentarios', component: MisComentariosComponent },
    ],
  },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
];
