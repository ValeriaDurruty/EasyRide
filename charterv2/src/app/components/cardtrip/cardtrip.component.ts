import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Viaje } from '../../interfaces/viaje.interface';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NotificacionService } from '../../services/notificacion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cardtrip',
  templateUrl: './cardtrip.component.html',
  styleUrls: ['./cardtrip.component.css','/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css'
  ]
})
export class CardtripComponent implements OnInit {
  @Input() viajes: Viaje[] = [];
  userRole: number | null = null;
  userValidar: number | null = null
  userNombre: string | null = null;
  userApellido: string | null = null;
  private userSubscription: Subscription | undefined; // Declara la propiedad


  constructor(private router: Router, private userService: UserService, 
    private _snackBar: MatSnackBar, private ngZone:NgZone,
    private route: ActivatedRoute,
    private _notificacionService: NotificacionService) {}

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      const currentUrl = this.router.url;
      if (currentUrl === '/Vista-Trips') {
        this.loadCardtripData();
      }
    });
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
  
  private loadCardtripData() {
    // Implementa aquí la lógica para cargar los datos específicos de la ruta '/Cardtrip'
    console.log('Cargando datos para Cardtrip');
  }

  notificarDisponibilidad(PK_Viaje: number): void {
    console.log('Notificando disponibilidad para el viaje:', PK_Viaje);
  
    if (this.userService.isAuthenticated()) {  // Verifica si el usuario está autenticado
      console.log('Usuario está autenticado.');
  
      this.userSubscription = this.userService.getCurrentUser().subscribe(user => {
        if (user) {
          // Asigna los datos del usuario logueado
          this.userRole = user.FK_Rol;
          this.userValidar = user.PK_Usuario;
          console.log('Usuario desde CardtripComponent:', user);
  
          // Lógica para notificar disponibilidad
          console.log('Rol del usuario:', this.userRole);
          this.ngZone.run(() => {  // Ejecuta las actualizaciones en el contexto de Angular
            switch (this.userRole) {
              case 3: // Cliente
                //console.log('Rol de cliente, notificando disponibilidad', PK_Viaje);
                this._notificacionService.addNotificacion(this.userValidar || 0, PK_Viaje).subscribe(() => {
                  this.mensaje('Notificación activada correctamente');
                }, error => {
                  console.error('Error al notificar disponibilidad:', error);
                  this.mensaje('Error al enviar la notificación');
                });
                break;
              case 2: // Empleado
                this.mensaje('No puedes notificar disponibilidad siendo un empleado de una empresa');
                break;
              case 1: // Administrador
                this.mensaje('No puedes notificar disponibilidad siendo un administrador');
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
      this.ngZone.run(() => {  // Se notifica al usuario que debe loguearse para activar la notificación
        this.mensaje('Debes iniciar sesión para activar la notificación');
        this.router.navigate(['/LogIn'], { queryParams: { returnUrl: `/Vista-Trips` } });
      });
    }
  };

  mensaje(mensaje:string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']  // Es para darle estilo
    });
  }
}
