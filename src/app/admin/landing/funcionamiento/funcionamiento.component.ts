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
import { HowItWorksRequest } from './domain/funcionamiento.request';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  currentId!: number;
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
    this.getLandingHowItWork();
  }

  getLandingHowItWork() {
    this.apiService.getLandingHowItWork().subscribe({
      next: (data) => {
        console.log('data', data)
        this.funcionamientoTable = data.data.items
      },
      error: (err) => console.error('Error fetching howitwork:', err),
    });
  }

  agregarItem() {
    this.visible = true
    this.titulomantenimiento = 'Registrar Audiencia'
    this.addRegister = true
    this.funcionamientoform.reset()
    this.currentId = 0;
  }
  exportExcel() {
    const header = ["ID", "Ícono", "Descripción"];
    const data = this.funcionamientoTable.map(item => [
      item.id,
      item.icon,
      item.description
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob: Blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `ComoFunciona_${new Date().getTime()}.xlsx`);
  }
  exportCsv() {
    const rows = this.funcionamientoTable.map(item => [item.id, item.icon, item.description]);
    const csvContent = [
      ['ID', 'Ícono', 'Descripción'],
      ...rows
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `ComoFunciona_${new Date().getTime()}.csv`);
  }
  exportPdf() {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['ID', 'Ícono', 'Descripción']],
      body: this.funcionamientoTable.map(item => [item.id, item.icon, item.description]),
    });
    doc.save(`ComoFunciona_${new Date().getTime()}.pdf`);
  }
  onEditPoppup(row: any) {
    this.visible = true
    this.titulomantenimiento = 'Actualizar Audiencia'
    this.addRegister = false
    this.currentId = row.id
    this.funcionamientoform.reset()
    if (row) {
      this.funcionamientoform.get('icono')?.setValue(row.icon);
      this.funcionamientoform.get('descripcion')?.setValue(row.description);
    }
  }
  onDeleteRow(id: number) {
    this.apiService.deleteLandingHowItWord(id).subscribe({
      next: (data) => {
        this.getLandingHowItWork();
        this.messageService.clear();
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'El item se eliminó correctamente.', key: 'tc', life: 2500 });
      },
      error: (err) => console.error('Error al eliminar item:', err),
    });
  }
  guardarData() {
    this.labelbtn = 'Guardando';
    this.loading = true;

    const f = this.funcionamientoform.value;

    const request: HowItWorksRequest = {
      icon: f.icono ?? '', // si lo capturas en el form; si no, pásalo vacío o elimínalo si tu backend no lo requiere
      description: f.descripcion ?? '',
      step_order: 1,
      enabled: true,
    };
    if (this.addRegister === true) {
      this.apiService.createdLandingHowItWord(request).subscribe({
        next: ({ data }) => {
          this.getLandingHowItWork();
          this.visible = false;
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({ severity: 'success', summary: 'Registrado', detail: 'El item se registró correctamente.', key: 'tc', life: 2500 });
          this.labelbtn = 'Guardar';
        },
        error: (err) => console.error('Error al registrar item:', err),
      });
    } else {
      this.apiService
        .updateLandingHowItWord(this.currentId, request)
        .subscribe({
          next: ({ data }) => {
            this.getLandingHowItWork();
            this.visible = false;
            this.loading = false;
            this.messageService.clear();
            this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'El item se actualizó correctamente.', key: 'tc', life: 2500 });
            this.labelbtn = 'Guardar';
          },
          error: (err) => console.error('Error al actualizar testimonial:', err),
        });
    }

  }
}
