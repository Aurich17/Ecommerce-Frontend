// principal.component.ts
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AuthStore } from '../../../services/auth.store';
import { mapApiMenuToPrime } from '../../../services/menu.mapper';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [PanelMenuModule, CommonModule, CardModule, MenubarModule, AvatarModule, AvatarGroupModule,RouterModule, ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  constructor(private router: Router, private authStore: AuthStore) {}

  items: MenuItem[] = [];
  verMenu = true; // prueba activado para ver el panel

  itemsMenuBar: MenuItem[] = [
    { label: 'Menú', icon: 'pi pi-bars', command: () => { this.verMenu = !this.verMenu; } }
  ];

  ngOnInit() {
    // 1) restaurar por si se recargó
    this.authStore.restore();

    // 2) suscribirse al menú dinámico
    this.authStore.menu$.subscribe(apiMenu => {
      this.items = mapApiMenuToPrime(apiMenu || []);
      // console.log('menu items', this.items);
    });

    // 3) si restore ya tenía menú, lo verás de inmediato
    if (this.authStore.snapshot.menu?.length) {
      this.items = mapApiMenuToPrime(this.authStore.snapshot.menu);
    }
  }
}
