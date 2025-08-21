// principal.component.ts
import { Component, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { Router, RouterModule, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AuthStore } from '../../../services/auth.store';
import { mapApiMenuToPrime } from '../../../services/menu.mapper';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    PanelMenuModule,
    CommonModule,
    CardModule,
    MenubarModule,
    AvatarModule,
    AvatarGroupModule,
    RouterModule,
    MenuModule,
    OverlayPanelModule,
  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css',
})
export class PrincipalComponent {
  items: MenuItem[] = [];
  verMenu = true;
  isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  user = {
    org: 'Universidad Tecnologica del Peru',
    displayName: 'ALUMNO - GABRIEL ...',
    email: 'U21231727@utp.edu.pe',
    photoUrl: '', // si no tienes foto real, deja vacío
  };

  get userPhoto() {
    return this.user.photoUrl || undefined;
  }
  get userInitials() {
    // iniciales cuando no hay foto
    return (
      this.user.displayName
        ?.split(' ')
        .filter((w) => w && /[A-ZÁÉÍÓÚÑ]/i.test(w[0]))
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase() || 'A'
    );
  }

  goToAccount() {
    /* navega a tu perfil */
  }
  openAnotherMailbox() {
    /* lógica */
  }
  signInWithAnotherAccount() {
    /* lógica */
  }

  constructor(private router: Router, private authStore: AuthStore) {}

  // ===== utilidades de foco =====
  private blurActiveSoon() {
    requestAnimationFrame(() =>
      (document.activeElement as HTMLElement | null)?.blur()
    );
  }

  toggleSidebar() {
    this.verMenu = !this.verMenu;
    if (!this.verMenu) this.blurActiveSoon();
  }

  closeSidebar() {
    this.verMenu = false;
    this.blurActiveSoon();
  }

  // Accesibilidad: cerrar con ESC en mobile/drawer
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.verMenu) this.closeSidebar();
  }

  // añade command a cada item para soltar foco y cerrar drawer en mobile
  private withBlurCommand(items: MenuItem[]): MenuItem[] {
    const enhance = (list: MenuItem[] = []): MenuItem[] =>
      list.map((it) => {
        const original = it.command;
        const enhanced: MenuItem = {
          ...it,
          command: (e) => {
            original?.(e);
            if (window.innerWidth < 1024) this.verMenu = false; // cierra en mobile
            this.blurActiveSoon(); // soltar foco SIEMPRE
          },
        };
        if (it.items?.length) enhanced.items = enhance(it.items);
        return enhanced;
      });
    return enhance(items);
  }

  itemsMenuBar: MenuItem[] = [
    {
      label: 'Menú',
      icon: 'pi pi-bars',
      command: () => this.toggleSidebar(),
    },
  ];

  ngOnInit() {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => (this.isDesktop = e.matches);
    mq.addEventListener?.('change', handler);
    // 1) restaurar sesión
    this.authStore.restore();

    // 2) construir menú dinámico + commands de blur
    this.authStore.menu$.subscribe((apiMenu) => {
      this.items = this.withBlurCommand(mapApiMenuToPrime(apiMenu || []));
    });

    if (this.authStore.snapshot.menu?.length) {
      this.items = this.withBlurCommand(
        mapApiMenuToPrime(this.authStore.snapshot.menu)
      );
    }

    // 3) al empezar una navegación, suelta el foco
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) this.blurActiveSoon();
    });
  }
  onSignOut() {
    const returnUrl = this.router.url;
    this.authStore.clear();
    this.router.navigate([''], {
      replaceUrl: true,
      queryParams: { returnUrl },
    });
  }
}
