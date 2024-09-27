import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modalsh',
  templateUrl: './modalsh.component.html',
  styleUrls: ['./modalsh.component.css']
})
export class ModalshComponent {
  data: any;
  tipoOperacion: string;

  @Output() confirm = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<ModalshComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.data = dialogData;
    this.tipoOperacion = this.data.tipoOperacion;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onConfirm() {
    this.confirm.emit(this.data);
    console.log('Datos emitidos:', this.data);
    this.dialogRef.close();
    console.log('Modal cerrado');
  }
}