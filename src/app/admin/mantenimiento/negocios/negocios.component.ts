import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CategoriaRow } from '../categorias/supabase-categorias.service';
import { SupabaseNegociosService } from './supabase-negocios.services';

// import {
//   SupabaseCategoriasService,
//   CategoriaRow,
// } from './supabase-categorias.service';

@Component({
  selector: 'app-negocios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
  ],
  templateUrl: './negocios.component.html',
  styleUrl: './negocios.component.css',
  providers: [MessageService, ConfirmationService],
})
export class NegociosComponent implements OnInit {
  categoriasTable: CategoriaRow[] = [];
  visible = false;
  tituloMantenimiento = 'Registrar Categoría';
  labelBtn = 'Guardar';
  loading = false;
  addRegister = false;
  currentId: number | null = null;

  categoriasForm = new FormGroup({
    codigo: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
    ]),
    nombre: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private categoriasSvc: SupabaseNegociosService,
    private message: MessageService,
    private confirm: ConfirmationService
  ) {}

  async ngOnInit() {
    await this.loadTable();
  }

  async loadTable() {
    try {
      this.categoriasTable = await this.categoriasSvc.list();
    } catch (e: any) {
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: e?.message ?? 'No se pudo cargar',
      });
    }
  }

  agregarCategoria = async () => {
    this.categoriasForm.reset({ codigo: '', nombre: '' });
    this.currentId = null;
    this.addRegister = true;
    this.tituloMantenimiento = 'Agregar Categoría';
    this.labelBtn = 'Guardar';
    this.visible = true;

    // 🔢 obtener próximo código y setearlo
    const next = await this.categoriasSvc.nextCode();
    this.categoriasForm.patchValue({ codigo: next });
    this.categoriasForm.get('codigo')?.disable();
  };

  onEditPopup(cat: CategoriaRow) {
    this.currentId = cat.id;
    this.categoriasForm.patchValue({
      codigo: cat.cod_tipo,
      nombre: cat.des_tipo,
    });
    this.addRegister = false;
    this.tituloMantenimiento = 'Editar Categoría';
    this.labelBtn = 'Actualizar';
    this.visible = true;
    this.categoriasForm.get('codigo')?.disable();
  }

  onDeleteRow(cat: CategoriaRow) {
    this.confirm.confirm({
      message: `¿Eliminar la categoría "${cat.des_tipo}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          // Opcional: bloquear si está en uso
          // if (await this.categoriasSvc.isInUse(cat.id)) {
          //   this.message.add({ severity: 'warn', summary: 'Aviso', detail: 'La categoría está asignada a productos' });
          //   return;
          // }
          await this.categoriasSvc.remove(cat.id);
          this.message.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoría eliminada',
          });
          await this.loadTable();
        } catch (e: any) {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: e?.message ?? 'No se pudo eliminar',
          });
        }
      },
    });
  }

  async guardarData() {
    if (this.categoriasForm.invalid) {
      Object.values(this.categoriasForm.controls).forEach((c) =>
        c.markAsTouched()
      );
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Complete los campos requeridos',
      });
      return;
    }

    this.loading = true;

    try {
      if (this.addRegister) {
        // si deshabilitaste el control, usa getRawValue() para leerlo
        const { codigo, nombre } = this.categoriasForm.getRawValue();
        await this.categoriasSvc.create({ nombre: nombre!, codigo: codigo! }); // se envía el auto-generado
        this.message.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Categoría creada',
        });
      } else {
        const { nombre } = this.categoriasForm.getRawValue();
        await this.categoriasSvc.update(this.currentId!, { nombre: nombre! }); // ❌ no cambiamos código
        this.message.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Categoría actualizada',
        });
      }
      this.visible = false;
      // reactivar por si quedó deshabilitado
      this.categoriasForm.get('codigo')?.enable();
      await this.loadTable();
    } catch (e: any) {
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: e?.message ?? 'Operación fallida',
      });
    } finally {
      this.loading = false;
    }
  }

  // placeholders como en productos
  exportExcel() {
    this.message.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Exportación Excel en desarrollo',
    });
  }
  exportCsv() {
    this.message.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Exportación CSV en desarrollo',
    });
  }
  exportPdf() {
    this.message.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Exportación PDF en desarrollo',
    });
  }
}
