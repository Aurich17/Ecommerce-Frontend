import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.services';
import { SessionService } from '../../../services/session/session.service';
import { LoginRequest } from '../login/domain/request/login.request';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,InputTextModule, ReactiveFormsModule, PasswordModule, ButtonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private session = inject(SessionService);
  private router = inject(Router);

  loginForm!: FormGroup;
  loading = false;
  errorMsg = '';

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      password: new FormControl<string | null>(null, [Validators.required]),
    });
  }

  onSubmit() {
    if (this.loginForm.invalid || this.loading) return;

    this.loading = true;
    this.errorMsg = '';

    const req: LoginRequest = this.loginForm.getRawValue() as LoginRequest;

    this.auth.login(req)
  .pipe(
    finalize(() => (this.loading = false))
  )
  .subscribe({
    next: (res) => {
      this.session.setFromLogin(res);
      this.router.navigate(['principal']);
    },
    error: (err: HttpErrorResponse) => {
      this.errorMsg = err?.error?.message
        || (err.status === 0 ? 'No se pudo conectar con el servidor' : 'Credenciales inválidas');
    }
  });
  }
}
