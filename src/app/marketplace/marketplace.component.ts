import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { StoreItem } from './domain/response/marketplace.response';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from "primeng/menubar";

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [RippleModule, PaginatorModule, TagModule, AvatarModule, ButtonModule, CardModule, InputTextModule, DropdownModule, CommonModule, FormsModule, ReactiveFormsModule, MenubarModule],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.css'
})
export class MarketplaceComponent implements OnInit{
    provinces = ['Todas','Ancash','La Libertad','Lima','Kentucky'];
  citiesByProvince: Record<string,string[]> = {
    'Ancash':['Todas','Chimbote'],
    'La Libertad':['Todas','Trujillo'],
    'Lima':['Todas','Lima'],
    'Kentucky':['Todas','Murray'],
    'Todas':['Todas']
  };

  // Mock data (cámbialo por tu servicio)
  allStores: StoreItem[] = [
    { id:'1', name:'Alexis Gamer', welcome:'Bienvenido a la tienda Alexis Gamer',
      address:'Avenida Pacífico, Nuevo Chimbote, Ancash, Peru', province:'Ancash', city:'Chimbote', representative:'Alexis Valverde', avatarText:'A' },
    { id:'2', name:'Bata', welcome:'Bienvenido a la tienda Bata',
      address:'Calle Tokio, Trujillo, La Libertad, Peru', province:'La Libertad', city:'Trujillo', representative:'Luis Vigo', avatarText:'B' },
    { id:'3', name:'Carlos', welcome:'Bienvenido a la tienda Carlos',
      address:'Av. Tecnológica 123, Lima', province:'Lima', city:'Lima', representative:'María Torres', avatarText:'C' },
    { id:'4', name:'Empresa con dirección', welcome:'Bienvenido a la tienda Empresa con dirección',
      address:'—', province:'Ancash', city:'Chimbote', representative:'Sin representante', avatarText:'E' },
    { id:'5', name:'empresa de prueba', welcome:'Bienvenido a la tienda empresa de prueba',
      address:'Murray, Kentucky, United States', province:'Kentucky', city:'Murray', representative:'sadhu', avatarText:'e' },
    // agrega más para probar la paginación…
  ];

  // Filtros + estado UI
  selectedProvince = 'Todas';
  selectedCity = 'Todas';
  searchTerm = '';

  // Paginación
  page = 0;
  rows = 6; // 3 por fila x 2 filas
  total = 0;

  visibleStores: StoreItem[] = [];

  ngOnInit() { this.applyFilters(); }

  get cities(): string[] {
    return this.citiesByProvince[this.selectedProvince] ?? ['Todas'];
  }

  onProvinceChange() {
    this.selectedCity = 'Todas';
    this.page = 0;
    this.applyFilters();
  }

  onCityChange() {
    this.page = 0;
    this.applyFilters();
  }

  onSearchChange() {
    this.page = 0;
    this.applyFilters();
  }

  onPageChange(e: any) {
    this.page = e.page;
    this.rows = e.rows;
    this.slicePage(this.filtered());
  }

  private filtered(): StoreItem[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.allStores.filter(s => {
      const okProv = this.selectedProvince === 'Todas' || s.province === this.selectedProvince;
      const okCity = this.selectedCity === 'Todas' || s.city === this.selectedCity;
      const okTerm = !term ||
        s.name.toLowerCase().includes(term) ||
        s.representative?.toLowerCase().includes(term);
      return okProv && okCity && okTerm;
    });
  }

  private slicePage(list: StoreItem[]) {
    this.total = list.length;
    const start = this.page * this.rows;
    this.visibleStores = list.slice(start, start + this.rows);
  }

  private applyFilters() {
    const list = this.filtered();
    this.slicePage(list);
  }

  viewProducts(store: StoreItem) {
    // navega a /stores/:id/products o lanza diálogo
    console.log('Ver productos de', store.name);
  }
}
