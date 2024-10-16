import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Parada } from '../../interfaces/parada.interface';
import { ViajeParada } from '../../interfaces/viaje.parada';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

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
  private userSubscription: Subscription | undefined; // Declara la propiedad


  constructor(private router: Router, private userService: UserService,
     private _snackBar: MatSnackBar, private ngZone:NgZone) {}

  ngOnInit(): void {
    /*console.log('Verificando autenticación...');
    if (this.userService.isAuthenticated()) {  // Verifica si el usuario está autenticado
      console.log('Usuario está autenticado.');
      this.userService.getCurrentUser().subscribe(user => {
        if (user) {
          this.userRole = user.FK_Rol; // Asigna el rol del usuario logeado
          this.userValidar = user.validar; // Asigna el validar del usuario logeado
          this.userNombre = user.nombre; // Asigna el nombre del usuario logeado
          this.userApellido = user.apellido; // Asigna el apellido del usuario logeado
          console.log('Usuario desde CardtripComponent:', user);
        } else {
          console.log('Usuario no encontrado.');
        }
      });
    } else {
      console.log('No hay usuario autenticado.');
    }*/
  }

  // Lista de imágenes correspondientes por índice
  imagenesPorIndice = [
    '/assets/images/prueba2.webp',
    '/assets/images/prueba1.webp',
    '/assets/images/prueba3.webp',
    '/assets/images/prueba4.webp'
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
    console.log('Iniciando reserva con ID:', id);
  
    if (this.userService.isAuthenticated()) {  // Verifica si el usuario está autenticado
      console.log('Usuario está autenticado.');
  
      this.userSubscription = this.userService.getCurrentUser().subscribe(user => {
        if (user) {
          // Asigna los datos del usuario logueado
          this.userRole = user.FK_Rol;
          console.log('Usuario desde CardtripComponent:', user);
  
          // Lógica para redireccionar según el rol del usuario
          console.log('Rol del usuario:', this.userRole);
          this.ngZone.run(() => {  // Ejecuta las actualizaciones en el contexto de Angular
            switch (this.userRole) {
              case 3: // Cliente
                console.log('Rol de cliente, redirigiendo a /Reservar', id);
                this.router.navigate(['/Reservar', id]);
                break;
              case 2: // Empleado
                this.mensaje('No puedes reservar un viaje siendo un empleado de una empresa');
                break;
              case 1: // Administrador
                this.mensaje('No puedes reservar un viaje siendo un administrador');
                break;
              default:
                console.log('Rol de usuario no reconocido');
            }
          });
        } else {
          console.log('Usuario no encontrado.');
        }
      });
    } else {
      console.log('No hay usuario autenticado, redirigiendo a login');
      this.ngZone.run(() => {  // Ejecuta la redirección en el contexto de Angular
        this.router.navigate(['/LogIn'], { queryParams: { returnUrl: `/Reservar/${id}` } });
      });
    }
  }
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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