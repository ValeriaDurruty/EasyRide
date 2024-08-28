import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Charter} from '../interfaces/charter.interface';


@Injectable({
  providedIn: "root"
})
export class CharterService {
    private myAppUrl: string;
    private myApiUrl: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endopoint;
        this.myApiUrl = 'api/charters/';
    }

    getChartersXEmpresa(fkEmpresa: number): Observable<Charter[]> {
      return this.http.get<Charter[]>(`${this.myAppUrl}${this.myApiUrl}empresa/${fkEmpresa}`);
    }

    getCharter(id: number) : Observable <Charter[]> {
      return this.http.get<Charter[]>(this.myAppUrl + this.myApiUrl + id);
    }

    deleteCharter(id: number): Observable<void> {
      return this.http.delete<void>(this.myAppUrl + this.myApiUrl + id);
    }

    addCharter(charter: Charter): Observable<void> {
      return this.http.post<void>(this.myAppUrl + this.myApiUrl, charter);
    }

    editCharter(id: number, charter: Charter): Observable<void> {
      return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, charter);
    }

    checkPatente(patente: string): Observable<{ exists: boolean }> {
      const url = `${this.myAppUrl}${this.myApiUrl}checkpatente?patente=${encodeURIComponent(patente)}`;
      return this.http.get<{ exists: boolean }>(url);
    }

}
