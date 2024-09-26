import { Component, NgZone } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserDataService } from '../../shared/user-data.service';
import { Router } from '@angular/router';
import { run } from 'node:test';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {

  constructor(private _userService:UserService,
            private router:Router,private ngZone:NgZone
  ){

  }

  navegar(): void {
    this._userService.getCurrentUser().subscribe(user => {
      this.ngZone.run(() => {
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
    });
  }
  
}
