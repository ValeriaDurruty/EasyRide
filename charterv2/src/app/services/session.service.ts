import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionClosedSource = new Subject<void>();

  // Observable que los componentes pueden observar
  sessionClosed$ = this.sessionClosedSource.asObservable();

  // Método para emitir el evento de cierre de sesión
  notifySessionClosed() {
    this.sessionClosedSource.next();
  }
}
