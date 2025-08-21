import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LandingService } from '../../../../services/landing.services';
import { FooterResponse, ItemsFooter } from './domain/pie-pagina.response';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-pie-pagina',
  standalone: true,
  imports: [AccordionModule, CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule,FileUploadModule],
  templateUrl: './pie-pagina.component.html',
  styleUrl: './pie-pagina.component.css'
})
export class PiePaginaComponent {
  constructor(
    private apiService: LandingService,
    private router: Router
  ) { }
  logoFile?: File;
  loading = false;
  footerLanding?: ItemsFooter;
  piepaginaform = new FormGroup({
    correo: new FormControl<string>(''),
    telefono: new FormControl<string>(''),
    titulo: new FormControl<string>(''),
    descripcion: new FormControl<string>(''),
    descripcionizq: new FormControl<string>(''),
    copyright: new FormControl<string>('')
  });

  ngOnInit() {
    this.getFooter();
    alert('Esta sección es solo para pruebas, no se guardan los cambios');
  }

  getFooter() {
    this.apiService.getLandingFooter().subscribe({
      next: (data) => {
        this.piepaginaform.patchValue({
          correo: data.data.contact_email ?? '',
          telefono: data.data.contact_phone ?? '',
          titulo: data.data.footer_title ?? '',
          descripcion: data.data.footer_desc ?? '',
          descripcionizq: data.data.footer_left_desc ?? '',
          copyright: data.data.footer_copy ?? '',
        });
      },
      error: (err) => console.error('Error fetching footer:', err),
    });
  }

  guardarCambios() {

  }

  onSelfieSelect(e: any): void {
    const file = e.files?.[0];
    if (!file) return;
    this.logoFile = file;
  }
}
