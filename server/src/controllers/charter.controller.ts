import { Request, Response } from "express";
import connection from "../db/connection";

//Listar todos los charters de una empresa
export const getChartersXEmpresa = (req: Request, res: Response) => {

    const { FK_Empresa } = req.params;
    
    connection.query('SELECT marca.nombre AS marca, modelo.nombre AS modelo, charter.* FROM charter INNER JOIN modelo INNER JOIN marca ON marca.PK_Marca = modelo.FK_Marca AND modelo.PK_Modelo = charter.FK_Modelo WHERE charter.FK_Empresa = ?;', FK_Empresa, (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al listar los charters:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar los charters' });
        } else {
            if (data.length === 0) {
                return res.json('No hay charters cargados');
            } else {
                res.json(data);
            }
        }
    });
}

//Trae un charter en particular mediante una id
export const getCharters = (req: Request, res: Response) => {
    const { id } = req.params;

    connection.query('SELECT marca.nombre AS marca, modelo.nombre AS modelo, charter.* FROM charter INNER JOIN modelo INNER JOIN marca ON marca.PK_Marca = modelo.FK_Marca AND modelo.PK_Modelo = charter.FK_Modelo WHERE charter.PK_Charter = ?;', id, (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al traer el charter:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al mostrar el charter' });
        } else {
            if (data.length === 0) {
                return res.status(404).json('No se ha encontrado el charter');
            } else {
                res.json(data[0]);
            }
        }
    });
}

// Elimina un charter en particular
export const deleteCharters = (req: Request, res: Response) => {
    const { id } = req.params;

    // Primero, verificar si el charter tiene viajes asociados
    connection.query('SELECT COUNT(*) AS count FROM Viaje WHERE FK_Charter = ?', [id], (err, results) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al verificar los viajes del charter:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al verificar los viajes del charter' });
        }

        // Si hay viajes asociados, devolver un mensaje de error
        if (results[0].count > 0) {
            return res.status(400).json({ message: 'No se puede eliminar el charter porque tiene viajes asociados' });
        }

        // Si no hay viajes asociados, proceder a eliminar el charter
        connection.query('DELETE FROM Charter WHERE PK_Charter = ?', [id], (err, data) => {
            if (err) {
                // Registrar el error en la consola
                console.error('Error al eliminar el charter:', err);
                // Devolver un mensaje de error al cliente
                return res.status(500).json({ error: 'Error al eliminar el charter' });
            } else {
                if (data.affectedRows === 0) {
                    return res.status(404).json({ message: 'No se ha encontrado el charter a eliminar' });
                } else {
                    res.json('Charter eliminado correctamente');
                }
            }
        });
    });
}

//Agrega un charter
export const postCharters = (req: Request, res: Response) => {
    
    const { body } = req;

    //Chequear si la patente ya existe
    connection.query('SELECT * FROM charter WHERE patente = ?;', body.patente, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al agregar el charter:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al agregar el charter' });
        } else {
            if (data.length > 0) {
                return res.status(400).json({ message: 'La patente ya existe' });
            } else {
                //Si la patente no existe, se procede a agregar el charter
                connection.query('INSERT INTO charter SET ?;', [body], (err, data) => {
                    if(err) {
                        // Registrar el error en la consola
                        console.error('Error al agregar el charter:', err);
                        // Devolver un mensaje de error al cliente
                        return res.status(500).json({ error: 'Error al agregar el charter' });
                    } else {
                        if (data.affectedRows === 0) {
                            return res.status(404).json({ message: 'No se ha agregado el charter' });
                        } else {
                            res.json('Charter agregado correctamente');
                        }
                    }
                });
            }
        }
    });
}

//Verificar patente EL QUE HAY Q VER PORQUE SALTA 404

export const checkCharterPatente = (req: Request, res: Response) => {
    const { patente } = req.query;  // Leer la patente de los parámetros de consulta

    if (typeof patente !== 'string') {
        return res.status(400).json({ error: 'La patente debe ser una cadena de texto' });
    }

    connection.query('SELECT COUNT(*) AS count FROM charter WHERE patente = ?', [patente], (err, data) => {
        if (err) {
            console.error('Error al verificar la patente:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        const exists = data[0].count > 0;
        return res.status(200).json({ exists });
    });
};

//Modificar un charter en particular
export const putCharters = (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    // Primero, verificamos si la patente ya está en uso por otro charter
    connection.query('SELECT * FROM charter WHERE patente = ? AND PK_Charter <> ?;', [body.patente, id], (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al verificar la patente:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al verificar la patente' });
        } else {
            if (data.length > 0) {
                // La patente ya está registrada por otro charter
                return res.status(400).json({ message: 'La patente ya está registrada por otro charter' });
            } else {
                // Si la patente no está en uso, se procede a actualizar el charter
                connection.query('UPDATE charter SET ? WHERE PK_Charter = ?;', [body, id], (err, data) => {
                    if (err) {
                        // Registrar el error en la consola
                        console.error('Error al modificar el charter:', err);
                        // Devolver un mensaje de error al cliente
                        return res.status(500).json({ error: 'Error al modificar el charter' });
                    } else {
                        if (data.affectedRows === 0) {
                            // No se encontró el charter para actualizar
                            return res.status(404).json({ message: 'No se ha encontrado el charter a modificar' });
                        } else {
                            // Charter actualizado correctamente
                            res.json('Charter modificado correctamente');
                        }
                    }
                });
            }
        }
    });
};