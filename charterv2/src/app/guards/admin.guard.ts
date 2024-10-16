/*import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('Ejecutando RoleGuard...');

    return this.userService.getCurrentUser().pipe(
      map(user => {
        console.log('Usuario desde RoleGuard:', user);

        const currentUrl = state.url.toLowerCase(); // Obtiene la URL actual desde el estado del router
        console.log('Ruta actual:', currentUrl);

        // Permitir acceso a rutas públicas
        if (currentUrl === '/login' ||  currentUrl === '/vista-trips' || currentUrl === '/search' || currentUrl === '/unauthorized') {
          console.log('Ruta pública. Acceso permitido.');
          return true;
        }

        if (user) {
          const isAuthorized = this.isAuthorized(user.FK_Rol, currentUrl);
          console.log('Autorizado:', isAuthorized);
          if (isAuthorized) {
            console.log('Usuario autorizado. Acceso permitido.');
            return true;
          } else {
            console.log('No autorizado. Redirigiendo a /unauthorized...');
            this.router.navigate(['/unauthorized']);
            return false;
          }
        } else {
          console.log('Usuario no encontrado.');
          this.router.navigate(['/unauthorized']);
          return false;
        }
      })
    );
  }

  private isAuthorized(role: number, url: string): boolean {
    console.log('Verificando autorización para rol:', role, 'y URL:', url);

    const roleRoutes: { [key: number]: string[] } = {
      1: ['/v-admin', '/Agregar-empresa', '/Editar-empresa/:id'],                // Admin
      2: ['/v-empresa', '/agregar-charter', '/editar-charter/:id', '/editar-viaje/:id', '/agregar-viaje', '/listado-viaje', '/reservas-empresa'],  // Empresa
      3: ['/v-cliente', '/Reservar/:id']       // Cliente
    };

    const allowedRoutes = roleRoutes[role] || [];
    console.log('Rutas permitidas para rol', role, ':', allowedRoutes);

    // Normaliza la ruta actual a minúsculas para comparación
    const normalizedUrl = this.stripQueryParams(url.toLowerCase());
    console.log('URL normalizada:', normalizedUrl);

    const isAuthorized = allowedRoutes.some(route => this.matchRoute(route.toLowerCase(), normalizedUrl));
    console.log('Autorización final:', isAuthorized);

    return isAuthorized;
  }

  private stripQueryParams(url: string): string {
    return url.split('?')[0];
  }

  private matchRoute(route: string, url: string): boolean {
    const routeRegex = new RegExp(`^${route.replace(/:\w+/g, '\\w+').replace(/\//g, '\\/')}(/.*)?$`);
    return routeRegex.test(url);
  }
}*/

import { Injectable, NgZone } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router,private ngZone: NgZone) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //console.log('Ejecutando RoleGuard...');

    return this.userService.getCurrentUser().pipe(
      map(user => {
        //console.log('Usuario desde RoleGuard:', user);

        const currentUrl = state.url.toLowerCase();
        //console.log('Ruta actual:', currentUrl);

        if (currentUrl === '/login' ||  currentUrl === '/vista-trips' || currentUrl === '/search' || currentUrl === '/unauthorized') {
          console.log('Ruta pública. Acceso permitido.');
          return true;
        }

        if (user) {
          const isAuthorized = this.isAuthorized(user.FK_Rol, currentUrl);
          //console.log('Autorizado:', isAuthorized);
          if (isAuthorized) {
            console.log('Usuario autorizado. Acceso permitido.');
            return true;
          } else {
            console.log('No autorizado. Redirigiendo a /unauthorized...');
            this.ngZone.run(() => {
              this.router.navigate(['/unauthorized']);
            });
            return false;
          }
        } else {
          console.log('Usuario no encontrado.');
          this.ngZone.run(() => {
            this.router.navigate(['/unauthorized']);
          });
          return false;
        }
      })
    );
  }

  private isAuthorized(role: number, url: string): boolean {
    //console.log('Verificando autorización para rol:', role, 'y URL:', url);

    const roleRoutes: { [key: number]: string[] } = {
      1: ['/v-admin', '/Agregar-empresa', '/Editar-empresa/:id'],                
      2: ['/v-empresa', '/agregar-charter', '/editar-charter/:id', '/editar-viaje/:id', '/agregar-viaje', '/listado-viaje', 
        '/reservas-empresa','/agregar-parada','agregar-parada/:id'],  
      3: ['/v-cliente', '/Reservar/:id']       
    };

    const allowedRoutes = roleRoutes[role] || [];
    //console.log('Rutas permitidas para rol', role, ':', allowedRoutes);

    const normalizedUrl = this.stripQueryParams(url.toLowerCase());
    //console.log('URL normalizada:', normalizedUrl);

    const isAuthorized = allowedRoutes.some(route => this.matchRoute(route.toLowerCase(), normalizedUrl));
    //console.log('Autorización final:', isAuthorized);

    return isAuthorized;
  }

  private stripQueryParams(url: string): string {
    return url.split('?')[0];
  }

  private matchRoute(route: string, url: string): boolean {
    const routeRegex = new RegExp(`^${route.replace(/:\w+/g, '\\w+').replace(/\//g, '\\/')}(/.*)?$`);
    return routeRegex.test(url);
  }
}