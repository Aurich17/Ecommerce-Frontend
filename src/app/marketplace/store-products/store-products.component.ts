/* eslint-disable @angular-eslint/prefer-inject */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CartItem, Product } from '../domain/response/marketplace.response';
import { MenubarModule } from 'primeng/menubar';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.services';
import { SessionService } from '../../../services/session/session.service';
import {
  ProductListResponse,
  ProductListItem,
} from '../../admin/mantenimiento/productos/domain/productos.response';

@Component({
  selector: 'app-store-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    SliderModule,
    CheckboxModule,
    CardModule,
    ButtonModule,
    SidebarModule,
    DividerModule,
    InputNumberModule,
    ToastModule,
    MenubarModule,
  ],
  templateUrl: './store-products.component.html',
  providers: [MessageService],
  styleUrl: './store-products.component.css',
})
export class StoreProductsComponent implements OnInit {
  // --- Filtros UI ---
  q = '';
  category = 'Todas';
  categories = ['Todas', 'Audio', 'Cámaras', 'Relojes'];
  minPrice = 0;
  maxPrice = 6000;
  range = [0, 6000];
  onlyDiscount = false;
  orderBy = 'Relevancia';

  // --- Datos reales de la API ---
  products: Product[] = [];
  storeId: string | null = null;
  currentUserId: string | null = null;
  loading = false;

  // --- Carrito ---
  cartOpen = false;
  cart: CartItem[] = [];

  // Cantidad por producto (para el stepper)
  qtyById: Record<string, number> = {};

  constructor(
    private msg: MessageService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    // Obtener el storeId de la ruta
    this.storeId = this.route.snapshot.paramMap.get('storeId');
    console.log('Store ID recibido:', this.storeId);

    // Obtener el usuario actual de la sesión
    // this.currentUserId = this.sessionService.getUser()?.id || null;

    // Cargar productos de la tienda específica
    if (this.storeId) {
      this.loadStoreProducts();
    }
  }

  loadStoreProducts() {
    if (!this.storeId) return;

    this.loading = true;
    this.apiService
      .getProducts({
        sellerUserId: this.storeId,
        enabled: 'true', // Solo productos habilitados
      })
      .subscribe({
        next: (response: ProductListResponse | any) => {
          console.log('API products response', response);

          // Normalización defensiva
          const raw = response?.data ?? response;
          const list = Array.isArray(raw)
            ? raw
            : raw?.items ?? raw?.rows ?? (raw ? [raw] : []);

          // Mapear ProductListItem a Product
          // En el método loadStoreProducts(), cambia esta línea:
          this.products = (list as ProductListItem[]).map((item) => ({
            id: item.id.toString(),
            name: item.name,
            price: Number(item.price_amount), // ← Convertir a número aquí
            image: item.url_img || 'assets/prod/default.jpg',
            discount: item.discount_percent,
            category: 'General',
          }));

          // Actualizar categorías dinámicamente
          // this.categories = uniqueCategories;

          this.loading = false;
        },
        error: () => {
          this.msg.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar productos de la tienda',
          });
          this.loading = false;
        },
      });
  }

  // Catálogo filtrado
  get list(): Product[] {
    return this.products.filter((p) => {
      const okQ =
        !this.q || p.name.toLowerCase().includes(this.q.toLowerCase());
      const okCat = this.category === 'Todas' || p.category === this.category;
      const price = p.price * (p.discount ? 1 - p.discount / 100 : 1);
      const okRange = price >= this.range[0] && price <= this.range[1];
      const okDiscount = !this.onlyDiscount || !!p.discount;
      return okQ && okCat && okRange && okDiscount;
    });
  }

  add(p: Product) {
    console.log('Agregando producto:', p);
    console.log('Carrito antes:', this.cart);

    const qty = this.qtyById[p.id] ?? 1;
    const item = this.cart.find((ci) => ci.product.id === p.id);
    if (item) {
      item.qty += qty;
      console.log('Producto ya existía, nueva cantidad:', item.qty);
    } else {
      this.cart.push({ product: p, qty });
      console.log('Producto agregado al carrito');
    }

    this.qtyById[p.id] = 1;
    this.cartOpen = true;

    console.log('Carrito después:', this.cart);
  }

  removeFromCart(p: Product) {
    this.cart = this.cart.filter((ci) => ci.product.id !== p.id);
  }

  isInCart(p: Product) {
    return this.cart.some((ci) => ci.product.id === p.id);
  }

  inc(ci: CartItem) {
    ci.qty++;
  }
  dec(ci: CartItem) {
    if (ci.qty > 1) ci.qty--;
  }
  delete(ci: CartItem) {
    this.cart = this.cart.filter((x) => x !== ci);
  }
  clear() {
    this.cart = [];
  }

  get total(): number {
    return this.cart.reduce((sum, ci) => {
      const price =
        ci.product.price *
        (ci.product.discount ? 1 - ci.product.discount / 100 : 1);
      return sum + price * ci.qty;
    }, 0);
  }

  submitOrder() {
    // aquí llamarías a tu API; por ahora solo feedback
    this.msg.add({
      severity: 'success',
      summary: 'Orden de compra creada con éxito.',
    });
    // Mantengo el carrito para que se vea en el sidebar; si quieres, limpia:
    // this.clear();
  }
}
