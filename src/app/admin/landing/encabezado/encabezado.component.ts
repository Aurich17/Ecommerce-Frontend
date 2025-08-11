import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { LandingService } from '../../../../services/landing.services';
import { EncabezadoRequest } from './domain/request/encabezado.request';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { EncabezadoResponse } from './domain/response/encabezado.response';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [AccordionModule,CommonModule,ReactiveFormsModule,InputTextModule,ButtonModule,ToastModule],
  providers: [MessageService],
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.css'
})
export class EncabezadoComponent {
  loading = false;
  encabezadoLanding?: EncabezadoResponse;
  constructor(private apiService: LandingService, private router: Router,private messageService: MessageService){}

  ngOnInit(){
    this.getEncabezado()
  }

  encabezadoform = new FormGroup({
    titulo: new FormControl(null),
    subtitulo: new FormControl(null),
    parafrasis: new FormControl(null),
    tituloMP: new FormControl(null),
    subtituloMP: new FormControl(null),
    nota: new FormControl(null)
  });

  guardarCambios() {
    if (this.encabezadoform.invalid) {
      this.encabezadoform.markAllAsTouched();
      return;
    }

    const v = this.encabezadoform.getRawValue();
    const payload: EncabezadoRequest = {
      titulo_principal:      v.titulo ?? '',
      subtitulo:             v.subtitulo ?? '',
      parrafo_encabezado:    v.parafrasis ?? '',
      titulo_marketplace:    v.tituloMP ?? '',
      subtitulo_marketplace: v.subtituloMP ?? '',
      nota:                  v.nota ?? '',
    };

    this.loading = true;
    this.apiService.updateLandingEncabezado(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          // ✅ Toast éxito
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'El encabezado se actualizó correctamente.',
            life: 2500,
          });

          // ✅ Limpiar formulario
          this.encabezadoform.reset();
          this.encabezadoform.markAsPristine();
          this.encabezadoform.markAsUntouched();

          // Si quieres navegar después de un rato:
          // setTimeout(() => this.router.navigate(['/admin/landing']), 300);
        },
        error: (err) => {
          console.error('Error al actualizar encabezado:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el encabezado.',
            life: 3500,
          });
        },
      });
  }

  getEncabezado() {
    this.apiService.getLandingEncabezado().subscribe({
      next: (data) => {
        this.encabezadoLanding = { ...data, updated_at: new Date(data.updated_at) };
      },
      error: (err) => console.error('Error fetching encabezado:', err),
    });
  }
}
