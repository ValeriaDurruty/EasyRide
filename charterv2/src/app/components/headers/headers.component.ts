import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls:['/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css']
})
export class HeadersComponent implements OnInit {
  userRole: number | null = null;
  userValidar: number | null = null
  userNombre: string | null = null;
  userApellido: string | null = null;
  isVistatrips: boolean = false;
  isRegistrarse:boolean =false;

  constructor(private location: Location, private router: Router, 
    private userService: UserService,
    private _sessionService:SessionService ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userRole = user.FK_Rol;
        this.userValidar = user.validar;
        this.userNombre = user.nombre;
        this.userApellido = user.apellido;
      } else {
        // Maneja el caso cuando no hay usuario
        this.userRole = null;
        this.userValidar = null;
        this.userNombre = null;
        this.userApellido = null;
      }
      this.isVistatrips = this.router.url.includes('/Vista-Trips');
      this.isRegistrarse = this.router.url.includes('/Registrar');
    });
  }

  goBack() {
    this.location.back(); }  //Sigue todos los pasos q diste hacia adelante y vuelve atras en el mismo orden


    onLogout() {
      localStorage.removeItem('token');
      this.userService.logoutUsuario().then(() => {
        this.router.navigate(['/']);
        console.log('Sesión cerrada');
      }).catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
    }
  

  navegar(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        switch (user.FK_Rol) {
          case 1:
            this.router.navigate(['/V-admin']);
            break;
          case 2:
            if (user.validar === 1) {
            this.router.navigate(['/V-empresa']);
            } else {
              this.router.navigate(['/login']);
            }
            break;
          case 3:
            this.router.navigate(['/V-cliente']);
            break;
          default:
            this.router.navigate(['/LogIn']); // Redirige a login si el rol no está definido
            break;
        }
      } else {
        this.router.navigate(['/LogIn']); // Redirige a login si no hay usuario
      }
    });
  }
}
