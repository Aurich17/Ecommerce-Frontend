import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

// Services and DTOs
import { ApiService } from '../../../../services/api.services';
import { MenuResponseDto } from './domain/modulos.response';

interface MenuDisplay extends MenuResponseDto {
  nivel: number;
  esHijo: boolean;
  nombrePadre?: string;
}

@Component({
  selector: 'app-modulos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    InputTextModule,
    ToolbarModule,
    TooltipModule
  ],
  templateUrl: './modulos.component.html',
  styleUrl: './modulos.component.css'
})
export class ModulosComponent implements OnInit {
  menus: MenuDisplay[] = [];
  menusOriginales: MenuResponseDto[] = [];
  loading = false;
  searchValue = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarMenus();
  }

  cargarMenus() {
    this.loading = true;
    this.api.getAllMenus().subscribe({
      next: (menus) => {
        this.menusOriginales = menus;
        this.procesarMenusParaVisualizacion(menus);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando menús', err);
        this.loading = false;
      }
    });
  }

  private procesarMenusParaVisualizacion(menus: MenuResponseDto[]) {
    const menusDisplay: MenuDisplay[] = [];
    
    // Función recursiva para procesar menús y sus hijos
    const procesarMenu = (menu: MenuResponseDto, nivel: number = 0, nombrePadre?: string) => {
      // Agregar el menú actual
      menusDisplay.push({
        ...menu,
        nivel,
        esHijo: nivel > 0,
        nombrePadre
      });
      
      // Procesar los hijos si existen
      if (menu.children && menu.children.length > 0) {
        menu.children.forEach(hijo => {
          procesarMenu(hijo, nivel + 1, menu.descripcion);
        });
      }
    };
    
    // Procesar todos los menús de nivel raíz
    menus.forEach(menu => {
      procesarMenu(menu);
    });
    
    this.menus = menusDisplay;
  }

  filtrarMenus() {
    if (!this.searchValue.trim()) {
      this.procesarMenusParaVisualizacion(this.menusOriginales);
      return;
    }
    
    const filtrados = this.menusOriginales.filter(menu => 
      menu.descripcion.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      menu.url.toLowerCase().includes(this.searchValue.toLowerCase())
    );
    
    this.procesarMenusParaVisualizacion(filtrados);
  }

  limpiarFiltro() {
    this.searchValue = '';
    this.procesarMenusParaVisualizacion(this.menusOriginales);
  }

  getSeverityForStatus(activo: boolean): 'success' | 'danger' {
    return activo ? 'success' : 'danger';
  }

  getStatusText(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

  getIconClass(icono: string): string {
    return icono || 'pi pi-circle';
  }
}
