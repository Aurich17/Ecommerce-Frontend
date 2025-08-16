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

@Component({
  selector: 'app-funcionamiento',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, TableModule, FormsModule, DialogModule, DropdownModule, InputTextModule, InputTextareaModule],
  templateUrl: './funcionamiento.component.html',
  styleUrl: './funcionamiento.component.css',
  providers: [MessageService],
})
export class FuncionamientoComponent {
  constructor(
    private apiService: LandingService,
    private router: Router,
    private messageService: MessageService
  ) { }
  visible: boolean = false
  titulomantenimiento: string = 'Registrar Item'
  labelbtn: string = 'Guardar'
  loading: boolean = false
  addRegister: boolean = false
  funcionamientoTable: any[] = [];
  clonedTable: { [s: string]: any } = {};
  funcionamientoform = new FormGroup({
    icono: new FormControl(null, null),
    descripcion: new FormControl(null, null),
  });
  ngOnInit() {
    this.getAudiencia();
  }

  getAudiencia() {
    this.apiService.getLandingHowItWork().subscribe({
      next: (data) => {
        console.log('data', data)
        this.funcionamientoTable = data.data.items
      },
      error: (err) => console.error('Error fetching encabezado:', err),
    });
  }

  agregarItem() {
    this.visible = true
    this.titulomantenimiento = 'Registrar Audiencia'
    this.addRegister = true
    this.funcionamientoform.reset()
  }
  exportExcel() {

  }
  exportCsv() {

  }
  exportPdf() {

  }
  onEditPoppup(row: any) {
    this.visible = true
    this.titulomantenimiento = 'Actualizar Audiencia'
    this.addRegister = false
    this.funcionamientoform.reset()
    if (row) {
      this.funcionamientoform.get('icono')?.setValue(row.icon);
      this.funcionamientoform.get('descripcion')?.setValue(row.description);
    }
  }
  onDeleteRow() {

  }
  guardarData(){
    this.labelbtn = 'Guardando'
    this.loading = true
  }
}
