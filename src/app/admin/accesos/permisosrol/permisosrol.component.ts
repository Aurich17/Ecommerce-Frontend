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

// <-- ajusta la ruta si es necesario

// Interface LOCAL para la tabla (evita depender de tipos dentro del service)
type CampoPermiso = 'acceso' | 'ver' | 'agregar' | 'editar' | 'eliminar';
interface PermisoRow {
  id: number; // id de acceso
  idMenu: number;
  nombre: string;
  acceso: boolean; // == activo
  ver: boolean; // alias de activo
  agregar: boolean; // add_register
  editar: boolean; // edit_register
  eliminar: boolean; // delete_register
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

  // Tablas (por ahora todo en "Migración")
  migracionTable: PermisoRow[] = [];
  mantTable: PermisoRow[] = [];

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
    this.api.obtenerPermisosRol(idRol).subscribe({
      next: (rows: any[]) => {
        // Si tu ApiService ya tipa obtenerPermisosRol, puedes castear:
        this.migracionTable = rows as PermisoRow[];
        // Si luego categorizas por grupo, separa en mantTable aquí.
      },
      error: (err) => console.error('Error cargando permisos', err),
    });
  }

  seleccionarPermiso(
    event: CheckboxChangeEvent,
    row: PermisoRow,
    campo: CampoPermiso
  ) {
    // Mapa UI -> payload API
    const mapCampo: Record<
      CampoPermiso,
      'activo' | 'addRegister' | 'editRegister' | 'deleteRegister'
    > = {
      acceso: 'activo',
      ver: 'activo', // alias
      agregar: 'addRegister',
      editar: 'editRegister',
      eliminar: 'deleteRegister',
    };

    const apiField = mapCampo[campo];
    const checked = !!event.checked;
    const payload: Partial<Record<typeof apiField, boolean>> = {
      [apiField]: checked,
    } as any;

    // Optimistic UI
    (row as any)[campo] = checked;
    if (campo === 'acceso' || campo === 'ver') {
      row.acceso = checked;
      row.ver = checked;
    }

    this.api.actualizarAcceso(row.id, payload).subscribe({
      error: (err) => {
        console.error('No se pudo actualizar permiso', err);
        // revertir estado en caso de error
        const prev = !checked;
        (row as any)[campo] = prev;
        if (campo === 'acceso' || campo === 'ver') {
          row.acceso = prev;
          row.ver = prev;
        }
      },
    });
  }
}
