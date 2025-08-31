/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { LandingService } from '../../../../services/landing.services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { itemsLandingAudience } from './domain/quienes.response';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AudienceRequest } from '../encabezado/domain/request/encabezado.request';
// import { th } from 'intl-tel-input/i18n';
import { ToastModule } from 'primeng/toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-quienes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule,
  ],
  templateUrl: './quienes.component.html',
  styleUrl: './quienes.component.css',
  providers: [MessageService],
})
export class QuienesComponent implements OnInit {
  constructor(
    private apiService: LandingService,
    private router: Router,
    private messageService: MessageService
  ) {}
  quienesTable: itemsLandingAudience[] = [];
  quienesLanding: itemsLandingAudience[] = [];
  loadingAud = false;
  errorAud = '';
  visible = false;
  titulomantenimiento = 'Registrar Audiencia';
  labelbtn = 'Guardar';
  loading = false;
  clonedTable: Record<string, any> = {};
  listaEntidad: any[] = [];
  currentId!: number;
  addRegister = false;
  quienesform = new FormGroup({
    icono: new FormControl(null, null),
    entidad: new FormControl(null, null),
    descripcion: new FormControl(null, null),
  });
  ngOnInit() {
    this.getAudiencia();
  }
  getAudiencia() {
    this.apiService.getLandingAudience().subscribe({
      next: (data) => {
        console.log('data', data);
        this.quienesTable = data.data.items;
      },
      error: (err) => console.error('Error fetching audiencia:', err),
    });
  }
  agregarEntidad() {
    this.visible = true;
    this.titulomantenimiento = 'Registrar Audiencia';
    this.addRegister = true;
    this.quienesform.reset();
    this.currentId = 0;
  }
  exportExcel() {
    const header = ['ID', 'Ícono', 'Entidad', 'Descripción'];
    const data = this.quienesTable.map((item) => [
      item.id,
      item.icon,
      item.entity,
      item.description,
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(blob, `QuienesPuedenUsar_${new Date().getTime()}.xlsx`);
  }
  exportCsv() {
    const rows = this.quienesTable.map((item) => [
      item.id,
      item.icon,
      item.entity,
      item.description,
    ]);
    const csvContent = [['ID', 'Ícono', 'Entidad', 'Descripción'], ...rows]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `QuienesPuedenUsar_${new Date().getTime()}.csv`);
  }
  exportPdf() {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['ID', 'Ícono', 'Entidad', 'Descripción']],
      body: this.quienesTable.map((item) => [
        item.id,
        item.icon,
        item.entity,
        item.description,
      ]),
    });
    doc.save(`QuienesPuedenUsar_${new Date().getTime()}.pdf`);
  }
  onEditPoppup(row: any) {
    this.visible = true;
    this.titulomantenimiento = 'Actualizar Audiencia';
    this.addRegister = false;
    this.currentId = row.id;
    this.quienesform.reset();
    if (row) {
      this.quienesform.get('icono')?.setValue(row.icon);
      this.quienesform.get('entidad')?.setValue(row.entity);
      this.quienesform.get('descripcion')?.setValue(row.description);
    }
  }
  onDeleteRow(id: number) {
    this.apiService.deleteLandingAudience(id).subscribe({
      next: (data) => {
        this.getAudiencia();
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'La audiencia se eliminó correctamente.',
          key: 'tc',
          life: 2500,
        });
      },
      error: (err) => console.error('Error al eliminar audiencia:', err),
    });
  }
  guardarData() {
    console.log('HACE CLICK');
    this.labelbtn = 'Guardando';
    this.loading = true;

    const f = this.quienesform.value;

    const request: AudienceRequest = {
      icon: f.icono ?? '',
      entity: f.entidad ?? '', // si lo capturas en el form; si no, pásalo vacío o elimínalo si tu backend no lo requiere
      description: f.descripcion ?? '',
      position: 1,
      enabled: true,
    };

    if (this.addRegister === true) {
      this.apiService.createdLandingAudience(request).subscribe({
        next: ({ data }) => {
          this.getAudiencia();
          this.visible = false;
          this.loading = false;
          this.labelbtn = 'Guardar';
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'La audiencia se creó correctamente.',
            key: 'tc',
            life: 2500,
          });
        },
        error: (err) => console.error('Error al crear audiencia:', err),
      });
    } else {
      this.apiService.updateLandingAudience(this.currentId, request).subscribe({
        next: ({ data }) => {
          this.getAudiencia();
          this.visible = false;
          this.loading = false;
          this.labelbtn = 'Guardar';
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'La audiencia se actualizó correctamente.',
            key: 'tc',
            life: 2500,
          });
        },
        error: (err) => console.error('Error al actualizar testimonial:', err),
      });
    }
  }
}
