import { Request, Response } from "express";
import connection from "../db/connection";


//Listar todos las marcas
export const getMarcas = (req: Request, res: Response) => {
    
    connection.query('SELECT * FROM marca ORDER BY nombre ASC;', (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al listar las marcas:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las marcas' });
        } else {
            if (data.length === 0) {
                return res.json('No hay marcas cargadas');
            } else {
                res.json(data);
            }
        }
    });
}