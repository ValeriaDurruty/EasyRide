import { Request, Response } from "express";
import connection from "../db/connection";
import bcrypt from 'bcrypt';

//Trae un usuario cuando se loguea mediante su correo electrónico

export const getUsuarioPorEmail = (req: Request, res: Response) => {
    const email = req.params.email;

    connection.query('SELECT * FROM usuario WHERE email = ?;', email, (err, user) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al traer el usuario:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al traer los datos del usuario' });
        } else {
            // Adjuntar el objeto de usuario a req
            req.user = user[0];
            // Devolver los datos del usuario
            res.json(user[0]);
        }
    });
    
}


//Listar todos los usuarios

export const getUsuarios = (req: Request, res: Response) => {
    connection.query('SELECT * FROM usuario ORDER BY apellido ASC;', (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al listar los usuarios:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar los usuarios' });
        } else {
            if (data.length === 0) {
                return res.json('No hay usuarios cargados');
            } else {
                res.json(data);
            }
        }
    });
}

//Trae un usuario en particular mediante una id

export const getUsuario = (req: Request, res: Response) => {
    const { id } = req.params;

    connection.query('SELECT * FROM usuario WHERE PK_Usuario = ?;', id, (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al traer el usuario:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al mostrar el usuario' });
        } else {
            if (data.length === 0) {
                return res.status(404).json('No se ha encontrado el usuario');
            } else {
                res.json(data[0]);
            }
        }
    });
    
}

//Elimina un usuario en particular

export const deleteUsuario = (req: Request, res: Response) => {
    const { id } = req.params;

    connection.query('DELETE FROM usuario WHERE PK_Usuario = ?;', id, (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al eliminar el usuario:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
        } else {
            if (data.affectedRows === 0) {
                return res.status(404).json({ message: 'No se ha encontrado el usuario a eliminar' });
            } else {
                res.json({ message: 'Usuario eliminado correctamente' });
            }
        }
    });
}

//Agrega un usuario

export const postUsuario = (req: Request, res: Response) => {
    const { nombre, apellido, nro_documento, email, contrasenia, FK_Rol, FK_Empresa } = req.body;

    // Generar hash de la contraseña
    bcrypt.hash(contrasenia, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error al generar hash de contraseña:', err);
            return res.status(500).json({ error: 'Error interno al registrar el usuario' });
        }

        const query = `
            INSERT INTO usuario (nombre, apellido, nro_documento, email, contrasenia, FK_Rol, FK_Empresa) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        connection.query(query, [nombre, apellido, nro_documento, email, hashedPassword, FK_Rol, FK_Empresa], (err, data) => {
            if (err) {
                console.error('Error al agregar el usuario:', err);
                return res.status(500).json({ error: 'Error al agregar el usuario' });
            } else {
                res.json({ message: 'Usuario agregado correctamente' });
            }
        });
    });
};

//Modifica un usuario

export const putUsuario = (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, apellido, nro_documento, email, contrasenia, FK_Rol, FK_Empresa } = req.body;

    const query = `
        UPDATE usuario 
        SET nombre = ?, apellido = ?, nro_documento = ?, email = ?, contrasenia = ?, FK_Rol = ?, FK_Empresa = ?
        WHERE PK_Usuario = ?;
    `;

    connection.query(query, [nombre, apellido, nro_documento, email, contrasenia, FK_Rol, FK_Empresa, id], (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al modificar el usuario:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al modificar el usuario' });
        } else {
            if (data.affectedRows === 0) {
                return res.status(404).json({ message: 'No se ha modificado el usuario' });
            } else {
                res.json({ message: 'Usuario modificado correctamente' });
            }
        }
    });
};

//Valida un usuario

export const putValidarUsuario = (req: Request, res: Response) => {
    const { id } = req.params;

    const query = `
        UPDATE usuario 
        SET validar = 1
        WHERE PK_Usuario = ?;
    `;

    connection.query(query, [id], (err, data) => {
        if(err) {
            // Registrar el error en la consola
            console.error('Error al validar usuario:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al validar usuario' });
        } else {
            if (data.affectedRows === 0) {
                return res.status(404).json({ message: 'No se ha valido el usuario' });
            } else {
                res.json({ message: 'Usuario validado correctamente' });
            }
        }
    });
};