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
import { MailService } from '../../../services/mail/mail.service';
import { SupabaseService } from '../../../services/supabase.service';

type AccountState = { tab: string; cod: string; desc?: string } | null;
interface OrderItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  discount?: number;
  subtotal: number;
  image?: string;
}
interface Order {
  number: string;
  buyerEmail: string;
  currency: 'USD';
  items: OrderItem[];
  total: number;
}

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
    private sessionService: SessionService,
    private mailService: MailService,
    private supa: SupabaseService
  ) {}

  ngOnInit() {
    this.getBuyerIds();
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

  priceAfterDiscount(p: Product): number {
    return p.price * (p.discount ? 1 - p.discount / 100 : 1);
  }
  subtotal(ci: CartItem): number {
    return this.priceAfterDiscount(ci.product) * ci.qty;
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

  private isAccountApproved(): boolean {
    // 1) account_state => aprobado si EST/002
    const raw = localStorage.getItem('account_state');
    console.log(raw);
    if (raw) {
      try {
        const st: AccountState = JSON.parse(raw);
        if (st && st.tab === 'EST' && st.cod === '002') return true;
      } catch {
        /* ignore JSON error */
      }
    }

    // 2) fallback: session.user.status (aprobado / habilitado / activo)
    const sraw = localStorage.getItem('session');
    if (sraw) {
      try {
        const s = JSON.parse(sraw);
        const legacy = String(s?.user?.status || '').toLowerCase();
        if (['aprobado', 'habilitado', 'activo'].includes(legacy)) return true;
      } catch {
        /* ignore */
      }
    }

    return false;
  }

  private getAccountStateLabel(): string {
    const raw = localStorage.getItem('account_state');
    if (raw) {
      try {
        const st: AccountState = JSON.parse(raw);
        if (st) return st.desc || `${st.tab}/${st.cod}`;
      } catch {
        /* ignore */
      }
    }
    const sraw = localStorage.getItem('session');
    if (sraw) {
      try {
        const s = JSON.parse(sraw);
        if (s?.user?.status) return s.user.status;
      } catch {
        /* ignore */
      }
    }
    return 'desconocido';
  }

  submitOrder() {
    if (!this.cart.length) {
      this.msg.add({ severity: 'warn', summary: 'Carrito vacío' });
      return;
    }
    if (!this.isAccountApproved()) {
      this.msg.add({
        severity: 'warn',
        summary: 'Su cuenta no está habilitada para compras',
        detail: `Estado actual: ${this.getAccountStateLabel()}`,
      });
      return;
    }

    // Usamos un id_orden numérico (bigint OK)
    const orderId = Date.now(); // ej. 1724... (ms)
    const detalles = this.cart.map((ci) => ({
      id_producto: Number(ci.product.id), // ← bigint
      cantidad: ci.qty,
      total_producto: this.subtotal(ci), // unit*qty con descuento
      id_orden: orderId,
      id_cliente: this.sessionService.user?.id, // 👈 ahora se guarda
      id_empresa: this.storeId,
    }));

    // 1) Guarda detalle_compra
    this.supa
      .insertDetallesCompra(detalles)
      .then(() => {
        // 2) Email (HTML) con el resumen (reutiliza tu buildOrderEmail)
        const order = {
          number: 'OC-' + orderId,
          buyerEmail: this.sessionService.user?.email || 'ventas@fiaox.com',
          currency: 'USD',
          items: this.cart.map((ci) => ({
            id: ci.product.id,
            name: ci.product.name,
            qty: ci.qty,
            unitPrice: this.priceAfterDiscount(ci.product),
            subtotal: this.subtotal(ci),
            image: ci.product.image,
          })),
          total: this.total,
        };
        const html = this.buildOrderEmail(order as any);

        return this.mailService
          .sendMail(order.buyerEmail, `Orden ${order.number}`, html)
          .toPromise();
      })
      .then(() => {
        this.msg.add({
          severity: 'success',
          summary: 'Orden registrada y correo enviado',
        });
        this.clear();
        this.cartOpen = false;
      })
      .catch((err) => {
        console.error(err);
        this.msg.add({
          severity: 'error',
          summary: 'Fallo al registrar o enviar correo',
        });
      });
  }

  private buildOrderEmail(o: Order): string {
    const status = 'Aprobada'.trim();
    const statusLower = status.toLowerCase();
    const statusColor =
      statusLower === 'aprobada'
        ? 'green'
        : statusLower === 'rechazada'
        ? '#c0392b'
        : '#f39c12';

    const fmt = (d?: string) => {
      if (!d) return new Date().toLocaleDateString('es-PE');
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('es-PE');
    };

    const rows = o.items
      .map(
        (it) => `
    <tr>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;">${
        it.id
      }</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:center;">${
        it.qty
      }</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:right;">$${it.unitPrice.toFixed(
        2
      )}</td>
      <td style="padding:10px;border:1px solid #ddd;text-align:right;">$${it.subtotal.toFixed(
        2
      )}</td>
    </tr>
  `
      )
      .join('');

    return `
  <div style="background-color:#f4f4f4;padding:30px;font-family:Arial, sans-serif;">
    <div style="max-width:700px;margin:0 auto;background-color:#ffffff;border-radius:8px;padding:30px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

      <h2 style="text-align:center;color:#007bff;margin:0 0 16px;">Orden de Compra ${status}</h2>
      <p style="text-align:center;font-size:14px;color:#555;margin:0 0 24px;">
        Estimado/a <strong>${
          this.sessionService.user?.full_name ?? 'Cliente'
        }</strong>, su orden de compra ha sido ${statusLower} exitosamente.
        A continuación encontrará el detalle:
      </p>

      <!-- Datos del comprador -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px;color:#333;">
        <tr>
          <td style="padding:10px;border:1px solid #ddd;width:40%;"><strong>Nombre:</strong></td>
          <td style="padding:10px;border:1px solid #ddd;">${'—'}</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding:10px;border:1px solid #ddd;"><a href="mailto:${
            o.buyerEmail
          }">${o.buyerEmail}</a></td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #ddd;"><strong>Fecha de Emisión:</strong></td>
          <td style="padding:10px;border:1px solid #ddd;">${fmt()}</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #ddd;"><strong>Fecha de Entrega:</strong></td>
          <td style="padding:10px;border:1px solid #ddd;">${fmt()}</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #ddd;"><strong>Moneda:</strong></td>
          <td style="padding:10px;border:1px solid #ddd;">${o.currency}</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #ddd;"><strong>Estado Actual:</strong></td>
          <td style="padding:10px;border:1px solid #ddd;color:${statusColor};font-weight:bold;">${status}</td>
        </tr>
      </table>

      <h3 style="color:#333;margin:0 0 10px;">Detalle de Productos</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#333;">
        <thead>
          <tr style="background-color:#f8f8f8;">
            <th style="padding:10px;border:1px solid #ddd;">ID Producto</th>
            <th style="padding:10px;border:1px solid #ddd;">Cantidad</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:right;">Precio Unitario</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <p style="text-align:right;font-size:16px;font-weight:bold;margin-top:16px;color:#333;">
        Total: $${o.total.toFixed(2)} ${o.currency}
      </p>

      <p style="font-size:12px;color:#888;text-align:center;margin-top:24px;">
        Gracias por confiar en <strong>FiaoX Marketplace</strong>.<br>
        Este correo es una confirmación automática, no es necesario responder.
      </p>
    </div>
  </div>`;
  }

  private getBuyerIds(): {
    clienteId: number | null;
    empresaId: number | null;
  } {
    console.log('INICIA DATOS');
    // const u: any = this.sessionService.getUser?.() || {};
    // usa el campo real que tengas en tu sesión/perfil
    const clienteId = this.sessionService.user?.id;
    const empresaId = this.storeId ?? null;
    return {
      clienteId: clienteId != null ? Number(clienteId) : null,
      empresaId: empresaId != null ? Number(empresaId) : null,
    };
  }
}
