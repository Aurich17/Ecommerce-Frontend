/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, signal, OnInit, Input } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { SupabaseService } from '../../services/supabase.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SessionService } from '../../services/session/session.service';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-mis-comentarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DialogModule,
    TableModule,
    TagModule,
    ToastModule,
    DropdownModule,
  ],
  providers: [MessageService],
  templateUrl: './mis-comentarios.component.html',
  styleUrls: ['./mis-comentarios.component.css'],
})
export class MisComentariosComponent implements OnInit {
  @Input() userId!: string; // 👈 lo pasas desde tu lógica externa

  constructor(
    private supa: SupabaseService,
    private messageService: MessageService,
    public session: SessionService
  ) {}

  currentId?: number;
  visible = false;
  titulomantenimiento = 'Registrar Item';
  labelbtn = 'Guardar';
  loading = false;
  addRegister = false;

  comentariosTable: any[] = [];
  listaEstado = [
    { label: 'Si', value: true },
    { label: 'No', value: false },
  ];

  comentariosform = new FormGroup({
    cliente: new FormControl<string | null>(null),
    creacion: new FormControl<Date | null>(new Date()),
    comentario: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(500),
    ]),
    estado: new FormControl<boolean | null>(true),
  });

  ngOnInit() {
    this.getTestimonials();
  }

  async getTestimonials() {
    if (!this.session.user?.id) return;
    try {
      const rows = await this.supa.listTestimonialsByUser(
        this.session.user?.id
      );
      console.log(rows);
      this.comentariosTable = rows.map((r) => {
        const d = new Date(r.created_at);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return { ...r, creacion: `${dd}/${mm}/${yyyy}` };
      });
    } catch (err) {
      console.error(err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar tus comentarios.',
      });
    }
  }

  onAddPopup() {
    this.visible = true;
    this.titulomantenimiento = 'Agregar comentario';
    this.labelbtn = 'Guardar';
    this.addRegister = true;
    this.currentId = undefined;
    this.comentariosform.reset({ creacion: new Date(), estado: true });
  }

  onEditPoppup(row: any) {
    this.visible = true;
    this.titulomantenimiento = 'Actualizar comentario';
    this.addRegister = false;
    this.currentId = row.id;
    this.comentariosform.reset({
      cliente: row.client_name ?? null,
      comentario: row.comment ?? null,
      creacion: new Date(row.created_at),
      estado: !!row.enabled,
    });
  }

  async saveTestimonial() {
    console.log('GUARDANDO');
    this.labelbtn = 'Guardando';
    this.loading = true;

    if (this.comentariosform.invalid) {
      console.log('ES INVALIDO');
      this.loading = false;
      return;
    }
    if (!this.session.user?.id) {
      console.log('ES USER ID');
      this.loading = false;
      this.messageService.add({
        severity: 'warn',
        summary: 'Usuario',
        detail: 'No hay userId para asociar el testimonio.',
      });
      return;
    }

    const f = this.comentariosform.value;
    try {
      console.log('TRY');
      if (this.addRegister) {
        console.log('ADD REGISTER');

        // CREAR directo en Supabase
        await this.supa.insertTestimonial({
          comment: f.comentario ?? '',
          user_id: this.session.user?.id ?? '',
          client_name: f.cliente ?? null,
          occupation_text: 'Ingeniero de Software',
          occupation_tab: 'OCU',
          occupation_cod: '001',
          enabled: false,
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Creado',
          detail: 'El testimonio se creó correctamente.',
        });
      } else {
        console.log('ELSE');
        // ACTUALIZAR directo en Supabase
        if (!this.currentId) throw new Error('Falta id para actualizar');
        await this.supa.updateTestimonial(this.currentId, {
          comment: f.comentario ?? '',
          client_name: f.cliente ?? null,
          enabled: !!f.estado,
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'El testimonio se actualizó correctamente.',
        });
      }
      await this.getTestimonials();
      this.visible = false;
    } catch (err: any) {
      console.error(err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err?.message || 'Operación fallida.',
      });
    } finally {
      this.loading = false;
      this.labelbtn = 'Guardar';
    }
  }

  getSeverity(status: boolean) {
    return status ? 'success' : 'danger';
  }
}
