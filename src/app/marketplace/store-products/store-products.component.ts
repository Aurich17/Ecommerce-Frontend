import { Component } from '@angular/core';
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
import { MenubarModule } from "primeng/menubar";


@Component({
  selector: 'app-store-products',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, DropdownModule, SliderModule, CheckboxModule, CardModule, ButtonModule, SidebarModule, DividerModule, InputNumberModule, ToastModule, MenubarModule],
  templateUrl: './store-products.component.html',
  providers: [MessageService],
  styleUrl: './store-products.component.css'
})
export class StoreProductsComponent {
    // --- Filtros UI ---
  q = '';
  category = 'Todas';
  categories = ['Todas','Audio','Cámaras','Relojes'];
  minPrice = 0; maxPrice = 6000;
  range = [0, 6000];
  onlyDiscount = false;
  orderBy = 'Relevancia';

  // --- Datos demo ---
  products: Product[] = [
    { id:'p1', name:'Auriculares', price:5000, image:'assets/prod/earbuds.jpg', category:'Audio' },
    { id:'p2', name:'Auriculares', price:5500, image:'assets/prod/headband.jpg', category:'Audio' },
    { id:'p3', name:'Cámara', price:3000, image:'assets/prod/camera.jpg', category:'Cámaras' },
    { id:'p4', name:'Cámara Antigua', price:4000, image:'assets/prod/oldcam.jpg', category:'Cámaras' },
    { id:'p5', name:'Lente de Cámara', price:1500, image:'assets/prod/lens.jpg', category:'Cámaras', discount:50 },
    { id:'p6', name:'Relojes', price:2000, image:'assets/prod/watch.jpg', category:'Relojes' },
  ];

  // --- Carrito ---
  cartOpen = false;
  cart: CartItem[] = [];

  // Cantidad por producto (para el stepper)
  qtyById: Record<string, number> = {};

  constructor(private msg: MessageService) {}

  // Catálogo filtrado
  get list(): Product[] {
    return this.products.filter(p => {
      const okQ = !this.q || p.name.toLowerCase().includes(this.q.toLowerCase());
      const okCat = this.category === 'Todas' || p.category === this.category;
      const price = p.price * (p.discount ? (1 - p.discount/100) : 1);
      const okRange = price >= this.range[0] && price <= this.range[1];
      const okDiscount = !this.onlyDiscount || !!p.discount;
      return okQ && okCat && okRange && okDiscount;
    });
  }

  add(p: Product) {
    const qty = this.qtyById[p.id] ?? 1;
    const item = this.cart.find(ci => ci.product.id === p.id);
    if (item) item.qty += qty;
    else this.cart.push({ product: p, qty });
    this.qtyById[p.id] = 1;
    this.cartOpen = true;
  }

  removeFromCart(p: Product) {
    this.cart = this.cart.filter(ci => ci.product.id !== p.id);
  }

  isInCart(p: Product) {
    return this.cart.some(ci => ci.product.id === p.id);
  }

  inc(ci: CartItem) { ci.qty++; }
  dec(ci: CartItem) { if (ci.qty > 1) ci.qty--; }
  delete(ci: CartItem) { this.cart = this.cart.filter(x => x !== ci); }
  clear() { this.cart = []; }

  get total(): number {
    return this.cart.reduce((sum, ci) => {
      const price = ci.product.price * (ci.product.discount ? (1 - ci.product.discount/100) : 1);
      return sum + price * ci.qty;
    }, 0);
  }

  submitOrder() {
    // aquí llamarías a tu API; por ahora solo feedback
    this.msg.add({ severity:'success', summary:'Orden de compra creada con éxito.' });
    // Mantengo el carrito para que se vea en el sidebar; si quieres, limpia:
    // this.clear();
  }
}
