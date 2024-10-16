import { Request, Response } from "express";
import connection from "../db/connection";


//Listar todos las localidades
export const getLocalidades = (req: Request, res: Response) => {
    
    connection.query('SELECT * FROM localidad ORDER BY nombre ASC;', (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al listar las localidades:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las localidades' });
        } else {
            if (data.length === 0) {
                return res.json('No hay localidades cargadas');
            } else {
                res.json(data);
            }
        }
    });
}

//Listar todos los modelos de una marca
export const getLocalidadesXProvincia = (req: Request, res: Response) => {

    const { FK_Provincia } = req.params;
    
    connection.query('SELECT * FROM localidad WHERE localidad.FK_Provincia = ? ORDER BY nombre ASC;', FK_Provincia, (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al listar las localidades:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las localidades' });
        } else {
            if (data.length === 0) {
                return res.json('No hay localidades cargadas');
            } else {
                res.json(data);
            }
        }
    });
}