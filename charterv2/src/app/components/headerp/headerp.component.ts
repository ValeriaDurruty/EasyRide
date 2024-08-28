import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-headerp',
  templateUrl: './headerp.component.html',
  styleUrls: ['/src/assets/assets/css/now-ui-kit.min.css',
    '/src/assets/assets/css/bootstrap.min.css',
    '/src/assets/assets/css/now-ui-kit.css', './headerp.component.css']
})
export class HeaderpComponent implements OnInit {
  userRole: number | null = null;
  userValidar: number | null = null
  userNombre: string | null = null;
  userApellido: string | null = null;


  constructor(private location: Location, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userRole = user.FK_Rol; // Asigna el rol del usuario logeado
        this.userValidar = user.validar; // Asigna el validar del usuario logeado
        this.userNombre = user.nombre; // Asigna el nombre del usuario logeado
        this.userApellido = user.apellido; // Asigna el apellido del usuario logeado
      }
    });
  }

  goBack() {
    this.location.back(); }  //Sigue todos los pasos q diste hacia adelante y vuelve atras en el mismo orden


 /* onLogout() {
     this.userDataService.setUser(null); //Limpio los datos del usuario
    this.userService.logoutUsuario().then(() => {
      window.location.reload(); //Recarga la página
      console.log('Sesión cerrada');
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    }); 
    this.userService.logoutUsuario().then(() => {
      this.router.navigate(['/']);
      console.log('Sesión cerrada');
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }*/

  onLogout() {
    this.userService.logoutUsuario().then(() => {
      // Restablecer las variables del usuario
      this.userRole = null;
      this.userValidar = null;
      this.userNombre = null;
      this.userApellido = null;
  
      // Navegar a la página de inicio o de login
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
              this.router.navigate(['/LogIn']);
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
