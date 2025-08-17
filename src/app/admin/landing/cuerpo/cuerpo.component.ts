import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LandingService } from '../../../../services/landing.services';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-cuerpo',
  standalone: true,
  imports: [CardModule, CommonModule, ReactiveFormsModule, TableModule, ButtonModule, FormsModule, DialogModule, DropdownModule, InputTextModule, InputTextareaModule, CalendarModule,InputNumberModule],
  templateUrl: './cuerpo.component.html',
  styleUrl: './cuerpo.component.css',
  providers: [MessageService]
})
export class CuerpoComponent {
  constructor(
    private apiService: LandingService,
    private router: Router,
    private messageService: MessageService
  ) { }
  visible: boolean = false
  isfeature: boolean = false
  isfaq: boolean = false
  titulomantenimiento: string = 'Registrar'
  labelbtn: string = 'Guardar'
  loading: boolean = false
  addRegister: boolean = false
  caracteristicasTable: any[] = [];
  preguntasTable: any[] = [];
  clonedTableC: { [s: string]: any } = {};
  clonedTableP: { [s: string]: any } = {};
  cuerpoform = new FormGroup({
    icono: new FormControl(null,null),
    titulo: new FormControl(null,null),
    descripcion: new FormControl(null,null),
    estado: new FormControl(null,null),
    orden: new FormControl(null,null),
    pregunta: new FormControl(null,null),
    respuesta: new FormControl(null,null),
  })
  listaEstado: any[] = [
    { label: 'Si', value: true },
    { label: 'No', value: false }
  ];
  ngOnInit() {
    this.getFAQ();
    this.getFeatures()
  }
  getFAQ() {
    this.apiService.getLandingFAQ().subscribe({
      next: (data) => {
        console.log('data', data)
        this.preguntasTable = data.data.items.map(item => {
          const fecha = new Date(item.created_at);
          const day = fecha.getDate().toString().padStart(2, '0');
          const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
          const year = fecha.getFullYear();

          return {
            ...item,
            creacion: `${day}/${month}/${year}`
          };
        })
      },
      error: (err) => console.error('Error fetching encabezado:', err),
    });
  }
  getFeatures() {
    this.apiService.getLandingFeatures().subscribe({
      next: (data) => {
        console.log('data', data)
        this.caracteristicasTable = data.data.items.map(item => {
          const fecha = new Date(item.created_at);
          const day = fecha.getDate().toString().padStart(2, '0');
          const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
          const year = fecha.getFullYear();

          return {
            ...item,
            creacion: `${day}/${month}/${year}`
          };
        })
      },
      error: (err) => console.error('Error fetching encabezado:', err),
    });
  }
  onEditPoppup(row: any, tipo: string) {
    this.visible = true
    this.cuerpoform.reset()
    if (tipo === 'C') { //FEATURES
      this.titulomantenimiento = 'Editar Característica'
      this.isfeature = true
      this.cuerpoform.get('icono')?.setValue(row.icono);
      this.cuerpoform.get('titulo')?.setValue(row.titulo);
      this.cuerpoform.get('descripcion')?.setValue(row.descripcion);
    } else { //FAQ
      this.titulomantenimiento = 'Editar Preguntas Frecuentes'
      this.isfeature = false
      this.cuerpoform.get('pregunta')?.setValue(row.pregunta);
      this.cuerpoform.get('respuesta')?.setValue(row.respuesta);
    }
    this.cuerpoform.get('orden')?.setValue(row.orden);
    this.cuerpoform.get('estado')?.setValue(row.activo);
  }
  onDeleteRow(id: number, tipo: string) {
    if (tipo === 'C') {
      //FEATURES
    } else {
      //FAQ
    }
  }

  addRow(tipo: string) {
    this.visible = true
    this.cuerpoform.reset()
    if (tipo === 'C') { //FEATURES
      this.titulomantenimiento = 'Registrar Característica'
      this.isfeature = true
    } else { //FAQ
      this.titulomantenimiento = 'Registrar Preguntas Frecuentes'
      this.isfeature = false
    }
  }

  guardarData() {
    this.labelbtn = 'Guardando'
    this.loading = true
  }
}
