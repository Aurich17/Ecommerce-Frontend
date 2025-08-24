import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MailService } from '../../../../../services/mail/mail.service';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [CardModule, InputTextModule, ButtonModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {
  constructor(private router: Router,private mailService: MailService) { }
  loading: boolean = false;
  labelbtn: string = 'Enviar Enlace'
  forgotpassform = new FormGroup({
    correo: new FormControl(null, null)
  })
  enviarCorreoResetPass() {
    this.loading = true;
    const values = this.forgotpassform.value

    const token = "123";
    const to = 'gaby.canova.aquije@gmail.com'//values.correo || '';
    const subject = 'Restablecimiento de contraseña';
    const text = `
    <div style="background-color:#f4f4f4; padding:30px; font-family:Arial, sans-serif;">
    <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
      <h2 style="text-align:center; color:#333;">Restablecimiento de contraseña</h2>
      <p style="font-size:16px; color:#555; text-align:center;">
        Hemos recibido una solicitud para restablecer su contraseña. Si no fue usted quien lo solicitó, ignore este mensaje.</strong>.
      </p>
      <div style="text-align:center; margin:30px 0;">
        <a href="http://localhost:4200/resetpassword?token=${token}" 
           style="background-color:#007bff; color:#fff; padding:12px 24px; text-decoration:none; border-radius:5px; font-size:16px;">
          Restablecer contraseña
        </a>
      </div>
      <p style="font-size:12px; color:#888; text-align:center; margin-top:20px;">
        Este enlace expirará en 1 hora por motivos de seguridad.
      </p>
      <p style="font-size:14px; color:#888; text-align:center; margin-top:30px;">
        Atentamente,<br>
        El equipo de FiaoX<br>
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
    setTimeout(() => {
      this.loading = false;
      this.labelbtn = 'Enviar Enlace Nuevamente'
    }, 2000);
  }
}
