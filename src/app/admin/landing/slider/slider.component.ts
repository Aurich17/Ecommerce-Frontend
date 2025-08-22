import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import {
  FormsModule,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import {
  FileUploadModule,
  FileUpload,
  FileUploadHandlerEvent,
} from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';

import { finalize, from, of } from 'rxjs';
import { concatMap, catchError } from 'rxjs/operators';

import { LandingService } from '../../../../services/landing.services';
import { ImagekitClient } from '../../../../services/imagekit.service';
import { SliderDto, SliderCreateDto } from '../slider/domain/slider.dto';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    TableModule,
    FileUploadModule,
    InputSwitchModule,
    DialogModule,
  ],
  providers: [MessageService],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent {
  private api = inject(LandingService);
  private ik = inject(ImagekitClient);
  private toast = inject(MessageService);

  @ViewChild('uploader') uploader!: FileUpload;

  loading = false;
  visible = false;
  addRegister = false;
  titulomantenimiento = 'Registrar Imagen';
  labelbtn = 'Guardar';

  table: SliderDto[] = [];
  currentId = 0;

  form = new FormGroup({
    name_file: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    url: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<boolean>(true, { nonNullable: true }),
  });

  ngOnInit() {
    this.getSlider();
  }

  getSlider() {
    this.api.sliderList({ page: 1, limit: 50 }).subscribe({
      next: (res) => (this.table = res?.data?.items ?? []),
      error: (err) => console.error('Error fetching slider:', err),
    });
  }

  agregarItem() {
    this.visible = true;
    this.addRegister = true;
    this.titulomantenimiento = 'Registrar Imágenes del Slider';
    this.currentId = 0;
    this.form.reset({ name_file: '', url: '', status: true });
  }

  onEditPoppup(row: SliderDto) {
    this.visible = true;
    this.addRegister = false;
    this.titulomantenimiento = 'Actualizar Imagen';
    this.currentId = row.id;
    this.form.reset({
      name_file: row.name_file,
      url: row.url,
      status: !!row.status,
    });
  }

  onDeleteRow(id: number) {
    this.api.sliderDelete(id).subscribe({
      next: () => {
        this.getSlider();
        this.toast.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'La imagen se eliminó correctamente.',
          key: 'tc',
          life: 2500,
        });
      },
      error: (err) => console.error('Error al eliminar imagen:', err),
    });
  }

  // --- Subida múltiple en modo agregar ---
  onSelectFiles(_: any) {
    /* opcional si quieres manejar la lista */
  }

  onUploadHandler(e: FileUploadHandlerEvent) {
    const files = e.files || [];
    if (!files.length) return;

    this.loading = true;

    from(files)
      .pipe(
        concatMap((file) =>
          from(this.ik.uploadAndSave(file, '/landing/slider', ['slider'])).pipe(
            concatMap((res: any) => {
              const url = this.ik.url(
                { path: res.filePath },
                { w: 1920, q: 80, f: 'auto' }
              );
              const payload: SliderCreateDto = {
                url,
                name_file: file.name,
                status: true,
              };
              return this.api.sliderCreate(payload);
            }),
            catchError((err) => {
              console.error('Error en carga/creación de un archivo:', err);
              return of(null);
            })
          )
        ),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        complete: () => {
          this.getSlider();
          this.toast.add({
            severity: 'success',
            summary: 'Cargado',
            detail: 'Imágenes subidas y registradas correctamente.',
            key: 'tc',
            life: 2500,
          });
          this.uploader.clear(); // limpia el fileUpload
          this.visible = false; // cierra el popup al terminar
        },
      });
  }

  // --- Guardar en modo editar ---
  guardarData() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.labelbtn = 'Guardando';
    this.loading = true;

    const v = this.form.getRawValue();
    this.api
      .sliderUpdate(this.currentId, {
        name_file: v.name_file,
        url: v.url,
        status: v.status,
      })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.labelbtn = 'Guardar';
        })
      )
      .subscribe({
        next: () => {
          this.getSlider();
          this.visible = false;
          this.toast.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'La imagen se actualizó correctamente.',
            key: 'tc',
            life: 2500,
          });
        },
        error: (err) => console.error('Error al actualizar imagen:', err),
      });
  }
}
