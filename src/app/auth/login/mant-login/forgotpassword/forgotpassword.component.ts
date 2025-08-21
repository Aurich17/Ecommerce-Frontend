import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [CardModule, InputTextModule, ButtonModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {
  constructor(private router: Router) {}
  loading: boolean = false;
  forgotpassform = new FormGroup({
    correo: new FormControl(null,null)
  })
  enviarCorreoResetPass(){
    this.loading = true;
  }
}
