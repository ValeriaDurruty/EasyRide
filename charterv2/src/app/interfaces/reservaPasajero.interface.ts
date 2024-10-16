import { ViajeParada } from "./viaje.parada";
import { Time } from "@angular/common";

export interface ReservaPasajero {
  //Sacarle los ? a los q agregue era para ver si andaba con esta interfaz
    PK_Reserva?: number;
    fecha_creacion?: Date;
    estado_reserva?: string;
    horario_salida?: Time;
    horario_llegada?: Time;
    precio?: number;
    fecha_salida?: Date;
    fecha_llegada?: Date;
    patente?: string;
    modelo?: string;
    marca?: string;
    PK_Empresa?: number;
    empresa?: string;
    paradas?: ViajeParada[];
  };