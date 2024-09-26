import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, of, throwError } from "rxjs";
import { Provincia } from "../interfaces/provincia.interface";
import { Localidad } from "../interfaces/localidad.interface";


@Injectable({
  providedIn: "root"
})
export class LocalidadService {
    private myAppUrl: string;
    private myApiUrl: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endopoint;
        this.myApiUrl = 'api/localidades/';
    }
    getLocalidades(): Observable<Localidad[]> {
        return this.http.get<Localidad[]>(`${this.myAppUrl}${this.myApiUrl}`).pipe(
          catchError(this.handleError)
        );
    }

    getLocalidadesPorProvincia(provinciaId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.myAppUrl}${this.myApiUrl}prov/${provinciaId}`);
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
