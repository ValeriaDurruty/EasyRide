import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) { }

  getCoordinates(address: string, provincia: string, localidad: string): Observable<any[]> {
    const country = 'Argentina'; 
    const fullAddress = `${encodeURIComponent(address)}, ${encodeURIComponent(localidad)}, ${encodeURIComponent(provincia)}, ${country}`;
    const url = `${this.nominatimUrl}?q=${fullAddress}&format=json`;
    
    // Aquí agregamos el console.log para ver qué dirección se envía
    console.log('URL enviada a Nominatim:', url);

    return this.http.get<any[]>(url);
}


  getAddressFromCoordinates(lat: number, lon: number): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    return this.http.get<any>(url);
  }
  
}
