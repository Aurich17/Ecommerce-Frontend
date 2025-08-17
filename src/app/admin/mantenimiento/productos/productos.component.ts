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

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, TableModule, FormsModule, TagModule, DialogModule, SelectButtonModule, CommonModule, InputTextModule, DropdownModule,InputNumberModule,InputTextareaModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  visible: boolean = false
  titulomantenimiento: string = 'Registrar Producto'
  labelbtn: string = 'Guardar'
  loading: boolean = false
  addRegister: boolean = false
  productosTable: any [] = []
  productosform = new FormGroup({
    nombre: new FormControl(null, null),
    descripcion: new FormControl(null, null),
    precio: new FormControl(null, null),
    stock: new FormControl(null, null),
    descuento: new FormControl(null, null),
  });
  ngOnInit() {
    this.getLandingProduct();
  }

  getLandingProduct(){
    
  }
  exportExcel(){

  }
  exportPdf(){

  }

  exportCsv(){
    
  }
  agregarProducto(){
    this.visible = true
    this.titulomantenimiento = 'Registrar Producto'
    this.addRegister = true
    this.productosform.reset()
  }
  onEditPoppup(row: any){
    this.visible = true
    this.titulomantenimiento = 'Actualizar Producto'
    this.addRegister = false
    this.productosform.reset()
    if (row) {
      this.productosform.get('nombre')?.setValue(row.nombre);
      this.productosform.get('descripcion')?.setValue(row.descripcion);
      this.productosform.get('precio')?.setValue(row.precio);
      this.productosform.get('stock')?.setValue(row.stock);
      this.productosform.get('descuento')?.setValue(row.descuento);
    }
  }
  onDeleteRow(id: number){

  }
  guardarData(){
    this.labelbtn = 'Guardando'
    this.loading = true
  }
}
