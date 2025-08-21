import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';
import { LandingService } from '../../../../services/landing.services';
import { EncabezadoRequest } from './domain/request/encabezado.request';
import { EncabezadoResponse } from './domain/response/encabezado.response';
import { RippleModule } from 'primeng/ripple';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { ImagekitClient } from '../../../../services/imagekit.service';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [
    AccordionModule,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    RippleModule,
    FileUploadModule,
  ],
  providers: [MessageService],
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css'], // <- plural
})
export class EncabezadoComponent {
  loading = false;
  encabezadoLanding?: EncabezadoResponse;

  private ik = inject(ImagekitClient);
  logoFile?: File;
  encabezadoform = new FormGroup({
    titulo: new FormControl<string>(''),
    subtitulo: new FormControl<string>(''),
    parafrasis: new FormControl<string>(''),
    tituloMP: new FormControl<string>(''),
    subtituloMP: new FormControl<string>(''),
    nota: new FormControl<string>(''),
  });
  uploadedFiles: any[] = [];
  constructor(
    private apiService: LandingService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getEncabezado();
  }

  getEncabezado() {
    this.apiService.getLandingEncabezado().subscribe({
      next: (data) => {
        this.encabezadoLanding = {
          ...data,
          updated_at: new Date(data.updated_at),
        };
        // >>> PONEMOS LOS VALORES EN EL FORM AQUÍ <<<
        this.encabezadoform.patchValue({
          titulo: data.titulo_principal ?? '',
          subtitulo: data.subtitulo ?? '',
          parafrasis: data.parrafo_encabezado ?? '',
          tituloMP: data.titulo_marketplace ?? '',
          subtituloMP: data.subtitulo_marketplace ?? '',
          nota: data.nota ?? '',
        });
      },
      error: (err) => console.error('Error fetching encabezado:', err),
    });
  }

  async guardarCambios() {
    const v = this.encabezadoform.value;
    let logoUrl = '';
    let logoName = '';

    // Si hay logo seleccionado -> lo subimos
    if (this.logoFile) {
      const res: any = await this.ik.uploadAndSave(this.logoFile, '/landing', [
        'logo',
      ]);
      logoUrl = this.ik.url(
        { path: res.filePath },
        { w: 500, q: 80, f: 'auto' }
      );
      logoName = this.logoFile.name;
    }

    const request: EncabezadoRequest = {
      titulo_principal: v.titulo || '',
      subtitulo: v.subtitulo || '',
      parrafo_encabezado: v.parafrasis || '',
      titulo_marketplace: v.tituloMP || '',
      subtitulo_marketplace: v.subtituloMP || '',
      nota: v.nota || '',
      logo_url: logoUrl, // 👈 lo mandamos al backend
      logo_name: logoName, // 👈 lo mandamos al backend
    };

    this.loading = true;
    this.apiService
      .updateLandingEncabezado(request)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'El encabezado se actualizó correctamente.',
            key: 'tc',
            life: 2500,
          });
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

  onSelfieSelect(e: any): void {
    const file = e.files?.[0];
    if (!file) return;
    this.logoFile = file;
  }
  onUpload(event: FileUploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }
}
