import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleRow } from '../../../tipos/reponse/tipos.response';
import { ApiService } from '../../../../services/api.services';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, TableModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})
export class RolesComponent implements OnInit {
  constructor(private router: Router, private api: ApiService) {}

  rolesTable: RoleRow[] = [];
  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles() {
    this.api.obtenerRoles().subscribe({
      next: (rows) => (this.rolesTable = rows),
      error: (err) => console.error('Error al listar roles', err),
    });
  }

  agregarRol() {}

  onEditPermisos(row: RoleRow) {
    this.router.navigate(['/principal/accesos/permisosrol'], {
      queryParams: { idRol: row.id },
    });
  }
}
