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
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LandingService } from '../../../../services/landing.services';
import { PasswordModule } from 'primeng/password';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [PasswordModule, ReactiveFormsModule, ButtonModule, TableModule, FormsModule, TagModule, DialogModule, SelectButtonModule, CommonModule, InputTextModule, DropdownModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  constructor(
    private apiService: LandingService,
    private router: Router
  ) { }
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
  usuariosTable: any[] = []
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
    password: new FormControl(null, null)
  });
  ngOnInit() {
    this.getUssers();
  }

  getUssers() {
    const requestParams = {
      q: '',
      roleCod: '',
      estCod: [],
      page: [],
      limit: [],
    };

    // this.apiService.getMantUsuarios(requestParams).subscribe({
    //   next: (data) => {
    //     console.log('data', data);
    //     this.usuariosTable = data.data.items.map(item => {
    //       const fecha = new Date(item.createdAt);
    //       const day = fecha.getDate().toString().padStart(2, '0');
    //       const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    //       const year = fecha.getFullYear();

    //       return {
    //         ...item,
    //         creacion: `${day}/${month}/${year}`
    //       };
    //     });
    //   },
    //   error: (err) => console.error('Error fetching usuarios:', err),
    // });
  }
  agregarUsuario() {
    this.visible = true
  }
  exportExcel() {

  }
  exportCsv() {

  }
  exportPdf() {

  }
  getSeverity(status: string) {
    switch (status) {
      case 'habilitado':
        return 'success';
      case 'deshabilitado':
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
  onDeleteRow(id: number) {

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
