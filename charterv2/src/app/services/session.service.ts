import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionClosedSource = new Subject<void>();

  // Observable que los componentes pueden observar
  sessionClosed$ = this.sessionClosedSource.asObservable();

  private previousUrl: string | undefined;
  private currentUrl: string | undefined;
  private lastValidUrl: string | undefined; // Agregar esta variable

  constructor(private _router: Router) {
    // Escuchar los eventos de navegación y guardar las URLs
    this._router.events
    .pipe(
      filter(event => event instanceof NavigationEnd), // Filtra eventos de tipo NavigationEnd
      pairwise() // Captura los dos últimos eventos de navegación
    )
    .subscribe((events: any[]) => {
      this.previousUrl = events[0].url; // URL anterior
      this.currentUrl = events[1].url; // URL actual
  
      // Asegúrate de que previousUrl no sea undefined
      if (this.previousUrl && !this.previousUrl.startsWith('/LogIn')) {
        this.lastValidUrl = this.previousUrl; // Guardar solo si no es LogIn
      }
    });
  }

  // Método para obtener la URL anterior
  getPreviousUrl(): string | undefined {
    return this.previousUrl;
  }

  // Método para obtener la última URL válida
  getLastValidUrl(): string | undefined {
    return this.lastValidUrl;
  }

  // Método para emitir el evento de cierre de sesión
  notifySessionClosed() {
    this.sessionClosedSource.next();
  }
}
