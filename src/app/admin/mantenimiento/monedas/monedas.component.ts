import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonChangeEvent, SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-monedas',
  standalone: true,
  imports: [CheckboxModule, ReactiveFormsModule, ButtonModule, TableModule, FormsModule, TagModule, DialogModule, SelectButtonModule, CommonModule, InputTextModule, DropdownModule,InputNumberModule,InputTextareaModule],
  templateUrl: './monedas.component.html',
  styleUrl: './monedas.component.css'
})
export class MonedasComponent {
  visible: boolean = false
  titulomantenimiento: string = 'Registrar Producto'
  labelbtn: string = 'Guardar'
  loading: boolean = false
  addRegister: boolean = false
  monedasTable: any [] = []
  monedasform = new FormGroup({
    nombre: new FormControl(null, null),
    descripcion: new FormControl(null, null),
    precio: new FormControl(null, null),
    stock: new FormControl(null, null),
    descuento: new FormControl(null, null),
  });

  ngOnInit() {
    this.getLandingMoneda();
  }

  getLandingMoneda(){
    
  }

  agregarMoneda(){
    this.visible = true
    this.titulomantenimiento = 'Registrar Moneda'
    this.addRegister = true
    this.monedasform.reset()
  }

  exportExcel(){

  }


  exportCsv(){

  }

  exportPdf(){

  }

  onEditPoppup(row: any){
    this.visible = true
    this.titulomantenimiento = 'Actualizar Producto'
    this.addRegister = false
    this.monedasform.reset()
    if (row) {
      this.monedasform.get('nombre')?.setValue(row.nombre);
      this.monedasform.get('descripcion')?.setValue(row.descripcion);
      this.monedasform.get('precio')?.setValue(row.precio);
      this.monedasform.get('stock')?.setValue(row.stock);
      this.monedasform.get('descuento')?.setValue(row.descuento);
    }
  }
  onDeleteRow(id: number){

  }
  guardarData(){
    this.labelbtn = 'Guardando'
    this.loading = true
  }
}
