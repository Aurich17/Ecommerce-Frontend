import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
// import { AuthApiService } from '../../core/auth-api.service';
import { AuthService } from '../../../../../services/auth.services';

function matchValidator(a: string, b: string) {
  return (group: AbstractControl): ValidationErrors | null => {
    const va = group.get(a)?.value;
    const vb = group.get(b)?.value;
    return va && vb && va === vb ? null : { notMatching: true };
  };
}

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css',
})
export class ResetpasswordComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(AuthService);

  token = '';
  loading = false;
  serverError = '';
  serverOk = '';

  resetpassform = new FormGroup(
    {
      newpass: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      repeatpass: new FormControl<string>('', [Validators.required]),
    },
    { validators: matchValidator('newpass', 'repeatpass') }
  );

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((p) => {
      this.token = p.get('token') || '';
    });
  }

  resetPass() {
    this.serverError = '';
    this.serverOk = '';
    if (!this.token) {
      this.serverError = 'Token inválido o faltante.';
      return;
    }
    if (this.resetpassform.invalid || this.loading) return;

    this.loading = true;
    const newPassword = this.resetpassform.value.newpass!;

    this.api.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.serverOk = 'Contraseña cambiada correctamente. Redirigiendo...';
        // redirige al login (opcional)
        this.router.navigate(['/login'], { queryParams: { reset: 'ok' } });
      },
      error: (err) => {
        this.loading = false;
        this.serverError = err?.error?.message || 'Token inválido o expirado';
      },
    });
  }

  get f() {
    return this.resetpassform.controls;
  }
}
