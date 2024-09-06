import { Component, Input, OnInit, NgZone } from '@angular/core';
import { Parada } from '../../interfaces/parada.interface';
import { ViajeParada } from '../../interfaces/viaje.parada';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.css'
})
export class TripComponent {
  @Input() viajes: any[] = []; // Recibe los viajes aleatorios
  userRole: number | null = null;
  userValidar: number | null = null
  userNombre: string | null = null;
  userApellido: string | null = null;
  private isProcessing: boolean = false; // Flag para prevenir doble reserva

  constructor(private router: Router, private userService: UserService, private _snackBar: MatSnackBar, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userRole = user.FK_Rol; // Asigna el rol del usuario logeado
        this.userValidar = user.validar; // Asigna el validar del usuario logeado
        this.userNombre = user.nombre; // Asigna el nombre del usuario logeado
        this.userApellido = user.apellido; // Asigna el apellido del usuario logeado
        console.log('Usuario desde CardtripComponent:', user);
      } else {
        console.log('Usuario no encontrado.');
        console.log('Usuario desde CardtripComponent:', user);
      }
    });
  }

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

  //si user es null, cuando se presione el boton de reservar, se redirigira a la pagina de login y luego a la de reservar, únicamente si el usuario logueado es un cliente, o sea, si su rol es 3
  reservar(id: number): void {
    // Verificar si ya se está procesando una reserva para prevenir ejecución doble
    if (this.isProcessing) return;
    
    this.isProcessing = true; // Marcar como procesando
  
    this.ngZone.run(() => {
      if (this.userRole === null) {
        // Usuario no logueado, redirigir a la página de login con el returnUrl
        this.router.navigate(['/LogIn'], { queryParams: { returnUrl: `/Reservar/${id}` } });
      } else if (this.userRole === 3) {
        // Usuario cliente, permitir reservar
        this.router.navigate(['/Reservar', id]);
      } else if (this.userRole === 2) {
        // Usuario empleado, mostrar mensaje
        this.mensaje('No puedes reservar un viaje siendo un empleado de una empresa');
      } else if (this.userRole === 1) {
        // Usuario administrador, mostrar mensaje
        this.mensaje('No puedes reservar un viaje siendo un administrador');
      }
      this.isProcessing = false; // Liberar flag de procesamiento
    });
  }

  mensaje(mensaje:string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']  // Es para darle estilo
    });
  }
  }