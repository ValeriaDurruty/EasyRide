export interface Usuario {
    PK_Usuario: number;
    nombre: string;
    apellido: string;
    nro_documento: number;
    email: string;
    contrasenia: string;
    FK_Rol: number;
    validar: number;
    FK_Empresa: number;
    nombreEmpresa?: string
};