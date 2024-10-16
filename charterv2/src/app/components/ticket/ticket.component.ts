import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReservaPasajero } from '../../interfaces/reservaPasajero.interface';
import { Reserva } from '../../interfaces/reserva.interface';
import { User } from 'firebase/auth';
import { Usuario } from '../../interfaces/user.interface';
import { Viaje } from '../../interfaces/viaje.interface';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  @Input() reserva: ReservaPasajero= {};
  @Output() close = new EventEmitter<void>(); // Usar void correctamente
  @Input() usuario: Usuario | null = null;

  closeModal() {
    this.close.emit(); // Emitir sin datos
  }

  downloadPDF() {
    // Seleccionar el contenedor del ticket
    const ticketContent = document.querySelector('.ticket-container') as HTMLElement;

    if (ticketContent) {
        html2canvas(ticketContent).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const margin = 10; // Margen en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            // Ajustar el tamaño de la imagen para dejar margen
            const adjustedImgWidth = imgWidth - 2 * margin;
            const adjustedImgHeight = canvas.height * adjustedImgWidth / canvas.width;
            
            // Agregar la primera página
            pdf.addImage(imgData, 'PNG', margin, margin, adjustedImgWidth, adjustedImgHeight);
            heightLeft -= (pageHeight - 2 * margin);

            // Agregar páginas adicionales si es necesario
            while (heightLeft >= 0) {
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, -heightLeft + margin, adjustedImgWidth, adjustedImgHeight);
                heightLeft -= (pageHeight - 2 * margin);
            }

            const fileName = `ticket_reserva_${this.reserva.PK_Reserva}.pdf`;
            pdf.save(fileName);
        }).catch(error => {
            console.error('Error al generar el PDF:', error);
        });
    } else {
        console.error('Elemento del ticket no encontrado');
    }
}

  /*getFormattedParadas(): string {
    if (this.reserva?.paradas && this.reserva.paradas.length > 0) {
      return this.reserva.paradas.map(p => p.parada).join(' - ');
    }
    return '';
  }*/

  getFormattedParadas(): string {
    if (this.reserva?.paradas && this.reserva.paradas.length > 0) {
      const primeraParada = this.reserva.paradas[0].parada;
      const ultimaParada = this.reserva.paradas[this.reserva.paradas.length - 1].parada;
      return `${primeraParada} - ${ultimaParada}`;
    }
    return '';
  }
}
