import { Parada } from "./parada.interface";

export interface ViajeParada {
    PK_Viaje_Parada?:number;
    orden:number;
    FK_Parada?: number;
    FK_Viaje: number; // Asegúrate de tener este campo para asociar con el viaje
    //LO VEMOS PORQ EN LA BASE NO ESTA
    parada?: string;
    coordenadas?: string
   
  }