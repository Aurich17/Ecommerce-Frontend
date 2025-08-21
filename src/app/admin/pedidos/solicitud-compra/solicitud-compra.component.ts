import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LandingService } from '../../../../services/landing.services';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { id } from 'intl-tel-input/i18n';
import { SelectButtonChangeEvent, SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitud-compra',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, TableModule, FormsModule, DialogModule, DropdownModule, InputTextModule, InputTextareaModule, SelectButtonModule,CommonModule],
  templateUrl: './solicitud-compra.component.html',
  styleUrl: './solicitud-compra.component.css',
  providers: [MessageService],
})
export class SolicitudCompraComponent {
  constructor(
    private apiService: LandingService,
    private router: Router,
    private messageService: MessageService
  ) { }
  visible: boolean = false
  infocliente: boolean = true
  labelbtn: string = 'Guardar Estado'
  loading: boolean = false
  solicitudesTable: any[] = [
    {id:1, numeroorden:'SC-0001', fechaemision:'2024-01-01', fechaentrega:'2024-01-10', estado:'Pendiente', total:1500, moneda:'USD', notas:'Entrega urgente', create_at:'2024-01-01 10:00'},
  ]
  listaEstado: any[] = [
    {label: 'Pendiente', value: 'Pendiente'},
    {label: 'Aprobado', value: 'Aprobado'},
    {label: 'Rechazado', value: 'Rechazado'}
  ]
  stateOptions: any[] = [
    { label: 'Productos', value: 'productos' },
    { label: 'Comprador', value: 'comprador' }
  ];
  solicitudform = new FormGroup({
    select: new FormControl('productos', null),
    estado: new FormControl(null, null),
    nota: new FormControl(null, null)
  });

  exportExcel(){

  }
  exportCsv(){

  }
  exportPdf(){
    
  }

  onEditPoppup(row: any) {
    this.visible = true
    this.solicitudform.reset()
    if (row) {
      this.solicitudform.get('select')?.setValue('productos');
      this.solicitudform.get('estado')?.setValue(row.estado);
      this.solicitudform.get('nota')?.setValue(row.notas);
    }
  }

  onDeleteRow(id: number) {

  }
  guardarData(){
    this.loading = true;
    this.labelbtn = 'Guardando...'

    setTimeout(() => {
      this.loading = false;
      this.labelbtn = 'Guardar Estado'
    }, 2000);
  }

  mostrarSeccion(event: SelectButtonChangeEvent) {
    console.log('event', event)
    if (event?.value === 'productos') {
      this.infocliente = true
    } else {
      this.infocliente = false
    }
  }
}
