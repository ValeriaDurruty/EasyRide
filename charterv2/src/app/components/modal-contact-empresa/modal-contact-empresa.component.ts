import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-contact-empresa',
  templateUrl: './modal-contact-empresa.component.html',
  styleUrl: './modal-contact-empresa.component.css'
})
export class ModalcontactEmpresaComponent {

  // El constructor recibe los datos de la empresa
  constructor(
    public dialogRef: MatDialogRef<ModalcontactEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { razon_social: string, cuit: string, email: string, telefono: number }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}

