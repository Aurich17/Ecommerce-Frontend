import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { LandingService } from '../../../../services/landing.services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { getLandingAudienceResponse, itemsLandingAudience } from './domain/quienes.response';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AudienceRequest } from '../encabezado/domain/request/encabezado.request';


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
  ],
  templateUrl: './quienes.component.html',
  styleUrl: './quienes.component.css',
  providers: [MessageService],
})
export class QuienesComponent {
  constructor(
    private apiService: LandingService,
    private router: Router,
    private messageService: MessageService
  ) {}
  quienesTable: itemsLandingAudience[] = [];
  quienesLanding: itemsLandingAudience[] = [];
  loadingAud = false;
  errorAud = ''
  visible: boolean = false;
  titulomantenimiento: string = 'Registrar Audiencia';
  labelbtn: string = 'Guardar';
  loading: boolean = false;
  clonedTable: { [s: string]: any } = {};
  listaEntidad: any[] = [];
  currentId!:number
  addRegister: boolean = false;
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
      error: (err) => console.error('Error fetching encabezado:', err),
    });
  }
  agregarEntidad() {
    this.visible = true;
    this.titulomantenimiento = 'Registrar Audiencia';
    this.addRegister = true;
    this.quienesform.reset();
  }
  exportExcel() {}
  exportCsv() {}
  exportPdf() {}
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
  onDeleteRow() {}
  guardarData() {
    console.log('HACE CLICK')
    this.labelbtn = 'Guardando';
    this.loading = true;

    const f = this.quienesform.value;

    const request:AudienceRequest  = {
      icon: f.icono ?? '',
      entity: f.entidad ?? '', // si lo capturas en el form; si no, pásalo vacío o elimínalo si tu backend no lo requiere
      description: f.descripcion ?? '',
      position:  1,
      enabled: true,
    };

    this.apiService
      .updateLandingAudience(this.currentId, request)
      .subscribe({
        next: ({ data }) => {
          this.getAudiencia();
          this.visible = false;
        },
        error: (err) => console.error('Error al actualizar testimonial:', err),
      });
  }
}
