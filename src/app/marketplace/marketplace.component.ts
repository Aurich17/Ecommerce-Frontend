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
import { Router } from '@angular/router';

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

  page = 0; // base 0 (UI)
  rows = 6;
  total = 0;

  visibleStores: StoreItem[] = [];
  loading = false;

  constructor(private usersApi: UsersApi, private router: Router) {}
  ngOnInit() {
    this.fetch();
  }

  get cities(): string[] {
    return this.citiesByProvince[this.selectedProvince] ?? ['Todas'];
  }
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
    this.page = e.page;
    this.rows = e.rows;
    this.fetch();
  }

  private fetch() {
    this.loading = true;
    const query = this.searchTerm?.trim() || undefined;

    this.usersApi
      .list({
        page: this.page + 1, // backend base 1
        limit: this.rows,
        q: query,
        roleId: 2, // << AQUÍ el filtro por rol
        estCod: '001', // si quieres solo activos; quítalo si no aplica
      })
      .subscribe({
        next: (res) => {
          console.log('Usuarios/Empresas:', res);

          // Verificar que res.data existe y es un array
          if (res && res.data && Array.isArray(res.data)) {
            this.visibleStores = res.data.map((u) => ({
              id: u.id,
              name: u.fullName,
              welcome: `Bienvenido a la tienda ${u.fullName}`,
              address: '—',
              province: '—',
              city: '—',
              representative: '—',
              avatarText: (u.fullName?.[0] || '?').toUpperCase(),
            }));
            // Como no hay total en la respuesta, usar la longitud del array
            this.total = res.data.length;
          } else {
            console.warn('Estructura de respuesta inesperada:', res);
            this.visibleStores = [];
            this.total = 0;
          }

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

  viewProducts(store: any) {
    this.router.navigate(['/principal/store-products', store.id]);
  }
}
