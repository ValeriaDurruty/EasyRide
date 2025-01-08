import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-listado-reservas',
  templateUrl: './listado-reservas.component.html',
  styleUrl: './listado-reservas.component.css'
})
export class ListadoReservasComponent implements OnChanges{
  @Input() reservaData: any;
  @Output() close = new EventEmitter<void>();
  selectedReservaData: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    console.log('Cambios detectados:', changes); // Verifica los cambios detectados
    if (changes['reservaData']) {
      this.filterReservaData();
    }
  }

  closeModal() {
    this.close.emit(); // Emitir sin datos para cerrar el modal
  }


  filterReservaData() {
    if (this.reservaData && Array.isArray(this.reservaData)) {
      const viajeData = this.reservaData[0]; // Obtén el primer objeto del array
      if (viajeData && viajeData.reservas) {
        console.log('Datos originales de reservas:', viajeData.reservas); // Log de los datos originales
  
        this.selectedReservaData = viajeData.reservas
          .filter((reserva: any) => reserva.estado_reserva !== 'Cancelado') // Excluye reservas canceladas
          .map((reserva: any) => {
            const fechaCreacion = new Date(reserva.fecha_creacion);
            const formattedDate = `${fechaCreacion.getDate().toString().padStart(2, '0')}-${(fechaCreacion.getMonth() + 1).toString().padStart(2, '0')}-${fechaCreacion.getFullYear()}`;
                      
            return {
              PK_Reserva: reserva.PK_Reserva,
              nombre: reserva.nombre,
              apellido: reserva.apellido,
              estado: reserva.estado_reserva,
              fecha_creacion: formattedDate,
              estado_pago: reserva.estado_pago // Verifica que se asigna correctamente
            };
          });
          
  
        console.log('Datos filtrados para mostrar:', this.selectedReservaData); // Log de los datos procesados
      } else {
        console.error('No se encontraron reservas en reservaData');
      }
    } else {
      console.error('reservaData no es un array o está vacío');
    }
  }
  
  
  
  

  downloadPDF() {
    const ticketContent = document.querySelector('.ticket-container') as HTMLElement;

    if (ticketContent && this.reservaData.length > 0) {
      html2canvas(ticketContent).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const margin = 10; // Margen en mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const adjustedImgWidth = imgWidth - 2 * margin;
        const adjustedImgHeight = canvas.height * adjustedImgWidth / canvas.width;

        pdf.addImage(imgData, 'PNG', margin, margin, adjustedImgWidth, adjustedImgHeight);
        heightLeft -= (pageHeight - 2 * margin);

        while (heightLeft >= 0) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, -heightLeft + margin, adjustedImgWidth, adjustedImgHeight);
          heightLeft -= (pageHeight - 2 * margin);
        }

        const fileName = `Listado Reserva_${this.reservaData[0]?.PK_Viaje || ''}.pdf`;
        pdf.save(fileName);
      }).catch(error => {
        console.error('Error al generar el PDF:', error);
      });
    } else {
      console.error('Elemento del ticket no encontrado o reserva vacía');
    }
  }
}