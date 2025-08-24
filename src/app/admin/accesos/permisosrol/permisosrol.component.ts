// permisosrol.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CheckboxModule, CheckboxChangeEvent } from 'primeng/checkbox';
import { ApiService } from '../../../../services/api.services';
import { MenuWithPermissionsDto } from './domain/permisos.response';
import {
  BulkUpdatePermissionsDto,
  PermissionUpdateDto,
} from './domain/permisos.request';

// Interface LOCAL para la tabla
type CampoPermiso = 'acceso' | 'ver' | 'agregar' | 'editar' | 'eliminar';
interface PermisoRow {
  id: number; // id de menú
  accesoId: number; // id de acceso
  nombre: string;
  acceso: boolean; // == activo
  ver: boolean; // alias de activo
  agregar: boolean; // add_register
  editar: boolean; // edit_register
  eliminar: boolean; // delete_register
  hasChanges?: boolean; // para tracking de cambios
}

interface MenuGroup {
  nombre: string;
  permisos: PermisoRow[];
}

@Component({
  selector: 'app-permisosrol',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    CheckboxModule,
    FormsModule,
  ],
  templateUrl: './permisosrol.component.html',
  styleUrls: ['./permisosrol.component.css'],
})
export class PermisosrolComponent implements OnInit {
  descripcionrol = '';
  idRol!: number;

  // Grupos de menús organizados jerárquicamente
  menuGroups: MenuGroup[] = [];

  // Control de cambios masivos
  pendingChanges: Map<number, PermissionUpdateDto> = new Map();
  isSaving = false;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const raw = params.get('idRol');
      this.idRol = Number(raw);

      if (!raw || Number.isNaN(this.idRol)) {
        console.error('idRol inválido en query params');
        return;
      }

      this.cargarPermisos(this.idRol);

      // Si no tienes GET /roles/:id, este método puede simularlo desde /roles
      this.api.obtenerRolPorId(this.idRol).subscribe({
        next: (r) =>
          (this.descripcionrol = r?.descripcion ?? `Rol #${this.idRol}`),
        error: (e) => console.error('No se pudo obtener el rol', e),
      });
    });
  }

  private cargarPermisos(idRol: number) {
    this.api.getRolePermissions(idRol).subscribe({
      next: (menus: MenuWithPermissionsDto[]) => {
        // Función para procesar un menú y convertirlo a PermisoRow
        const convertirMenuAPermiso = (
          menu: MenuWithPermissionsDto
        ): PermisoRow => ({
          id: menu.id,
          accesoId: menu.permisos.accesoId,
          nombre: menu.descripcion,
          acceso: menu.permisos.activo,
          ver: menu.permisos.activo, // alias
          agregar: menu.permisos.addRegister,
          editar: menu.permisos.editRegister,
          eliminar: menu.permisos.deleteRegister,
          hasChanges: false,
        });

        // Función recursiva para procesar menús principales y sus hijos
        const procesarGrupoMenu = (menu: MenuWithPermissionsDto): MenuGroup => {
          const permisos: PermisoRow[] = [];

          // Agregar el menú principal
          permisos.push(convertirMenuAPermiso(menu));

          // Agregar los submenús si existen
          if (menu.children && menu.children.length > 0) {
            menu.children.forEach((submenu) => {
              permisos.push({
                ...convertirMenuAPermiso(submenu),
                nombre: `└─ ${submenu.descripcion}`, // Indentación visual
              });

              // Si el submenú tiene hijos, agregarlos también
              if (submenu.children && submenu.children.length > 0) {
                submenu.children.forEach((subsubmenu) => {
                  permisos.push({
                    ...convertirMenuAPermiso(subsubmenu),
                    nombre: `  └─ ${subsubmenu.descripcion}`, // Doble indentación
                  });
                });
              }
            });
          }

          return {
            nombre: menu.descripcion,
            permisos,
          };
        };

        // Procesar todos los menús principales
        this.menuGroups = menus.map((menu) => procesarGrupoMenu(menu));

        // Limpiar cambios pendientes
        this.pendingChanges.clear();
      },
      error: (err) => console.error('Error cargando permisos', err),
    });
  }

  seleccionarPermiso(
    event: CheckboxChangeEvent,
    row: PermisoRow,
    campo: CampoPermiso
  ) {
    const checked = !!event.checked;

    // Actualizar UI inmediatamente
    (row as any)[campo] = checked;
    if (campo === 'acceso' || campo === 'ver') {
      row.acceso = checked;
      row.ver = checked;
    }

    // Marcar fila como modificada
    row.hasChanges = true;

    // Obtener o crear entrada de cambios pendientes
    let pendingChange = this.pendingChanges.get(row.id);
    if (!pendingChange) {
      pendingChange = { idMenu: row.id };
      this.pendingChanges.set(row.id, pendingChange);
    }

    // Mapear campo UI a campo API
    const mapCampo: Record<CampoPermiso, keyof PermissionUpdateDto> = {
      acceso: 'activo',
      ver: 'activo',
      agregar: 'addRegister',
      editar: 'editRegister',
      eliminar: 'deleteRegister',
    };

    const apiField = mapCampo[campo];
    (pendingChange as any)[apiField] = checked;

    // Si es acceso/ver, actualizar ambos campos
    if (campo === 'acceso' || campo === 'ver') {
      pendingChange.activo = checked;
    }
  }

  // Método para guardar todos los cambios pendientes
  guardarCambiosMasivos() {
    if (this.pendingChanges.size === 0) {
      return;
    }

    this.isSaving = true;
    const permisos = Array.from(this.pendingChanges.values());
    const bulkUpdate: BulkUpdatePermissionsDto = { permisos };

    this.api.bulkUpdatePermissions(this.idRol, bulkUpdate).subscribe({
      next: (result) => {
        console.log(
          `Actualizados: ${result.updated}, Creados: ${result.created}`
        );
        // Limpiar cambios pendientes y marcas
        this.pendingChanges.clear();
        this.menuGroups.forEach((group) => {
          group.permisos.forEach((row: PermisoRow) => (row.hasChanges = false));
        });
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Error al guardar cambios masivos', err);
        this.isSaving = false;
      },
    });
  }

  // Método para descartar cambios
  descartarCambios() {
    this.pendingChanges.clear();
    this.cargarPermisos(this.idRol);
  }

  // Getter para saber si hay cambios pendientes
  get hasPendingChanges(): boolean {
    return this.pendingChanges.size > 0;
  }
}
