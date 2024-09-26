import { Request, Response } from "express";
import connection from "../db/connection";


//Listar todas las empresas
export const getEmpresas = (req: Request, res: Response) => {

    connection.query('SELECT * FROM empresa;', (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al listar las empresas:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las empresas' });
        } else {
            if (data.length === 0) {
                return res.json('No hay empresas cargadas');
            } else {
                res.json(data);
            }
        }
    });
}


//Agrega una empresa
export const postEmpresas = (req: Request, res: Response) => {

    const { body } = req;

    //Chequear si el CUIT ya existe
    connection.query('SELECT * FROM empresa WHERE cuit = ?;', body.cuit, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al agregar empresa:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al agregar empresa' });
        } else {
            if (data.length > 0) {
                return res.status(400).json({ message: 'El CUIT ya existe' });
            } else {
                //Si el CUIT no existe, se procede a agregar la empresa
                connection.query('INSERT INTO empresa SET ?;', [body], (err, data) => {
                    if(err) {
                        // Registrar el error en la consola
                        console.error('Error al agregar la empresa:', err);
                        // Devolver un mensaje de error al cliente
                        return res.status(500).json({ error: 'Error al agregar la empresa' });
                    } else {
                        if (data.affectedRows === 0) {
                            return res.status(404).json({ message: 'No se ha agregado la empresa' });
                        } else {
                            res.json('Empresa agregada correctamente');
                        }
                    }
                });
            }
        }
    });
}


//Trae una empresa en particular mediante una id
export const getEmpresasXid = (req: Request, res: Response) => {
    const { id } = req.params;

    connection.query('SELECT * FROM empresa WHERE PK_Empresa = ?;', id, (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al traer la empresa:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al mostrar la empresa' });
        } else {
            if (data.length === 0) {
                return res.status(404).json('No se ha encontrado la empresa');
            } else {
                res.json(data[0]);
            }
        }
    });
}


// Elimina una empresa en particular
export const deleteEmpresas = (req: Request, res: Response) => {
    const { id } = req.params;

    // Verificar si la empresa tiene charters cargados
    connection.query('SELECT COUNT(*) AS count FROM Charter WHERE FK_Empresa = ?', [id], (err, results) => {
        if (err) {
            console.error('Error al verificar los charters de la empresa:', err);
            return res.status(500).json({ error: 'Error al verificar los charters de la empresa' });
        }

        if (results[0].count > 0) {
            return res.status(400).json({ message: 'No se puede eliminar la empresa porque tiene charters asociados' });
        }

        // Verificar si la empresa tiene usuarios asociados
        connection.query('SELECT COUNT(*) AS count FROM Usuario WHERE FK_Empresa = ?', [id], (err, userResults) => {
            if (err) {
                console.error('Error al verificar los empleados de la empresa:', err);
                return res.status(500).json({ error: 'Error al verificar los empleados de la empresa' });
            }

            if (userResults[0].count > 0) {
                return res.status(400).json({ message: 'No se puede eliminar la empresa porque tiene empleados asociados' });
            }

            // Verificar si la empresa tiene paradas asociadas
            connection.query('SELECT COUNT(*) AS count FROM Parada WHERE FK_Empresa = ?', [id], (err, paradaResults) => {
                if (err) {
                    console.error('Error al verificar las paradas de la empresa:', err);
                    return res.status(500).json({ error: 'Error al verificar las paradas de la empresa' });
                }

                if (paradaResults[0].count > 0) {
                    return res.status(400).json({ message: 'No se puede eliminar la empresa porque tiene paradas asociadas' });
                }

                // Si no hay charters, usuarios ni paradas asociados, proceder a eliminar la empresa
                connection.query('DELETE FROM Empresa WHERE PK_Empresa = ?', [id], (err, data) => {
                    if (err) {
                        console.error('Error al eliminar la empresa:', err);
                        return res.status(500).json({ error: 'Error al eliminar la empresa' });
                    } else {
                        if (data.affectedRows === 0) {
                            return res.status(404).json({ message: 'No se ha encontrado la empresa a eliminar' });
                        } else {
                            res.json('Empresa eliminada correctamente');
                        }
                    }
                });
            });
        });
    });
};


//Modificar una empresa en particular
export const putEmpresas = (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    // Primero, verificamos si el CUIT ya está en uso por otra empresa
    connection.query('SELECT * FROM empresa WHERE cuit = ? AND PK_Empresa <> ?;', [body.cuit, id], (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al verificar el CUIT', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al verificar el CUIT' });
        } else {
            if (data.length > 0) {
                // El CUI ya está registrado por otra empresa
                return res.status(400).json({ message: 'El CUIT ya está registrado por otra empresa' });
            } else {
                // Si el CUIT no está en uso, se procede a actualizar la empresa
                connection.query('UPDATE empresa SET ? WHERE PK_Empresa = ?;', [body, id], (err, data) => {
                    if (err) {
                        // Registrar el error en la consola
                        console.error('Error al modificar la empresa:', err);
                        // Devolver un mensaje de error al cliente
                        return res.status(500).json({ error: 'Error al modificar la empresa' });
                    } else {
                        if (data.affectedRows === 0) {
                            // No se encontró la empresa para actualizar
                            return res.status(404).json({ message: 'No se ha encontrado la empresa a modificar' });
                        } else {
                            // Empresa actualizada correctamente
                            res.json('Empresa modificada correctamente');
                        }
                    }
                });
            }
        }
    });
}


//Chequear si el CUIT ya existe
export const checkCuitEmpresa = (req: Request, res: Response) => {
    const cuit = parseInt(req.params.cuit as string, 10);  // Leer el CUIT de los parámetros de consulta
     console.log('CUIT:', cuit);
 
     if (typeof cuit !== 'number') {
         return res.status(400).json({ error: 'El CUIT debe ser un número' });
     }
 
     connection.query('SELECT COUNT(*) AS count FROM empresa WHERE cuit = ?', [cuit], (err, data) => {
         if (err) {
             console.error('Error al verificar el CUIT:', err);
             return res.status(500).json({ error: 'Error interno del servidor' });
         }
 
         const exists = data[0].count > 0;
         return res.status(200).json({ exists });
     });
 };