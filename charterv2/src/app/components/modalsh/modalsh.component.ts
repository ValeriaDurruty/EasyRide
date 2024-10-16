import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modalsh',
  templateUrl: './modalsh.component.html',
  styleUrls: ['./modalsh.component.css']
})
export class ModalshComponent {
 @Output() onSelect = new EventEmitter<any>(); // Emisor de evento corregido
  @Output() confirm = new EventEmitter<any>(); // Ya tienes el de confirmación
  @Output() select: EventEmitter<any> = new EventEmitter();
  data: any;
  tipoOperacion: string;
  direccion: any;

  constructor(
    public dialogRef: MatDialogRef<ModalshComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.data = dialogData;
    this.tipoOperacion = this.data.tipoOperacion;
    this.direccion = this.data.direccion;
  }

  onSelectLocation(result: any) {
    this.select.emit(result); // Emitir el resultado seleccionado
    this.dialogRef.close(); // Cerrar el modal
  }
  selectResult(result: any) {
    this.select.emit(result); // Emite el resultado seleccionado
  }
  
  onClose(): void {
    this.dialogRef.close();
  }

  onConfirm() {
    this.confirm.emit(this.data); // Emite la confirmación
    //console.log('Datos emitidos:', this.data);
    this.dialogRef.close();
    //console.log('Modal cerrado');
  }
}
