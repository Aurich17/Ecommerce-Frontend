import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';

import { StoreItem } from './domain/response/marketplace.response';
import { UsersApi } from '../../services/users.api';
// import { UsersApi } from '@/app/services/users.api';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RippleModule,
    PaginatorModule,
    TagModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    MenubarModule,
  ],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.css',
})
export class MarketplaceComponent implements OnInit {
  // Filtros UI locales (si luego vienen del backend, se llenan dinámicamente)
  provinces = ['Todas', 'Ancash', 'La Libertad', 'Lima', 'Kentucky'];
  citiesByProvince: Record<string, string[]> = {
    Ancash: ['Todas', 'Chimbote'],
    'La Libertad': ['Todas', 'Trujillo'],
    Lima: ['Todas', 'Lima'],
    Kentucky: ['Todas', 'Murray'],
    Todas: ['Todas'],
  };

  selectedProvince = 'Todas';
  selectedCity = 'Todas';
  searchTerm = '';

  // Paginación (UI base 0). Backend Nest usa base 1.
  page = 0;
  rows = 6;
  total = 0;

  // Datos visibles (ya vienen paginados por el servidor)
  visibleStores: StoreItem[] = [];

  loading = false;

  constructor(private usersApi: UsersApi) {}

  ngOnInit() {
    this.fetch();
  }

  get cities(): string[] {
    return this.citiesByProvince[this.selectedProvince] ?? ['Todas'];
  }

  // ---- Eventos de UI ----
  onProvinceChange() {
    this.page = 0;
    this.fetch();
  }
  onCityChange() {
    this.page = 0;
    this.fetch();
  }
  onSearchChange() {
    this.page = 0;
    this.fetch();
  }

  onPageChange(e: any) {
    this.page = e.page; // base 0 en la UI
    this.rows = e.rows;
    this.fetch();
  }

  // ---- Carga desde API ----
  private fetch() {
    this.loading = true;

    // Puedes mandar 'roleCod' si quieres solo empresas; ajusta el código real del rol
    const query = this.searchTerm?.trim() || undefined;

    this.usersApi
      .list({
        page: this.page + 1, // backend base 1
        limit: this.rows,
        q: query,
        roleCod: '2', // descomenta si filtras por rol “empresa”
        estCod: '001', // descomenta si filtras por estado
      })
      .subscribe({
        next: (res) => {
          // Mapear respuesta del backend a StoreItem que usa la UI.
          this.visibleStores = res.data.items.map((u) => ({
            id: u.id,
            name: u.fullName,
            welcome: `Bienvenido a la tienda ${u.fullName}`,
            // Cuando expongas estos campos en tu SELECT, reemplaza '—' por u.address/u.province/u.city/u.representative
            address: '—',
            province: '—',
            city: '—',
            representative: '—',
            avatarText: (u.fullName?.[0] || '?').toUpperCase(),
          }));

          this.total = res.data.total;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando usuarios/empresas', err);
          this.visibleStores = [];
          this.total = 0;
          this.loading = false;
        },
      });
  }

  viewProducts(store: StoreItem) {
    console.log('Ver productos de', store.name);
    // routerLink ya lo tienes en el template; aquí podrías navegar programáticamente si lo prefieres
  }
}
