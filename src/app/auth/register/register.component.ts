import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
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
