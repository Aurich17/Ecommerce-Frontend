import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { Router, RouterModule } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,PasswordModule,InputTextModule,ButtonModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent {
  constructor(private router: Router) { }
  resetpassform = new FormGroup({
    newpass: new FormControl(null, null),
    repeatpass: new FormControl(null, null),
  })

  resetPass(){

  }
}
