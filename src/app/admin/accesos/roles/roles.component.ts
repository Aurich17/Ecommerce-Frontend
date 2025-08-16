import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, TableModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
  constructor(private router: Router) {}
  rolesTable: any [] = [{id: '1', nombre: 'Cliente', descripcion: 'Usuario fjhfs', fechacreacion: '2025-08-24'}]
  agregarRol(){

  }
  onEditPermisos(row: any){
    this.router.navigate(['/principal/accesos/permisosrol']);
  }
}
