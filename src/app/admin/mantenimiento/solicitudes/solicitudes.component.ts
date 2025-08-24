import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonChangeEvent, SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MailService } from '../../../../services/mail/mail.service';
import { InputTextareaModule } from 'primeng/inputtextarea';


@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [InputTextareaModule,ReactiveFormsModule, ButtonModule, TableModule, FormsModule, TagModule, DialogModule, SelectButtonModule, CommonModule, InputTextModule, DropdownModule],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})
export class SolicitudesComponent {
  constructor(private mailService: MailService) { }
  visible: boolean = false
  infocliente: boolean = false
  loading: boolean = false
  labelbtn: string = "Actualizar"
  fotovalidacion: any
  fotodocumento: any
  solicitudesTable: any[] = [
    { id: '1', cliente: 'Prueba', estado: 'Aprobado', descripcion: 'No se', fechacreacion: '2025-08-16' },
  ]
  solicitudesform = new FormGroup({
    selectfiltro: new FormControl('todos', null),
    nombreapellido: new FormControl(null, null)
  });
  stateOptions: any[] = [
    { label: 'Documentos', value: 'documentos' },
    { label: 'Info de Usuario', value: 'infousser' }
  ];
  optionsFiltro: any[] = [
    { label: 'Todos', value: 'todos' },
    { label: 'Clientes', value: 'clientes' },
    { label: 'Empresas', value: 'empresas' }
  ];
  listaEstado: any[] = [
    { label: 'Aprobado', value: '1' },
    { label: 'Pendiente', value: '2' },
    { label: 'Rechazado', value: '3' }
  ];
  poppupgroup = new FormGroup({
    select: new FormControl('documentos', null),
    nombre: new FormControl(null, null),
    email: new FormControl(null, null),
    rol: new FormControl(null, null),
    socialsecurity: new FormControl(null, null),
    estado: new FormControl(null, null),
    motivorechazo: new FormControl(null, null)
  });
  exportExcel() {

  }
  exportCsv() {

  }
  exportPdf() {

  }
  onEditPoppup(row: any) {
    this.visible = true
    console.log('row', row)
    if (row) {
      this.poppupgroup.get('nombre')?.setValue(row.cliente);
      this.poppupgroup.get('rol')?.setValue(row.rol);
      this.poppupgroup.get('email')?.setValue(row.email);
      this.poppupgroup.get('socialsecurity')?.setValue(row.socialsecurity);
      this.poppupgroup.get('estado')?.setValue(row.estado);
    }
  }
  onDeleteRow(id: number) {

  }
  getSeverity(status: string) {
    switch (status) {
      case 'Aprobado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Rechazado':
        return 'danger';
      default:
        return 'secondary';
    }
  }
  mostrarSeccion(event: SelectButtonChangeEvent) {
    console.log('event', event)
    if (event?.value === 'documentos') {
      this.infocliente = false
    } else {
      this.infocliente = true
    }
  }

  actualizarCliente() {
    this.loading = true;
    this.labelbtn = 'Actualizando'
    this.enviarCorreoRechazo()
    setTimeout(() => {
      this.loading = false;
      this.labelbtn = 'Actualizar'
    }, 2000);
  }

  enviarCorreoAprobacion() {
    const values = this.poppupgroup.value
    const to = 'gaby.canova.aquije@gmail.com'//values.email || '';
    const subject = 'Su cuenta ha sido activada';
    const text = `
    <div style="background-color:#f4f4f4; padding:30px; font-family:Arial, sans-serif;">
      <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="text-align:center; color:#333;">Su cuenta ha sido activada</h2>
        <p style="font-size:16px; color:#555; text-align:center;">
          Hola, <strong>${values.nombre}</strong>,<br><br>
          Nos complace informarle que su cuenta ha sido activada exitosamente.
        </p>
        <div style="text-align:center; margin-top:30px;">
          <a href="http://localhost:4200/login" 
             style="background-color:#007bff; color:#fff; padding:12px 24px; text-decoration:none; border-radius:5px; font-size:16px;">
            Ir a FiaoX Marketplace
          </a>
        </div>
      </div>
    </div>
  `;

    this.mailService.sendMail(to, subject, text).subscribe({
      next: (res) => {
        console.log('✅ Respuesta del backend:', res);
        alert('Correo enviado con éxito');
      },
      error: (err) => {
        console.error('❌ Error al enviar correo:', err);
        alert('Error al enviar correo');
      }
    });
  }
  enviarCorreoRechazo() {
    const values = this.poppupgroup.value
    const to = 'gaby.canova.aquije@gmail.com'//values.email || '';
    const subject = 'Su cuenta ha sido suspendida';
    const text = `
    <div style="background-color:#f4f4f4; padding:30px; font-family:Arial, sans-serif;">
      <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="text-align:center; color:#555;">Su cuenta ha sido suspendida</h2>
        <p style="font-size:16px; color:#555; text-align:center;">
          Hola, <strong>${values.nombre}</strong>,<br><br>
          Nos complace informarle que su cuenta ha sido suspendida por el siguiente motivo:<br><br>
          ${values.motivorechazo}
        </p>
        <p style="font-size:16px; color:#555; text-align:center; margin-top:20px;">
          Para obtener mayor información o asistencia, por favor comuníquese con nuestro equipo de soporte a través de 
          <a href="mailto:chumpitazismael7@gmail.com" style="color:#007bff; text-decoration:none;">chumpitazismael7@gmail.com</a>.
        </p>
      </div>
    </div>
  `;

    this.mailService.sendMail(to, subject, text).subscribe({
      next: (res) => {
        console.log('✅ Respuesta del backend:', res);
        alert('Correo enviado con éxito');
      },
      error: (err) => {
        console.error('❌ Error al enviar correo:', err);
        alert('Error al enviar correo');
      }
    });
  }
}
