"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putViajes = exports.addViaje = exports.deleteViajes = exports.getViajesXid = exports.getBusquedaViajes = exports.getViajes = exports.getViajesXEmpresa = void 0;
const connection_1 = __importDefault(require("../db/connection"));
//Listar todos los viajes de una empresa
const getViajesXEmpresa = (req, res) => {
    const { FK_Empresa } = req.params;
    const query = `SELECT
    v.PK_Viaje,
    DATE_FORMAT(v.horario_salida, '%H:%i') AS horario_salida, 
    DATE_FORMAT(v.horario_llegada, '%H:%i') AS horario_llegada, 
    v.cupo,
    v.precio,
    DATE_FORMAT(v.fecha, '%d-%m-%Y') AS fecha,
    c.patente,
    GROUP_CONCAT(
        CONCAT(
            'PK_Viaje_parada: ', vp.PK_Viaje_Parada,
            ', PK_Parada: ', p.PK_Parada,
            ', Orden: ', vp.orden, 
            ', Parada: ', p.nombre, 
            ', Localidad: ', l.nombre, 
            ', Provincia: ', pr.nombre
        )
        ORDER BY vp.orden
        SEPARATOR '; '
    ) AS paradas
FROM viaje v
INNER JOIN charter c ON v.FK_Charter = c.PK_Charter
INNER JOIN viaje_Parada vp ON v.PK_Viaje = vp.FK_Viaje
INNER JOIN parada p ON vp.FK_Parada = p.PK_Parada
INNER JOIN localidad l ON p.FK_Localidad = l.PK_Localidad
INNER JOIN provincia pr ON l.FK_Provincia = pr.PK_Provincia
WHERE c.FK_Empresa = ?
GROUP BY v.PK_Viaje, v.horario_salida, v.horario_llegada, v.cupo, v.precio, v.fecha, c.patente
ORDER BY v.PK_Viaje ASC;`;
    connection_1.default.query(query, FK_Empresa, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar los viajes:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar los viajes' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay viajes cargados');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getViajesXEmpresa = getViajesXEmpresa;
//Listar todos los viajes
const getViajes = (req, res) => {
    const query = `SELECT
                    v.PK_Viaje,
                    DATE_FORMAT(v.horario_salida, '%H:%i') AS horario_salida, 
                    DATE_FORMAT(v.horario_llegada, '%H:%i') AS horario_llegada, 
                    v.cupo,
                    v.precio,
                    DATE_FORMAT(v.fecha, '%d-%m-%Y') AS fecha,
                    c.patente,
                    e.razon_social AS empresa,
                    GROUP_CONCAT(
                        CONCAT(
                            'PK_Viaje_parada: ', vp.PK_Viaje_Parada,
                            ', PK_Parada: ', p.PK_Parada,
                            ', Orden: ', vp.orden, 
                            ', Parada: ', p.nombre, 
                            ', Localidad: ', l.nombre, 
                            ', Provincia: ', pr.nombre
                        )
                        ORDER BY vp.orden
                        SEPARATOR '; '
                    ) AS paradas
                FROM viaje v
                INNER JOIN charter c ON v.FK_Charter = c.PK_Charter
                INNER JOIN empresa e ON c.FK_Empresa = e.PK_Empresa
                INNER JOIN viaje_Parada vp ON v.PK_Viaje = vp.FK_Viaje
                INNER JOIN parada p ON vp.FK_Parada = p.PK_Parada
                INNER JOIN localidad l ON p.FK_Localidad = l.PK_Localidad
                INNER JOIN provincia pr ON l.FK_Provincia = pr.PK_Provincia
                WHERE v.fecha >= CURDATE() AND v.cupo > 0
                GROUP BY v.PK_Viaje, v.horario_salida, v.horario_llegada, v.cupo, v.precio, v.fecha, c.patente
                ORDER BY v.PK_Viaje ASC;`;
    connection_1.default.query(query, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar los viajes:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar los viajes' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay viajes cargados');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getViajes = getViajes;
//Lista de búsqueda de viajes
const getBusquedaViajes = (req, res) => {
    const { body } = req;
    const query = `
                SELECT 
                v.PK_Viaje, 
                DATE_FORMAT(v.horario_salida, '%H:%i') AS horario_salida, 
                DATE_FORMAT(v.horario_llegada, '%H:%i') AS horario_llegada, 
                v.cupo, 
                v.precio, 
                DATE_FORMAT(v.fecha, '%d-%m-%Y') AS fecha, 
                c.patente, 
                c.FK_Empresa, 
                e.razon_social AS empresa, 
                m.nombre AS modelo, 
                ma.nombre AS marca, 
                GROUP_CONCAT(
                    CONCAT(
                        'PK_Viaje_parada: ', vp.PK_Viaje_Parada, 
                        ', PK_Parada: ', p.PK_Parada, 
                        ', Orden: ', vp.orden, 
                        ', Parada: ', p.nombre, 
                        ', Localidad: ', l.nombre, 
                        ', Provincia: ', pr.nombre 
                    ) 
                    ORDER BY vp.orden SEPARATOR '; ' 
                ) AS paradas 
            FROM 
                Viaje v 
            INNER JOIN 
                Charter c ON v.FK_Charter = c.PK_Charter 
            INNER JOIN 
                Empresa e ON c.FK_Empresa = e.PK_Empresa 
            INNER JOIN 
                Modelo m ON c.FK_Modelo = m.PK_Modelo 
            INNER JOIN 
                Marca ma ON m.FK_Marca = ma.PK_Marca 
            INNER JOIN 
                Viaje_Parada vp ON v.PK_Viaje = vp.FK_Viaje 
            INNER JOIN 
                Parada p ON vp.FK_Parada = p.PK_Parada 
            INNER JOIN 
                Localidad l ON p.FK_Localidad = l.PK_Localidad 
            INNER JOIN 
                Provincia pr ON l.FK_Provincia = pr.PK_Provincia 
            WHERE 
                v.fecha = ? 
                AND EXISTS (
                    SELECT 1 
                    FROM Viaje_Parada vp_origen 
                    INNER JOIN Parada p_origen ON vp_origen.FK_Parada = p_origen.PK_Parada 
                    WHERE vp_origen.FK_Viaje = v.PK_Viaje 
                    AND vp_origen.orden = 1 
                    AND p_origen.PK_Parada = ?
                ) 
                AND EXISTS (
                    SELECT 1 
                    FROM Viaje_Parada vp_destino 
                    INNER JOIN Parada p_destino ON vp_destino.FK_Parada = p_destino.PK_Parada 
                    WHERE vp_destino.FK_Viaje = v.PK_Viaje 
                    AND vp_destino.orden = (
                        SELECT MAX(orden) 
                        FROM Viaje_Parada 
                        WHERE FK_Viaje = v.PK_Viaje
                    ) 
                    AND p_destino.PK_Parada = ?
                ) 
            GROUP BY 
                v.PK_Viaje, 
                v.horario_salida, 
                v.horario_llegada, 
                v.cupo, 
                v.precio, 
                v.fecha, 
                c.patente, 
                c.FK_Empresa, 
                e.razon_social, 
                m.nombre, 
                ma.nombre 
            ORDER BY 
                v.PK_Viaje, 
                vp.orden;`;
    connection_1.default.query(query, [body.fecha, body.origen, body.destino], (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al realizar la búsqueda:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al realizar la búsqueda' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay viajes cargados');
            }
            else {
                res.json(data);
                console.log(data);
            }
        }
    });
};
exports.getBusquedaViajes = getBusquedaViajes;
//Trae un viaje en particular mediante una id
const getViajesXid = (req, res) => {
    const { id } = req.params;
    const query = `SELECT 
                v.PK_Viaje, 
                DATE_FORMAT(v.horario_salida, '%H:%i') AS horario_salida, 
                DATE_FORMAT(v.horario_llegada, '%H:%i') AS horario_llegada, 
                v.cupo, 
                v.precio, 
                DATE_FORMAT(v.fecha, '%d-%m-%Y') AS fecha, 
                c.patente, 
                c.FK_Empresa, 
                e.razon_social AS empresa, 
                m.nombre AS modelo, 
                ma.nombre AS marca, 
                GROUP_CONCAT(
                    CONCAT(
                        'PK_Viaje_parada: ', vp.PK_Viaje_Parada, 
                        ', PK_Parada: ', p.PK_Parada, 
                        ', Orden: ', vp.orden, 
                        ', Parada: ', p.nombre, 
                        ', Localidad: ', l.nombre, 
                        ', Provincia: ', pr.nombre 
                    ) 
                    ORDER BY vp.orden SEPARATOR '; ' 
                ) AS paradas 
            FROM 
                Viaje v 
            INNER JOIN 
                Charter c ON v.FK_Charter = c.PK_Charter 
            INNER JOIN 
                Empresa e ON c.FK_Empresa = e.PK_Empresa 
            INNER JOIN 
                Modelo m ON c.FK_Modelo = m.PK_Modelo 
            INNER JOIN 
                Marca ma ON m.FK_Marca = ma.PK_Marca 
            INNER JOIN 
                Viaje_Parada vp ON v.PK_Viaje = vp.FK_Viaje 
            INNER JOIN 
                Parada p ON vp.FK_Parada = p.PK_Parada 
            INNER JOIN 
                Localidad l ON p.FK_Localidad = l.PK_Localidad 
            INNER JOIN 
                Provincia pr ON l.FK_Provincia = pr.PK_Provincia 
            WHERE 
                v.PK_Viaje = ? 
            GROUP BY 
                v.PK_Viaje, 
                v.horario_salida, 
                v.horario_llegada, 
                v.cupo, 
                v.precio, 
                v.fecha, 
                c.patente, 
                c.FK_Empresa, 
                e.razon_social, 
                m.nombre, 
                ma.nombre 
            ORDER BY 
                v.PK_Viaje, 
                vp.orden;`;
    connection_1.default.query(query, id, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al traer el viaje:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al mostrar el viaje' });
        }
        else {
            if (data.length === 0) {
                return res.json('No se ha encontrado el viaje');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getViajesXid = getViajesXid;
// Elimina un viaje en particular
const deleteViajes = (req, res) => {
    const { id } = req.params;
    // Inicia la transacción
    connection_1.default.beginTransaction((err) => {
        if (err) {
            // Manejo de errores al iniciar la transacción
            console.error('Error al iniciar la transacción:', err);
            return res.status(500).json({ error: 'Error al iniciar la transacción' });
        }
        // Paso 1: Verificar si el viaje tiene reservas asociadas
        connection_1.default.query('SELECT COUNT(*) AS count FROM reserva WHERE FK_Viaje = ?', [id], (err, results) => {
            if (err) {
                // Rollback en caso de error
                return connection_1.default.rollback(() => {
                    console.error('Error al verificar reservas del viaje:', err);
                    return res.status(500).json({ error: 'Error al verificar reservas del viaje' });
                });
            }
            if (results[0].count > 0) {
                // Si hay reservas asociadas, rollback y respuesta de error
                return connection_1.default.rollback(() => {
                    console.error('No se puede eliminar el viaje porque tiene reservas asociadas.');
                    return res.status(400).json({ error: 'No se puede eliminar el viaje porque tiene reservas asociadas' });
                });
            }
            // Paso 2: Eliminar entradas en Viaje_Parada
            connection_1.default.query('DELETE FROM Viaje_Parada WHERE FK_Viaje = ?', [id], (err) => {
                if (err) {
                    // Rollback en caso de error
                    return connection_1.default.rollback(() => {
                        console.error('Error al eliminar entradas de Viaje_Parada:', err);
                        return res.status(500).json({ error: 'Error al eliminar entradas de Viaje_Parada' });
                    });
                }
                // Paso 3: Eliminar el viaje
                connection_1.default.query('DELETE FROM Viaje WHERE PK_Viaje = ?', [id], (err) => {
                    if (err) {
                        // Rollback en caso de error
                        return connection_1.default.rollback(() => {
                            console.error('Error al eliminar el viaje:', err);
                            return res.status(500).json({ error: 'Error al eliminar el viaje' });
                        });
                    }
                    // Confirmar la transacción
                    connection_1.default.commit((err) => {
                        if (err) {
                            // Rollback en caso de error durante el commit
                            return connection_1.default.rollback(() => {
                                console.error('Error al confirmar la transacción:', err);
                                return res.status(500).json({ error: 'Error al confirmar la transacción' });
                            });
                        }
                        // Enviar respuesta de éxito
                        res.json({ message: 'Viaje eliminado correctamente' });
                    });
                });
            });
        });
    });
};
exports.deleteViajes = deleteViajes;
//Agrega un viaje
const addViaje = (req, res) => {
    const { horario_salida, horario_llegada, precio, fecha, FK_Charter, paradas } = req.body;
    //console.log(req.body);
    // Verifica que al menos se proporcionen dos paradas
    if (!Array.isArray(paradas) || paradas.length < 2) {
        return res.status(400).json({ error: 'Se deben proporcionar al menos dos paradas.' });
    }
    // Inicia la transacción
    connection_1.default.beginTransaction((err) => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            return res.status(500).json({ error: 'Error al iniciar la transacción' });
        }
        // Inserta el viaje
        connection_1.default.query(`INSERT INTO viaje (horario_salida, horario_llegada, precio, fecha, FK_Charter) VALUES (?, ?, ?, ?, ?)`, [horario_salida, horario_llegada, precio, fecha, FK_Charter], (err, result) => {
            if (err) {
                // Rollback en caso de error
                return connection_1.default.rollback(() => {
                    console.error('Error al agregar el viaje:', err);
                    return res.status(500).json({ error: 'Error al agregar el viaje' });
                });
            }
            // Obtener el ID del viaje insertado
            const PK_Viaje = result.insertId;
            // Insertar las paradas del viaje
            const values = paradas.map((parada, index) => [index + 1, parada.FK_Parada, PK_Viaje]);
            connection_1.default.query('INSERT INTO viaje_Parada (orden, FK_Parada, FK_Viaje) VALUES ?', [values], (err) => {
                if (err) {
                    // Rollback en caso de error
                    return connection_1.default.rollback(() => {
                        console.error('Error al agregar las paradas del viaje:', err);
                        return res.status(500).json({ error: 'Error al agregar las paradas del viaje' });
                    });
                }
                // Confirmar la transacción
                connection_1.default.commit((err) => {
                    if (err) {
                        // Rollback en caso de error durante el commit
                        return connection_1.default.rollback(() => {
                            console.error('Error al confirmar la transacción:', err);
                            return res.status(500).json({ error: 'Error al confirmar la transacción' });
                        });
                    }
                    // Enviar respuesta de éxito
                    res.json({ message: 'Viaje agregado correctamente' });
                });
            });
        });
    });
};
exports.addViaje = addViaje;
//Modificar un viaje en particular
const putViajes = (req, res) => {
    const { PK_Viaje, horario_salida, horario_llegada, precio, fecha, FK_Charter, paradas } = req.body;
    // Verifica que al menos se proporcionen dos paradas
    if (!Array.isArray(paradas) || paradas.length < 2) {
        return res.status(400).json({ error: 'Se deben proporcionar al menos dos paradas.' });
    }
    // Inicia la transacción
    connection_1.default.beginTransaction((err) => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            return res.status(500).json({ error: 'Error al iniciar la transacción' });
        }
        // Actualiza el viaje
        connection_1.default.query(`UPDATE Viaje 
             SET horario_salida = ?, horario_llegada = ?, precio = ?, fecha = ?, FK_Charter = ?
             WHERE PK_Viaje = ?`, [horario_salida, horario_llegada, precio, fecha, FK_Charter, PK_Viaje], (err, result) => {
            if (err) {
                return connection_1.default.rollback(() => {
                    console.error('Error al actualizar el viaje:', err);
                    return res.status(500).json({ error: 'Error al actualizar el viaje' });
                });
            }
            // Elimina las paradas antiguas del viaje
            connection_1.default.query(`DELETE FROM Viaje_Parada WHERE FK_Viaje = ?`, [PK_Viaje], (err) => {
                if (err) {
                    return connection_1.default.rollback(() => {
                        console.error('Error al eliminar las paradas antiguas:', err);
                        return res.status(500).json({ error: 'Error al eliminar las paradas antiguas' });
                    });
                }
                // Inserta las nuevas paradas del viaje
                const values = paradas.map((parada, index) => [index + 1, parada.FK_Parada, PK_Viaje]);
                connection_1.default.query('INSERT INTO Viaje_Parada (orden, FK_Parada, FK_Viaje) VALUES ?', [values], (err) => {
                    if (err) {
                        return connection_1.default.rollback(() => {
                            console.error('Error al agregar las nuevas paradas del viaje:', err);
                            return res.status(500).json({ error: 'Error al agregar las nuevas paradas del viaje' });
                        });
                    }
                    // Confirmar la transacción
                    connection_1.default.commit((err) => {
                        if (err) {
                            return connection_1.default.rollback(() => {
                                console.error('Error al confirmar la transacción:', err);
                                return res.status(500).json({ error: 'Error al confirmar la transacción' });
                            });
                        }
                        // Enviar respuesta de éxito
                        res.json({ message: 'Viaje modificado correctamente' });
                    });
                });
            });
        });
    });
};
exports.putViajes = putViajes;
