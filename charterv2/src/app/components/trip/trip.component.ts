import { Component, Input } from '@angular/core';
import { Parada } from '../../interfaces/parada.interface';
import { ViajeParada } from '../../interfaces/viaje.parada';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.css'
})
export class TripComponent {
  @Input() viajes: any[] = []; // Recibe los viajes aleatorios

  // Lista de imágenes correspondientes por índice
  imagenesPorIndice = [
    '/assets/images/prueba2.png',
    '/assets/images/prueba1.png',
    '/assets/images/prueba3.png',
    '/assets/images/prueba4.png'
    // Añade más imágenes si es necesario
  ];

  mostrarInfo(index: number): void {
    this.viajes.forEach((viaje, i) => {
      viaje.mostrar = i === index;
    });
  }

  getPrimeraYUltimaParada(viaje: any): { primeraParada: string; ultimaParada: string } {
    if (viaje.paradas) {
      const paradasArray = this.procesarParadas(viaje.paradas);
  
      // Obtener la primera parada (orden 1) y última parada (orden máximo)
      const primeraParada = paradasArray.find(p => p.orden === 1)?.parada || 'N/A';
      const ultimaParada = paradasArray[paradasArray.length - 1]?.parada || 'N/A';
  
      return { primeraParada, ultimaParada };
    } else {
      return { primeraParada: 'N/A', ultimaParada: 'N/A' };
    }
  }
  
  procesarParadas(paradas: string): { parada: string; orden: number }[] {
    // Divide la cadena en paradas individuales
    const partes = paradas.split(';').map(parada => parada.trim()).filter(parada => parada.length > 0);

    // Extrae la parada y el orden de cada cadena de parada
    return partes.map(parada => {
      // Divide cada cadena de parada en componentes separados por comas
      const componentes = parada.split(',').map(comp => comp.trim());

      // Extrae el nombre de la parada y el número de orden
      const paradaNombre = componentes.find(comp => comp.startsWith('Parada:'))?.split(':')[1]?.trim();
      const orden = componentes.find(comp => comp.startsWith('Orden:'))?.split(':')[1]?.trim();
      
      if (paradaNombre && orden) {
        return {
          parada: paradaNombre,  // Nombre de la parada
          orden: parseInt(orden, 10)  // Número de orden
        };
      }
      return { parada: 'N/A', orden: 0 };  // Valor por defecto si no coincide
    }).filter(p => p.parada !== 'N/A'); // Filtra valores no válidos
  }
  }