/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MailService } from '../../../../../services/mail/mail.service';
import { AuthService } from '../../../../../services/auth.services';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css',
})
export class ForgotpasswordComponent {
  private fb = inject(FormBuilder);
  private api = inject(AuthService);

  loading = false;
  submitted = false;
  serverMsg = '';

  constructor(private router: Router, private mailService: MailService) {}
  labelbtn: string = 'Enviar Enlace';
  forgotpassform = new FormGroup({
    correo: new FormControl(null, null),
  });
  enviarCorreoResetPass() {
    if (this.forgotpassform.invalid || this.loading) return;
    this.loading = true;
    const email = this.forgotpassform.value.correo;

    this.api.requestPasswordReset(email!).subscribe({
      next: (res) => {
        this.submitted = true;
        this.serverMsg =
          res?.message || 'Si el email existe, te enviaremos instrucciones.';
        this.loading = false;
      },
      error: () => {
        // Mostrar el mismo mensaje para no filtrar emails
        this.submitted = true;
        this.serverMsg = 'Si el email existe, te enviaremos instrucciones.';
        this.loading = false;
      },
    });
  }
}
