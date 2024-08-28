"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCuilEmpresa = exports.putEmpresas = exports.deleteEmpresas = exports.getEmpresasXid = exports.postEmpresas = exports.getEmpresas = void 0;
const connection_1 = __importDefault(require("../db/connection"));
//Listar todas las empresas
const getEmpresas = (req, res) => {
    connection_1.default.query('SELECT * FROM empresa;', (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar las empresas:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las empresas' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay empresas cargadas');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getEmpresas = getEmpresas;
//Agrega una empresa
const postEmpresas = (req, res) => {
    const { body } = req;
    //Chequear si el CUIL ya existe
    connection_1.default.query('SELECT * FROM empresa WHERE cuil = ?;', body.cuil, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al agregar empresa:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al agregar empresa' });
        }
        else {
            if (data.length > 0) {
                return res.status(400).json({ message: 'El CUIL ya existe' });
            }
            else {
                //Si el CUIL no existe, se procede a agregar la empresa
                connection_1.default.query('INSERT INTO empresa SET ?;', [body], (err, data) => {
                    if (err) {
                        // Registrar el error en la consola
                        console.error('Error al agregar la empresa:', err);
                        // Devolver un mensaje de error al cliente
                        return res.status(500).json({ error: 'Error al agregar la empresa' });
                    }
                    else {
                        if (data.affectedRows === 0) {
                            return res.status(404).json({ message: 'No se ha agregado la empresa' });
                        }
                        else {
                            res.json('Empresa agregada correctamente');
                        }
                    }
                });
            }
        }
    });
};
exports.postEmpresas = postEmpresas;
//Trae una empresa en particular mediante una id
const getEmpresasXid = (req, res) => {
    const { id } = req.params;
    connection_1.default.query('SELECT * FROM empresa WHERE PK_Empresa = ?;', id, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al traer la empresa:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al mostrar la empresa' });
        }
        else {
            if (data.length === 0) {
                return res.status(404).json('No se ha encontrado la empresa');
            }
            else {
                res.json(data[0]);
            }
        }
    });
};
exports.getEmpresasXid = getEmpresasXid;
// Elimina una empresa en particular
const deleteEmpresas = (req, res) => {
    const { id } = req.params;
    // Primero, verificar si la empresa tiene charters cargados
    connection_1.default.query('SELECT COUNT(*) AS count FROM Charter WHERE FK_Empresa = ?', [id], (err, results) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al verificar los charters de la empresa:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al verificar los charters de la empresa' });
        }
        // Si hay charters asociados, devolver un mensaje de error
        if (results[0].count > 0) {
            return res.status(400).json({ message: 'No se puede eliminar la empresa porque tiene charters cargados' });
        }
        // Si no hay charters asociados, proceder a eliminar la empresa
        connection_1.default.query('DELETE FROM Empresa WHERE PK_Empresa = ?', [id], (err, data) => {
            if (err) {
                // Registrar el error en la consola
                console.error('Error al eliminar la empresa:', err);
                // Devolver un mensaje de error al cliente
                return res.status(500).json({ error: 'Error al eliminar la empresa' });
            }
            else {
                if (data.affectedRows === 0) {
                    return res.status(404).json({ message: 'No se ha encontrado la empresa a eliminar' });
                }
                else {
                    res.json('Empresa eliminada correctamente');
                }
            }
        });
    });
};
exports.deleteEmpresas = deleteEmpresas;
//Modificar una empresa en particular
const putEmpresas = (req, res) => {
    const { body } = req;
    const { id } = req.params;
    // Primero, verificamos si el CUIL ya está en uso por otra empresa
    connection_1.default.query('SELECT * FROM empresa WHERE cuil = ? AND PK_Empresa <> ?;', [body.cuil, id], (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al verificar el CUIL:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al verificar el CUIL' });
        }
        else {
            if (data.length > 0) {
                // El CUIL ya está registrado por otra empresa
                return res.status(400).json({ message: 'El CUIL ya está registrado por otra empresa' });
            }
            else {
                // Si el CUIL no está en uso, se procede a actualizar la empresa
                connection_1.default.query('UPDATE empresa SET ? WHERE PK_Empresa = ?;', [body, id], (err, data) => {
                    if (err) {
                        // Registrar el error en la consola
                        console.error('Error al modificar la empresa:', err);
                        // Devolver un mensaje de error al cliente
                        return res.status(500).json({ error: 'Error al modificar la empresa' });
                    }
                    else {
                        if (data.affectedRows === 0) {
                            // No se encontró la empresa para actualizar
                            return res.status(404).json({ message: 'No se ha encontrado la empresa a modificar' });
                        }
                        else {
                            // Empresa actualizada correctamente
                            res.json('Empresa modificada correctamente');
                        }
                    }
                });
            }
        }
    });
};
exports.putEmpresas = putEmpresas;
//Chequear si el CUIL ya existe
const checkCuilEmpresa = (req, res) => {
    const cuil = parseInt(req.params.cuil, 10); // Leer el CUIL de los parámetros de consulta
    console.log('CUIL:', cuil);
    if (typeof cuil !== 'number') {
        return res.status(400).json({ error: 'El CUIL debe ser un número' });
    }
    connection_1.default.query('SELECT COUNT(*) AS count FROM empresa WHERE cuil = ?', [cuil], (err, data) => {
        if (err) {
            console.error('Error al verificar el CUIL:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        const exists = data[0].count > 0;
        return res.status(200).json({ exists });
    });
};
exports.checkCuilEmpresa = checkCuilEmpresa;
