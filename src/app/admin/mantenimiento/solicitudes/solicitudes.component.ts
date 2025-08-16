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
  selector: 'app-solicitudes',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, TableModule, FormsModule, TagModule, DialogModule, SelectButtonModule, CommonModule, InputTextModule, DropdownModule],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})
export class SolicitudesComponent {
  visible: boolean = false
  infocliente: boolean = false
  loading: boolean = false
  labelbtn: string = "Actualizar"
  fotovalidacion: any
  fotodocumento: any
  solicitudesTable: any[] = [
    { id: '1', cliente: 'Prueba', estado: 'Aprobado', descripcion: 'No se', fechacreacion: '2025-08-16' },
  ]
  solicitudesform = new FormGroup({
    selectfiltro: new FormControl('todos', null),
    nombreapellido: new FormControl(null, null)
  });
  stateOptions: any[] = [
    { label: 'Documentos', value: 'documentos' },
    { label: 'Info de Usuario', value: 'infousser' }
  ];
  optionsFiltro: any[] = [
    { label: 'Todos', value: 'todos' },
    { label: 'Clientes', value: 'clientes' },
    { label: 'Empresas', value: 'empresas' }
  ];
  listaEstado: any[] = [
    { label: 'Aprobado', value: '1' },
    { label: 'Pendiente', value: '2' },
    { label: 'Rechazado', value: '3' }
  ];
  poppupgroup = new FormGroup({
    select: new FormControl('documentos', null),
    nombre: new FormControl(null, null),
    email: new FormControl(null, null),
    rol: new FormControl(null, null),
    socialsecurity: new FormControl(null, null),
    estado: new FormControl(null, null),
  });
  exportExcel() {

  }
  exportCsv() {

  }
  exportPdf() {

  }
  onEditPoppup(row: any) {
    this.visible = true
    console.log('row', row)
    if(row){
      this.poppupgroup.get('nombre')?.setValue(row.cliente);
      this.poppupgroup.get('rol')?.setValue(row.rol);
      this.poppupgroup.get('email')?.setValue(row.email);
      this.poppupgroup.get('socialsecurity')?.setValue(row.socialsecurity);
      this.poppupgroup.get('estado')?.setValue(row.estado);
    }
  }
  onDeleteRow() {

  }
  getSeverity(status: string) {
    switch (status) {
      case 'Aprobado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Rechazado':
        return 'danger';
      default:
        return 'secondary';
    }
  }
  mostrarSeccion(event: SelectButtonChangeEvent) {
    console.log('event', event)
    if (event?.value === 'documentos') {
      this.infocliente = false
    } else {
      this.infocliente = true
    }
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
