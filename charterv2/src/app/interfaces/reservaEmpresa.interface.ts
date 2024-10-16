import { Time } from "@angular/common";
import { ViajeParada } from "./viaje.parada";
import { Parada } from "./parada.interface";
import { Reserva } from "./reserva.interface";

export interface ReservaEmpresa {
    PK_Viaje?: number;
    fecha_salida: Date;
    fecha_llegada: Date;
    horario_salida: Time;
    horario_llegada: Time;
    precio: number;
    patente:string;
    modelo: string;
    marca: string;
    paradas?: ViajeParada[];
    reservas?: Reserva[];
  };