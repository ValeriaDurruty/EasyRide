
export interface Parada {
    PK_Parada?: number;
    parada?: string;
    nombre?:string;
    coordenadas: string;
    PK_Localidad?: number;
    FK_Empresa?:number;
    localidad?: string;
    provincia?:string;
    PK_Provincia?:number;
    FK_Localidad: number;
  };

  //LOS PK DE MAS SE TIENEN Q IR!!