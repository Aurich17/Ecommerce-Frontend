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
import { id } from 'intl-tel-input/i18n';
import { SelectButtonChangeEvent, SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { MailService } from '../../../../services/mail/mail.service';

@Component({
  selector: 'app-solicitud-compra',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, TableModule, FormsModule, DialogModule, DropdownModule, InputTextModule, InputTextareaModule, SelectButtonModule, CommonModule],
  templateUrl: './solicitud-compra.component.html',
  styleUrl: './solicitud-compra.component.css',
  providers: [MessageService],
})
export class SolicitudCompraComponent {
  constructor(
    private apiService: LandingService,
    private router: Router,
    private messageService: MessageService,
    private mailService: MailService
  ) { }
  visible: boolean = false
  infocliente: boolean = true
  labelbtn: string = 'Guardar Estado'
  loading: boolean = false
  solicitudesTable: any[] = [
    { id: 1, numeroorden: 'SC-0001', fechaemision: '2024-01-01', fechaentrega: '2024-01-10', estado: 'Pendiente', total: 1500, moneda: 'USD', notas: 'Entrega urgente', create_at: '2024-01-01 10:00' },
  ]
  listaEstado: any[] = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Aprobado', value: 'Aprobado' },
    { label: 'Rechazado', value: 'Rechazado' }
  ]
  stateOptions: any[] = [
    { label: 'Productos', value: 'productos' },
    { label: 'Comprador', value: 'comprador' }
  ];
  solicitudform = new FormGroup({
    select: new FormControl('productos', null),
    estado: new FormControl(null, null),
    nota: new FormControl(null, null)
  });

  exportExcel() {

  }
  exportCsv() {

  }
  exportPdf() {

  }

  onEditPoppup(row: any) {
    this.visible = true
    this.solicitudform.reset()
    if (row) {
      this.solicitudform.get('select')?.setValue('productos');
      this.solicitudform.get('estado')?.setValue(row.estado);
      this.solicitudform.get('nota')?.setValue(row.notas);
    }
  }

  onDeleteRow(id: number) {

  }
  guardarData() {
    this.loading = true;
    this.labelbtn = 'Guardando...'
    this.enviarCorreoOrdenCompraAprobada()
    setTimeout(() => {
      this.loading = false;
      this.labelbtn = 'Guardar Estado'
    }, 2000);
  }

  mostrarSeccion(event: SelectButtonChangeEvent) {
    console.log('event', event)
    if (event?.value === 'productos') {
      this.infocliente = true
    } else {
      this.infocliente = false
    }
  }

  enviarCorreoOrdenCompraAprobada() {
    const values = this.solicitudform.value
    const to = 'gaby.canova.aquije@gmail.com'//values.email || '';
    const subject = 'Detalle Orden de Compra';
    const text = `
    <div style="background-color:#f4f4f4; padding:30px; font-family:Arial, sans-serif;">
  <div style="max-width:700px; margin:0 auto; background-color:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    
    <h2 style="text-align:center; color:#007bff; margin-bottom:10px;">Orden de Compra ${values.estado}</h2>
    <p style="text-align:center; font-size:14px; color:#555; margin-bottom:30px;">
      Estimado/a <strong>Juan Pérez</strong>, su orden de compra ha sido ${values.estado} exitosamente.  
      A continuación encontrará el detalle:
    </p>

    <!-- Datos del comprador -->
    <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:14px; color:#333;">
      <tr>
        <td style="padding:8px; border:1px solid #ddd;"><strong>Nombre:</strong></td>
        <td style="padding:8px; border:1px solid #ddd;">Juan Pérez</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;"><strong>Email:</strong></td>
        <td style="padding:8px; border:1px solid #ddd;">juan.perez@gmail.com</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;"><strong>Fecha de Emisión:</strong></td>
        <td style="padding:8px; border:1px solid #ddd;">22/08/2025</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;"><strong>Fecha de Entrega:</strong></td>
        <td style="padding:8px; border:1px solid #ddd;">30/08/2025</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;"><strong>Moneda:</strong></td>
        <td style="padding:8px; border:1px solid #ddd;">USD</td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #ddd;"><strong>Estado Actual:</strong></td>
        <td style="padding:8px; border:1px solid #ddd; color:green; font-weight:bold;">Aprobada</td>
      </tr>
    </table>

    <!-- Detalle de productos -->
    <h3 style="color:#333; margin-bottom:10px;">Detalle de Productos</h3>
    <table style="width:100%; border-collapse:collapse; font-size:14px; color:#333;">
      <thead>
        <tr style="background-color:#f8f8f8;">
          <th style="padding:8px; border:1px solid #ddd;">ID Producto</th>
          <th style="padding:8px; border:1px solid #ddd;">Cantidad</th>
          <th style="padding:8px; border:1px solid #ddd;">Precio Unitario</th>
          <th style="padding:8px; border:1px solid #ddd;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:8px; border:1px solid #ddd; text-align:center;">P001</td>
          <td style="padding:8px; border:1px solid #ddd; text-align:center;">2</td>
          <td style="padding:8px; border:1px solid #ddd; text-align:center;">$50.00</td>
          <td style="padding:8px; border:1px solid #ddd; text-align:center;">$100.00</td>
        </tr>
        <tr>
          <td style="padding:8px; border:1px solid #ddd; text-align:center;">P002</td>
          <td style="padding:8px; border:1px solid #ddd; text-align:center;">1</td>
          <td style="padding:8px; border:1px solid #ddd; text-align:center;">$120.00</td>
          <td style="padding:8px; border:1px solid #ddd; text-align:center;">$120.00</td>
        </tr>
        <tr>
          <td style="padding:8px; border:1px solid #ddd; text-align:center;">P003</td>
          <td style="padding:8px; border:1px solid #ddd; text-align:center;">5</td>
          <td style="padding:8px; border:1px solid #ddd; text-align:center;">$20.00</td>
          <td style="padding:8px; border:1px solid #ddd; text-align:center;">$100.00</td>
        </tr>
      </tbody>
    </table>

    <!-- Total -->
    <p style="text-align:right; font-size:16px; font-weight:bold; margin-top:20px; color:#333;">
      Total: $320.00 USD
    </p>

    <!-- Footer -->
    <p style="font-size:12px; color:#888; text-align:center; margin-top:30px;">
      Gracias por confiar en <strong>FiaoX</strong>.<br>
      Este correo es automático, no es necesario responder.
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
