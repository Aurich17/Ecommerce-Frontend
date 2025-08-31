/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ IMPORTANTE
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RadioButtonModule,
    ButtonModule,
    RouterModule,
    NgClass,
    FormsModule, // ✅ Esto habilita [(ngModel)]
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  selectedType: string = '';

  constructor(private router: Router) {}

  continuar() {
    if (this.selectedType === 'cliente') {
      this.router.navigate(['/register/cliente']);
    } else if (this.selectedType === 'tienda') {
      this.router.navigate(['/register/empresa']);
    }
  }
}
