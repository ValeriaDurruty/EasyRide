import { Request, Response } from "express";
import connection from "../db/connection";


//Listar todos las marcas
export const geParadas = (req: Request, res: Response) => {
    
    connection.query('SELECT p.PK_Parada, p.nombre AS parada, p.coordenadas, l.PK_Localidad, l.nombre AS localidad, pr.PK_Provincia, pr.nombre AS provincia FROM Parada p INNER JOIN Localidad l ON p.FK_Localidad = l.PK_Localidad INNER JOIN Provincia pr ON l.FK_Provincia = pr.PK_Provincia;', (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al listar las paradas:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las paradas' });
        } else {
            if (data.length === 0) {
                return res.json('No hay paradas cargadas');
            } else {
                res.json(data);
            }
        }
    });
}