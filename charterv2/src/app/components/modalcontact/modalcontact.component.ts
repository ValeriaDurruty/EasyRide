import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modalcontact',
  templateUrl: './modalcontact.component.html',
  styleUrl: './modalcontact.component.css'
})
export class ModalcontactComponent {

  constructor(public dialogRef: MatDialogRef<ModalcontactComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
