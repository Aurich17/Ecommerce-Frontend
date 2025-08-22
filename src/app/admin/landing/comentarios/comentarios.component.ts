import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { LandingService } from '../../../../services/landing.services';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { TestimonialsRequest } from './domain/comentarios.request';


@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, TableModule, FormsModule, TagModule, DialogModule, DropdownModule, InputTextModule, InputTextareaModule, CalendarModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css',
  providers: [MessageService],
})
export class ComentariosComponent {
  constructor(
    private apiService: LandingService,
    private router: Router,
    private messageService: MessageService
  ) { }
  currentId!: number
  visible: boolean = false
  titulomantenimiento: string = 'Registrar Item'
  labelbtn: string = 'Guardar'
  loading: boolean = false
  addRegister: boolean = false
  comentariosTable: any[] = [];
  listaOcupacion: any[] = [];
  listaEstado: any[] = [
    { label: 'Si', value: true },
    { label: 'No', value: false }
  ];
  comentariosform = new FormGroup({
    cliente: new FormControl(null, null),
    creacion: new FormControl<Date | null>(null),
    comentario: new FormControl(null, null),
    estado: new FormControl(null, null),
  })
  clonedTable: { [s: string]: any } = {};
  ngOnInit() {
    this.getTestimonials();
  }

  getTestimonials() {
    this.apiService.getLandingTestimonials().subscribe({
      next: (data) => {
        console.log('data', data)
        this.comentariosTable = data.data.items.map(item => {
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
      error: (err) => console.error('Error fetching testimonios:', err),
    });
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
    this.comentariosform.reset()
    if (row) {
      this.currentId = row.id
      this.comentariosform.get('cliente')?.setValue(row.client_name);
      this.comentariosform.get('comentario')?.setValue(row.comment);
      this.comentariosform.get('creacion')?.setValue(new Date(row.created_at));
      this.comentariosform.get('estado')?.setValue(row.enabled);
    }
  }

  saveTestimonial() {
    this.labelbtn = 'Guardando'
    this.loading = true
    if (!this.currentId) return;
    if (this.comentariosform.invalid) return;
    const f = this.comentariosform.value;
    const request: TestimonialsRequest = {
      comment: f.comentario ?? '',
      userId: 'ee4aacb9-1a95-42cb-bb30-2d817353446e',                   // si lo capturas en el form; si no, pásalo vacío o elimínalo si tu backend no lo requiere
      clientName: f.cliente ?? '',
      occupationText: "Ingeniero de Software",
      occupationTab: 'OCU',                     // fijo según tu modelo de TIPOS
      occupationCod: '001',      // '001' etc. (si usas catálogos)
      enabled: !!f.estado,
    };
    if (this.addRegister === true) {
      this.apiService.createdLandingTestimonials(request).subscribe({
        next: ({ data }) => {
          this.getTestimonials();
          this.visible = false;
          this.loading = false;
          this.labelbtn = 'Guardar';
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'El testimonio se creó correctamente.',
            key: 'tc',
            life: 2500,
          });
        },
        error: (err) => console.error('Error al crear testimonial:', err),
      });
    } else {
      this.apiService.updateLandingTestimonials(this.currentId, request).subscribe({
        next: ({ data }) => {
          this.getTestimonials();
          this.visible = false;
          this.loading = false;
          this.labelbtn = 'Guardar';
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'El testimonio se actualizó correctamente.',
            key: 'tc',
            life: 2500,
          });
        },
        error: (err) => console.error('Error al actualizar testimonial:', err),
      });
    }
  }

  onDeleteRow(id: number) {
    this.apiService.deleteLandingTestimonials(id).subscribe({
      next: ({ data }) => {
        this.getTestimonials();
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'El testimonio se eliminó correctamente.',
          key: 'tc',
          life: 2500,
        });
      },
      error: (err) => {
        console.error('Error al eliminar testimonial:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el testimonio.',
          key: 'tc',
          life: 2500,
        });
      },
    });

  }
  getSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'danger';
      default:
        return 'secondary';
    }
  }
  guardarData() {
    this.labelbtn = 'Guardando'
    this.loading = true
  }
}
