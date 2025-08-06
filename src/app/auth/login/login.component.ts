import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

    initializeForm(){
      this.loginForm = new FormGroup({
        email : new FormControl (null,null),
        password : new FormControl(null,null),
      });
    }

    ngOnInit():void{
      this.initializeForm()
    }
}
