import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Viaje } from '../../interfaces/viaje.interface';


@Component({
  selector: 'app-modal-pago',
  templateUrl: './modal-pago.component.html',
  styleUrl: './modal-pago.component.css'
})
export class ModalPagoComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalPagoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { razon_social: string, email: string ,alias:string,viaje: Viaje[], idReserva: number, }
  ) {}

  
  onClose(event: MouseEvent): void {
    event.preventDefault();  // Evitar la acción por defecto del evento
    console.log("Cerrando el modal...");
    this.dialogRef.close();
  }
  

  copiarAlias(texto: string): void {  
    navigator.clipboard.writeText(texto).then(() => {
      alert('Alias copiado al portapapeles!');
    }).catch(err => {
      console.error('Error al copiar: ', err);
    });
  }

  crearEnlaceEmail(): string {

    const viaje = this.data.viaje[0];
    const PK_Reserva = this.data.idReserva;
  
    const subject = encodeURIComponent(`Comprobante de pago Reserva N° ${PK_Reserva} - Viaje N° ${viaje.PK_Viaje}`);
    const body = encodeURIComponent(
      `Adjunto comprobante de pago para la Reserva N° ${PK_Reserva} - Viaje N° ${viaje.PK_Viaje}\n\n` +
      `Fecha: ${viaje.fecha_salida} - ${viaje.fecha_llegada}\n` +
      `Horario: ${viaje.horario_salida} - ${viaje.horario_llegada}\n\n` +
      `Por favor adjunta comprobante de pago al email.`
    );
  
    return `mailto:${this.data.email}?subject=${subject}&body=${body}`;
  }  
  
}
