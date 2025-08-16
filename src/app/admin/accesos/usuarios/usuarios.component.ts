import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonChangeEvent, SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, TableModule, FormsModule, TagModule, DialogModule, SelectButtonModule, CommonModule, InputTextModule, DropdownModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  visible: boolean = false;
  loading: boolean = false;
  labelbtn: string = 'Actualizar'
  optionsFiltro: any[] = [
    { label: 'Usuarios Cliente', value: 'usscliente' },
    { label: 'Usuarios Empresa', value: 'ussempresa' }
  ];
  listaEstado: any[] = [
    { label: 'Habilitado', value: '1' },
    { label: 'Deshabilitado', value: '2' }
  ];
  listaVisible: any[] = [
    { label: 'Si', value: '1' },
    { label: 'No', value: '2' }
  ];
  usuariosTable: any[] = [
    {id: '1', nombre: 'Gabriela', apellido: 'Canova', nombrecompleto: 'Gabriela Canova', email: 'prueba@gmail.com', telefono: '999999999',
      socialsecurity: '123-444', estado: 'Habilitado', rol: 'Cliente', comentarios: 'Si'
    }
  ]
  usuariosform = new FormGroup({
    nombreapellidocod: new FormControl(null, null),
    selectfiltro: new FormControl('usscliente', null),
  });
  poppupgroup = new FormGroup({
    nombre: new FormControl(null, null),
    apellido: new FormControl(null, null),
    email: new FormControl(null, null),
    estado: new FormControl(null, null),
    comentarios: new FormControl(null, null),
  });
  agregarUsuario() {

  }
  exportExcel() {

  }
  exportCsv() {

  }
  exportPdf() {

  }
  getSeverity(status: string) {
    switch (status) {
      case 'Habilitado':
        return 'success';
      case 'Deshabilitado':
        return 'danger';
      default:
        return 'secondary';
    }
  }
  getSeverityC(status: string) {
    switch (status) {
      case 'Si':
        return 'success';
      case 'No':
        return 'danger';
      default:
        return 'secondary';
    }
  }
  onEditPoppup(row: any) {
    this.visible = true
    console.log('row', row)
    if (row) {
      this.poppupgroup.get('nombre')?.setValue(row.cliente);
      this.poppupgroup.get('apellido')?.setValue(row.rol);
      this.poppupgroup.get('email')?.setValue(row.email);
      this.poppupgroup.get('comentarios')?.setValue(row.comentarios);
      this.poppupgroup.get('estado')?.setValue(row.estado);
    }
  }
  onDeleteRow() {

  }
  actualizarCliente() {
    this.loading = true;
    this.labelbtn = 'Actualizando'

    setTimeout(() => {
      this.loading = false;
      this.labelbtn = 'Actualizar'
    }, 2000);
  }
}
