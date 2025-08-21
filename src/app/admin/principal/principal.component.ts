// principal.component.ts
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
// import { AuthStore } from '../auth/auth.store';
// import { mapApiMenuToPrime } from '../auth/menu.mapper';
import { take } from 'rxjs/operators';
import { AuthStore } from '../../../services/auth.store';
import { mapApiMenuToPrime } from '../../../services/menu.mapper';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [PanelMenuModule,CommonModule,CardModule,MenubarModule,AvatarModule,AvatarGroupModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  constructor(private router: Router, private authStore: AuthStore) {}

  items: MenuItem[] = [];
  verMenu = false;

  itemsMenuBar: MenuItem[] = [
    { label: 'Menú', icon: 'pi pi-bars', command: () => { this.verMenu = !this.verMenu; } }
  ];

  ngOnInit() {
    // intentar restaurar sesión (por si recargas)
    this.authStore.restore();

    // Suscríbete al menú del store y mapea a Prime
    this.authStore.menu$.pipe(take(1)).subscribe(state => {
      const apiMenu = this.authStore.snapshot.menu;
      this.items = mapApiMenuToPrime(apiMenu);
    });

    // Si deseas un fallback estático cuando no hay sesión/menú:
    if (!this.items.length) {
      // opcional: puedes dejar vacío o tu menú estático por defecto
      this.items = [];
    }
  }
}
