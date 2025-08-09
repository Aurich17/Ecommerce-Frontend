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
          {
            label: 'Encabezado',
            icon: 'pi pi-eraser',
            route: '/principal/encabezado'
          },
          {
            label: 'Cuerpo',
            icon: 'pi pi-heart',
            route: '/principal/cuerpo'
          },
          {
            label: 'Pie de página',
            icon: 'pi pi-heart',
            route: '/principal/piepagina'
          },
          {
            label: '¿Quiénes pueden usar?',
            icon: 'pi pi-heart',
            route: '/principal/quienes'
          },
          {
            label: '¿Cómo funciona?',
            icon: 'pi pi-heart',
            route: '/principal/funcionamiento'
          },
          {
            label: 'Comentarios',
            icon: 'pi pi-heart',
            route: '/principal/comentarios'
          }
        ]
      },
      {
        label: 'Mantenimiento',
        icon: 'pi pi-home',
        items: [
        ]
      },
      {
        label: 'Accesos',
        icon: 'pi pi-home',
        items: [
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
