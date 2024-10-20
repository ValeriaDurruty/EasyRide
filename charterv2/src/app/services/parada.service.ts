import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { Parada } from '../interfaces/parada.interface';


@Injectable({
  providedIn: "root"
})
export class ParadaService {
    private myAppUrl: string;
    private myApiUrl: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endopoint;
        this.myApiUrl = 'api/paradas/';
    }

    getParadas(): Observable<Parada[]> {
      return this.http.get<Parada[]>(`${this.myAppUrl}${this.myApiUrl}`).pipe(
        catchError(this.handleError)
      );
    }
    
    getParadaById(paradaId: number): Observable<Parada> {
      return this.http.get<Parada>(`${this.myAppUrl}${this.myApiUrl}${paradaId}`);
    }

    AddParada(parada: Parada): Observable<void> {
      console.log('Objeto Parada en servicio:', parada);
      return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`,parada).pipe(
        catchError(this.handleError)
      );
    }
    actualizarParadasViaje(viajeId: number, paradas: Parada[]): Observable<any> {
      return this.http.post(`${this.myAppUrl}api/viajes/${viajeId}/paradas`, { paradas }).pipe(
        catchError(this.handleError)
      );
    }

    getParadasXEmpresa(fk_empresa: number): Observable<Parada[]> {
      return this.http.get<Parada[]>(`${this.myAppUrl}${this.myApiUrl}/empresa/${fk_empresa}`);
    }

    getParadasxLocalidad(fk_localidad: number): Observable<Parada[]> {
      return this.http.get<Parada[]>(`${this.myAppUrl}${this.myApiUrl}/localidad/${fk_localidad}`);
    }
    
    eliminarParadaViaje(viajeId: number, paradaId: number): Observable<any> {
      return this.http.delete(`${this.myAppUrl}api/viajes/${viajeId}/paradas/${paradaId}`).pipe(
        catchError(this.handleError)
      );
    }

    updateParada(paradaId: number, parada: Parada): Observable<Parada> {
      return this.http.put<Parada>(`${this.myAppUrl}${this.myApiUrl}${paradaId}`, parada);
    }

    deleteParada(id: number): Observable<void> {
      return this.http.delete<void>(this.myAppUrl + this.myApiUrl + id);
    }

    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'Unknown error!';
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      console.error(errorMessage);
      return throwError(errorMessage);
    }
}