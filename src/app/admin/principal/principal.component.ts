import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [PanelMenuModule,CommonModule,CardModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  constructor(private router: Router) {}
  items: MenuItem[] | undefined;
  selectedContent: string = 'Bienvenido';
  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-palette',
        items: [
        ]
      },
      {
        label: 'Landing',
        icon: 'pi pi-link',
        items: [
          { label: 'Encabezado', icon: 'pi pi-eraser', route: '/principal/landing/encabezado' },
          { label: 'Cuerpo', icon: 'pi pi-heart', route: '/principal/landing/cuerpo' },
          { label: 'Pie de página', icon: 'pi pi-heart', route: '/principal/landing/piepagina' },
          { label: '¿Quiénes pueden usar?', icon: 'pi pi-heart', route: '/principal/landing/quienes' },
          { label: '¿Cómo funciona?', icon: 'pi pi-heart', route: '/principal/landing/funcionamiento' },
          { label: 'Comentarios', icon: 'pi pi-heart', route: '/principal/landing/comentarios' }
        ]
      },
      {
        label: 'Mantenimiento',
        icon: 'pi pi-home',
        items: [
          { label: 'Productos', icon: 'pi pi-eraser', route: '/principal/mant/productos' },
          { label: 'Categorías', icon: 'pi pi-heart', route: '/principal/mant/categorias' },
          { label: 'Ocupaciones', icon: 'pi pi-heart', route: '/principal/mant/ocupaciones' },
          { label: 'Monedas', icon: 'pi pi-heart', route: '/principal/mant/monedas' },
          { label: 'Valores', icon: 'pi pi-heart', route: '/principal/mant/valores' },
          { label: 'Puntos', icon: 'pi pi-heart', route: '/principal/mant/puntos' },
          { label: 'Insignias', icon: 'pi pi-heart', route: '/principal/mant/insignias' },
          { label: 'Solicitudes', icon: 'pi pi-heart', route: '/principal/mant/solicitudes' }
        ]
      },
      {
        label: 'Accesos',
        icon: 'pi pi-home',
        items: [
          { label: 'Roles', icon: 'pi pi-eraser', route: '/principal/accesos/roles' },
          { label: 'Usuarios', icon: 'pi pi-heart', route: '/principal/accesos/usuarios' },
          { label: 'Módulos', icon: 'pi pi-heart', route: '/principal/accesos/modulos' }
        ]
      },
      {
        label: 'Seguridad',
        icon: 'pi pi-home',
        items: [
        ]
      },
      {
        label: 'Informes',
        icon: 'pi pi-home',
        route: '/configuration'
      }
    ];
  }
}
