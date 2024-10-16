"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putValidarUsuario = exports.putUsuario = exports.postUsuario = exports.deleteUsuario = exports.getUsuario = exports.getUsuarios = exports.getUsuarioPorEmail = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//Trae un usuario cuando se loguea mediante su correo electrónico
const getUsuarioPorEmail = (req, res) => {
    const email = req.params.email;
    connection_1.default.query('SELECT * FROM usuario WHERE email = ?;', email, (err, user) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al traer el usuario:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al traer los datos del usuario' });
        }
        else {
            // Adjuntar el objeto de usuario a req
            req.user = user[0];
            // Devolver los datos del usuario
            res.json(user[0]);
        }
    });
};
exports.getUsuarioPorEmail = getUsuarioPorEmail;
//Listar todos los usuarios
const getUsuarios = (req, res) => {
    connection_1.default.query('SELECT * FROM usuario ORDER BY apellido ASC;', (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar los usuarios:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar los usuarios' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay usuarios cargados');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getUsuarios = getUsuarios;
//Trae un usuario en particular mediante una id
const getUsuario = (req, res) => {
    const { id } = req.params;
    connection_1.default.query('SELECT * FROM usuario WHERE PK_Usuario = ?;', id, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al traer el usuario:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al mostrar el usuario' });
        }
        else {
            if (data.length === 0) {
                return res.status(404).json('No se ha encontrado el usuario');
            }
            else {
                res.json(data[0]);
            }
        }
    });
};
exports.getUsuario = getUsuario;
//Elimina un usuario en particular
const deleteUsuario = (req, res) => {
    const { id } = req.params;
    connection_1.default.query('DELETE FROM usuario WHERE PK_Usuario = ?;', id, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al eliminar el usuario:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
        else {
            if (data.affectedRows === 0) {
                return res.status(404).json({ message: 'No se ha encontrado el usuario a eliminar' });
            }
            else {
                res.json({ message: 'Usuario eliminado correctamente' });
            }
        }
    });
};
exports.deleteUsuario = deleteUsuario;
//Agrega un usuario
const postUsuario = (req, res) => {
    const { nombre, apellido, nro_documento, email, contrasenia, FK_Rol, FK_Empresa } = req.body;
    // Generar hash de la contraseña
    bcrypt_1.default.hash(contrasenia, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error al generar hash de contraseña:', err);
            return res.status(500).json({ error: 'Error interno al registrar el usuario' });
        }
        const query = `
            INSERT INTO usuario (nombre, apellido, nro_documento, email, contrasenia, FK_Rol, FK_Empresa) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        connection_1.default.query(query, [nombre, apellido, nro_documento, email, hashedPassword, FK_Rol, FK_Empresa], (err, data) => {
            if (err) {
                console.error('Error al agregar el usuario:', err);
                return res.status(500).json({ error: 'Error al agregar el usuario' });
            }
            else {
                res.json({ message: 'Usuario agregado correctamente' });
            }
        });
    });
};
exports.postUsuario = postUsuario;
//Modifica un usuario
const putUsuario = (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, nro_documento, email, contrasenia, FK_Rol, FK_Empresa } = req.body;
    const query = `
        UPDATE usuario 
        SET nombre = ?, apellido = ?, nro_documento = ?, email = ?, contrasenia = ?, FK_Rol = ?, FK_Empresa = ?
        WHERE PK_Usuario = ?;
    `;
    connection_1.default.query(query, [nombre, apellido, nro_documento, email, contrasenia, FK_Rol, FK_Empresa, id], (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al modificar el usuario:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al modificar el usuario' });
        }
        else {
            if (data.affectedRows === 0) {
                return res.status(404).json({ message: 'No se ha modificado el usuario' });
            }
            else {
                res.json({ message: 'Usuario modificado correctamente' });
            }
        }
    });
};
exports.putUsuario = putUsuario;
//Valida un usuario
const putValidarUsuario = (req, res) => {
    const { id } = req.params;
    const query = `
        UPDATE usuario 
        SET validar = 1
        WHERE PK_Usuario = ?;
    `;
    connection_1.default.query(query, [id], (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al validar usuario:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al validar usuario' });
        }
        else {
            if (data.affectedRows === 0) {
                return res.status(404).json({ message: 'No se ha valido el usuario' });
            }
            else {
                res.json({ message: 'Usuario validado correctamente' });
            }
        }
    });
};
exports.putValidarUsuario = putValidarUsuario;
