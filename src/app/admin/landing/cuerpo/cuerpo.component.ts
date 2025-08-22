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
import { FeaturesRequest } from './domain/cuerpo.request';

@Component({
  selector: 'app-cuerpo',
  standalone: true,
  imports: [CardModule, CommonModule, ReactiveFormsModule, TableModule, ButtonModule, FormsModule, DialogModule, DropdownModule, InputTextModule, InputTextareaModule, CalendarModule, InputNumberModule],
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
    icono: new FormControl(null, null),
    titulo: new FormControl(null, null),
    descripcion: new FormControl(null, null),
    estado: new FormControl(null, null),
    orden: new FormControl(null, null),
    pregunta: new FormControl(null, null),
    respuesta: new FormControl(null, null),
  })
  listaEstado: any[] = [
    { label: 'Si', value: true },
    { label: 'No', value: false }
  ];
  currentId!: number
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
      error: (err) => console.error('Error fetching faq:', err),
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
      error: (err) => console.error('Error fetching features:', err),
    });
  }
  onEditPoppup(row: any, tipo: string) {
    this.visible = true
    this.cuerpoform.reset()
    this.addRegister = false
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
    this.currentId = row.id;
  }
  onDeleteRow(id: number, tipo: string) {
    if (tipo === 'C') {
      this.apiService.deleteLandingFeatures(id).subscribe({
        next: (data) => {
          this.getFeatures()
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Característica eliminada correctamente', life: 3000 });
        },
        error: (err) => {
          console.error('Error deleting feature:', err)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar característica', life: 3000 });
        },
      });
    } else {
      //FAQ
      this.apiService.deleteLandingFAQ(id).subscribe({
        next: (data) => {
          this.getFAQ()
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Pregunta eliminada correctamente', life: 3000 });
        },
        error: (err) => {
          console.error('Error deleting FAQ:', err)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar pregunta', life: 3000 });
        },
      });
    }
  }

  addRow(tipo: string) {
    this.visible = true
    this.cuerpoform.reset()
    this.addRegister = true
    if (tipo === 'C') { //FEATURES
      this.titulomantenimiento = 'Registrar Característica'
      this.isfeature = true
    } else { //FAQ
      this.titulomantenimiento = 'Registrar Preguntas Frecuentes'
      this.isfeature = false
    }
    this.currentId = 0;
  }

  guardarData() {
    this.labelbtn = 'Guardando'
    this.loading = true
    if (this.isfeature === true) {
      const payload: FeaturesRequest = {
        icono: this.cuerpoform.get('icono')?.value ?? '',
        titulo: this.cuerpoform.get('titulo')?.value ?? '',
        descripcion: this.cuerpoform.get('descripcion')?.value ?? '',
        orden: this.cuerpoform.get('orden')?.value ?? 0,
        activo: this.cuerpoform.get('estado')?.value ?? false,
      }
      if (this.addRegister === true) {
        //REGISTRAR
        this.apiService.createdLandingFeatures(payload).subscribe({
          next: (data) => {
            this.labelbtn = 'Guardar'
            this.loading = false
            this.visible = false
            this.getFeatures()
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Característica registrada correctamente', life: 3000 });
          },
          error: (err) => {
            console.error('Error creating feature:', err)
          },
        });
      } else {
        //ACTUALIZAR
        this.apiService.updateLandingFeatures(this.currentId, payload).subscribe({
          next: (data) => {
            this.labelbtn = 'Guardar'
            this.loading = false
            this.visible = false
            this.getFeatures()
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Característica actualizada correctamente', life: 3000 });
          },
          error: (err) => {
            console.error('Error updating feature:', err)
          },
        });
      }
    } else {
      const payload = {
          pregunta: this.cuerpoform.get('pregunta')?.value ?? '',
          respuesta: this.cuerpoform.get('respuesta')?.value ?? '',
          orden: this.cuerpoform.get('orden')?.value ?? 0,
          activo: this.cuerpoform.get('estado')?.value ?? false,
        };
      if(this.addRegister === true) {
        this.apiService.createdLandingFAQ(payload).subscribe({
          next: (data) => {
            this.labelbtn = 'Guardar'
            this.loading = false
            this.visible = false
            this.getFAQ()
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Pregunta registrada correctamente', life: 3000 });
          },
          error: (err) => {
            console.error('Error creating FAQ:', err)
          },
        });
      } else {
        //ACTUALIZAR
        this.apiService.updateLandingFAQ(this.currentId, payload).subscribe({
          next: (data) => {
            this.labelbtn = 'Guardar'
            this.loading = false
            this.visible = false
            this.getFAQ()
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Pregunta actualizada correctamente', life: 3000 });
          },
          error: (err) => {
            console.error('Error updating FAQ:', err)
          },
        });
      }
    }
  }
}
