import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { Provincia } from "../interfaces/provincia.interface";


@Injectable({
  providedIn: "root"
})
export class ProvinciaService {
    private myAppUrl: string;
    private myApiUrl: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endopoint;
        this.myApiUrl = 'api/provincias/';
    }
    getProvincias(): Observable<Provincia[]> {
        return this.http.get<Provincia[]>(`${this.myAppUrl}${this.myApiUrl}`).pipe(
          catchError(this.handleError)
        );
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