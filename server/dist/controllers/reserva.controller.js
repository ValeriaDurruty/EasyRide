"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelarReserva = exports.addReserva = exports.getReservasFuturasEmpresa = exports.getReservasPasadasEmpresa = exports.getReservasEmpresa = exports.getReservasFuturasPasajero = exports.getReservasPasadasPasajero = exports.getReservasPasajero = void 0;
const connection_1 = __importDefault(require("../db/connection"));
//Listar todas las reservas de un pasajero
const getReservasPasajero = (req, res) => {
    const { PK_Usuario } = req.params;
    const query = `SELECT 
                    r.PK_Reserva,
                    r.fecha_creacion,
                    esr.nombre AS estado_reserva,
                    v.PK_Viaje,
                    DATE_FORMAT(v.horario_salida, '%H:%i') AS horario_salida, 
                    DATE_FORMAT(v.horario_llegada, '%H:%i') AS horario_llegada, 
                    v.precio,
                    DATE_FORMAT(v.fecha, '%d-%m-%Y') AS fecha,
                    c.patente,
                    c.capacidad,
                    m.nombre AS modelo,
                    ma.nombre AS marca,
                    e.PK_Empresa,
                    e.razon_social AS empresa,
                    GROUP_CONCAT(
                        CONCAT(
                            ', Orden: ', vp.orden, 
                            ', Parada: ', p.nombre, 
                            ', Localidad: ', l.nombre, 
                            ', Provincia: ', pr.nombre
                        )
                        ORDER BY vp.orden
                        SEPARATOR '; '
                    ) AS paradas
                FROM 
                    Reserva r
                INNER JOIN 
                    Usuario u ON r.FK_Usuario = u.PK_Usuario
                INNER JOIN 
                    Estado_reserva esr ON r.FK_Estado_reserva = esr.PK_Estado_reserva
                INNER JOIN 
                    Viaje v ON r.FK_Viaje = v.PK_Viaje
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
                    u.PK_Usuario = ?
                GROUP BY
                    r.PK_Reserva,
                    r.fecha_creacion,
                    esr.nombre,
                    v.PK_Viaje,
                    v.horario_salida,
                    v.horario_llegada,
                    v.precio,
                    v.fecha,
                    c.patente,
                    c.capacidad,
                    m.nombre,
                    ma.nombre,
                    e.PK_Empresa,
                    e.razon_social
                ORDER BY 
                    r.PK_Reserva, vp.orden;`;
    connection_1.default.query(query, PK_Usuario, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar las reservas:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las reservas' });
        }
        else {
            if (data.length === 0 || (data.length === 1 && !data[0].PK_Reserva)) {
                return res.json('No hay reservas realizadas');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getReservasPasajero = getReservasPasajero;
// Listar todas las reservas pasadas de un pasajero
const getReservasPasadasPasajero = (req, res) => {
    const { PK_Usuario } = req.params;
    const query = `SELECT 
                    r.PK_Reserva,
                    r.fecha_creacion,
                    esr.nombre AS estado_reserva,
                    v.PK_Viaje,
                    DATE_FORMAT(v.horario_salida, '%H:%i') AS horario_salida, 
                    DATE_FORMAT(v.horario_llegada, '%H:%i') AS horario_llegada, 
                    v.precio,
                    DATE_FORMAT(v.fecha, '%d-%m-%Y') AS fecha,
                    c.patente,
                    c.capacidad,
                    m.nombre AS modelo,
                    ma.nombre AS marca,
                    e.PK_Empresa,
                    e.razon_social AS empresa,
                    GROUP_CONCAT(
                        CONCAT(
                            ', Orden: ', vp.orden, 
                            ', Parada: ', p.nombre, 
                            ', Localidad: ', l.nombre, 
                            ', Provincia: ', pr.nombre
                        )
                        ORDER BY vp.orden
                        SEPARATOR '; '
                    ) AS paradas
                FROM 
                    Reserva r
                INNER JOIN 
                    Usuario u ON r.FK_Usuario = u.PK_Usuario
                INNER JOIN 
                    Estado_reserva esr ON r.FK_Estado_reserva = esr.PK_Estado_reserva
                INNER JOIN 
                    Viaje v ON r.FK_Viaje = v.PK_Viaje
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
                    u.PK_Usuario = ? AND v.fecha < CURDATE()
                GROUP BY
                    r.PK_Reserva,
                    r.fecha_creacion,
                    esr.nombre,
                    v.PK_Viaje,
                    v.horario_salida,
                    v.horario_llegada,
                    v.precio,
                    v.fecha,
                    c.patente,
                    c.capacidad,
                    m.nombre,
                    ma.nombre,
                    e.PK_Empresa,
                    e.razon_social
                ORDER BY 
                    r.PK_Reserva, vp.orden;`;
    connection_1.default.query(query, PK_Usuario, (err, data) => {
        if (err) {
            console.error('Error al listar las reservas pasadas:', err);
            return res.status(500).json({ error: 'Error al listar las reservas pasadas' });
        }
        else {
            if (data.length === 0 || (data.length === 1 && !data[0].PK_Reserva)) {
                return res.json('No hay reservas pasadas realizadas');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getReservasPasadasPasajero = getReservasPasadasPasajero;
// Listar todas las reservas futuras de un pasajero
const getReservasFuturasPasajero = (req, res) => {
    const { PK_Usuario } = req.params;
    const query = `SELECT 
                    r.PK_Reserva,
                    r.fecha_creacion,
                    esr.nombre AS estado_reserva,
                    v.PK_Viaje,
                    DATE_FORMAT(v.horario_salida, '%H:%i') AS horario_salida, 
                    DATE_FORMAT(v.horario_llegada, '%H:%i') AS horario_llegada, 
                    v.precio,
                    DATE_FORMAT(v.fecha, '%d-%m-%Y') AS fecha,
                    c.patente,
                    c.capacidad,
                    m.nombre AS modelo,
                    ma.nombre AS marca,
                    e.PK_Empresa,
                    e.razon_social AS empresa,
                    GROUP_CONCAT(
                        CONCAT(
                            ', Orden: ', vp.orden, 
                            ', Parada: ', p.nombre, 
                            ', Localidad: ', l.nombre, 
                            ', Provincia: ', pr.nombre
                        )
                        ORDER BY vp.orden
                        SEPARATOR '; '
                    ) AS paradas
                FROM 
                    Reserva r
                INNER JOIN 
                    Usuario u ON r.FK_Usuario = u.PK_Usuario
                INNER JOIN 
                    Estado_reserva esr ON r.FK_Estado_reserva = esr.PK_Estado_reserva
                INNER JOIN 
                    Viaje v ON r.FK_Viaje = v.PK_Viaje
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
                    u.PK_Usuario = ? AND v.fecha >= CURDATE()
                GROUP BY
                    r.PK_Reserva,
                    r.fecha_creacion,
                    esr.nombre,
                    v.PK_Viaje,
                    v.horario_salida,
                    v.horario_llegada,
                    v.precio,
                    v.fecha,
                    c.patente,
                    c.capacidad,
                    m.nombre,
                    ma.nombre,
                    e.PK_Empresa,
                    e.razon_social
                ORDER BY 
                    r.PK_Reserva, vp.orden;`;
    connection_1.default.query(query, PK_Usuario, (err, data) => {
        if (err) {
            console.error('Error al listar las reservas futuras:', err);
            return res.status(500).json({ error: 'Error al listar las reservas futuras' });
        }
        else {
            if (data.length === 0 || (data.length === 1 && !data[0].PK_Reserva)) {
                return res.json('No hay reservas futuras realizadas');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getReservasFuturasPasajero = getReservasFuturasPasajero;
//Listar todas las reservas de una empresa
const getReservasEmpresa = (req, res) => {
    const { PK_Empresa } = req.params;
    const query = `SELECT 
                    r.PK_Reserva,
                    r.fecha_creacion,
                    esr.nombre AS estado_reserva,
                    v.PK_Viaje,
                    DATE_FORMAT(v.horario_salida, '%H:%i') AS horario_salida, 
                    DATE_FORMAT(v.horario_llegada, '%H:%i') AS horario_llegada, 
                    v.precio,
                    DATE_FORMAT(v.fecha, '%d-%m-%Y') AS fecha,
                    c.patente,
                    c.capacidad,
                    m.nombre AS modelo,
                    ma.nombre AS marca,
                    u.PK_Usuario,
                    u.nombre,
                    u.apellido,
                    GROUP_CONCAT(
                        CONCAT(
                            ', Orden: ', vp.orden, 
                            ', Parada: ', p.nombre, 
                            ', Localidad: ', l.nombre, 
                            ', Provincia: ', pr.nombre
                        )
                        ORDER BY vp.orden
                        SEPARATOR '; '
                    ) AS paradas
                FROM 
                    Reserva r
                INNER JOIN 
                    Usuario u ON r.FK_Usuario = u.PK_Usuario
                INNER JOIN 
                    Estado_reserva esr ON r.FK_Estado_reserva = esr.PK_Estado_reserva
                INNER JOIN 
                    Viaje v ON r.FK_Viaje = v.PK_Viaje
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
                    e.PK_Empresa = ?
                GROUP BY
                    r.PK_Reserva,
                    r.fecha_creacion,
                    esr.nombre,
                    v.PK_Viaje,
                    v.horario_salida,
                    v.horario_llegada,
                    v.precio,
                    v.fecha,
                    c.patente,
                    c.capacidad,
                    m.nombre,
                    ma.nombre,
                    u.PK_Usuario,
                    u.nombre,
                    u.apellido
                ORDER BY 
                    r.PK_Reserva, vp.orden;`;
    connection_1.default.query(query, PK_Empresa, (err, data) => {
        if (err) {
            // Registrar el error en la consola
            console.error('Error al listar las reservas:', err);
            // Devolver un mensaje de error al cliente
            return res.status(500).json({ error: 'Error al listar las reservas' });
        }
        else {
            if (data.length === 0 || (data.length === 1 && !data[0].PK_Reserva)) {
                return res.json('No hay reservas realizadas');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getReservasEmpresa = getReservasEmpresa;
// Listar todas las reservas pasadas de una empresa
const getReservasPasadasEmpresa = (req, res) => {
    const { PK_Empresa } = req.params;
    const query = `SELECT 
                    v.PK_Viaje,
                    DATE_FORMAT(v.fecha, '%d-%m-%Y') AS fecha,
                    DATE_FORMAT(v.horario_salida, '%H:%i') AS horario_salida, 
                    DATE_FORMAT(v.horario_llegada, '%H:%i') AS horario_llegada, 
                    v.precio,
                    c.patente,
                    m.nombre AS modelo,
                    ma.nombre AS marca,
                    paradas.paradas,
                    reservas.reservas
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
                LEFT JOIN (
                    SELECT
                        vp.FK_Viaje,
                        GROUP_CONCAT(
                            CONCAT(
                                'Orden: ', vp.orden, 
                                ', Parada: ', p.nombre, 
                                ', Localidad: ', l.nombre, 
                                ', Provincia: ', pr.nombre
                            )
                            ORDER BY vp.orden
                            SEPARATOR '; '
                        ) AS paradas
                    FROM
                        Viaje_Parada vp
                    INNER JOIN 
                        Parada p ON vp.FK_Parada = p.PK_Parada
                    INNER JOIN 
                        Localidad l ON p.FK_Localidad = l.PK_Localidad
                    INNER JOIN 
                        Provincia pr ON l.FK_Provincia = pr.PK_Provincia
                    GROUP BY
                        vp.FK_Viaje
                ) paradas ON paradas.FK_Viaje = v.PK_Viaje
                LEFT JOIN (
                    SELECT
                        r.FK_Viaje,
                        GROUP_CONCAT(
                            CONCAT(
                                'PK_Usuario: ', u.PK_Usuario, 
                                ', Nombre: ', u.nombre, 
                                ', Apellido: ', u.apellido, 
                                ', PK_Reserva: ', r.PK_Reserva, 
                                ', Fecha Creación: ', DATE_FORMAT(r.fecha_creacion, '%d-%m-%Y'), 
                                ', Estado Reserva: ', esr.nombre
                            )
                            ORDER BY r.PK_Reserva
                            SEPARATOR '; '
                        ) AS reservas
                    FROM
                        Reserva r
                    INNER JOIN 
                        Usuario u ON r.FK_Usuario = u.PK_Usuario
                    INNER JOIN 
                        Estado_reserva esr ON r.FK_Estado_reserva = esr.PK_Estado_reserva
                    GROUP BY
                        r.FK_Viaje
                ) reservas ON reservas.FK_Viaje = v.PK_Viaje
                WHERE 
                    e.PK_Empresa = ? 
                    AND v.fecha < CURDATE()
                    AND reservas.reservas IS NOT NULL
                ORDER BY  
                    v.fecha ASC,
                    v.PK_Viaje ASC;`;
    connection_1.default.query(query, PK_Empresa, (err, data) => {
        if (err) {
            console.error('Error al listar las reservas pasadas:', err);
            return res.status(500).json({ error: 'Error al listar las reservas pasadas' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay reservas pasadas realizadas');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getReservasPasadasEmpresa = getReservasPasadasEmpresa;
// Listar todas las reservas futuras de una empresa
const getReservasFuturasEmpresa = (req, res) => {
    const { PK_Empresa } = req.params;
    const query = `SELECT 
                    v.PK_Viaje,
                    DATE_FORMAT(v.fecha, '%d-%m-%Y') AS fecha,
                    DATE_FORMAT(v.horario_salida, '%H:%i') AS horario_salida, 
                    DATE_FORMAT(v.horario_llegada, '%H:%i') AS horario_llegada, 
                    v.precio,
                    c.patente,
                    m.nombre AS modelo,
                    ma.nombre AS marca,
                    paradas.paradas,
                    reservas.reservas
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
                LEFT JOIN (
                    SELECT
                        vp.FK_Viaje,
                        GROUP_CONCAT(
                            CONCAT(
                                'Orden: ', vp.orden, 
                                ', Parada: ', p.nombre, 
                                ', Localidad: ', l.nombre, 
                                ', Provincia: ', pr.nombre
                            )
                            ORDER BY vp.orden
                            SEPARATOR '; '
                        ) AS paradas
                    FROM
                        Viaje_Parada vp
                    INNER JOIN 
                        Parada p ON vp.FK_Parada = p.PK_Parada
                    INNER JOIN 
                        Localidad l ON p.FK_Localidad = l.PK_Localidad
                    INNER JOIN 
                        Provincia pr ON l.FK_Provincia = pr.PK_Provincia
                    GROUP BY
                        vp.FK_Viaje
                ) paradas ON paradas.FK_Viaje = v.PK_Viaje
                LEFT JOIN (
                    SELECT
                        r.FK_Viaje,
                        GROUP_CONCAT(
                            CONCAT(
                                'PK_Usuario: ', u.PK_Usuario, 
                                ', Nombre: ', u.nombre, 
                                ', Apellido: ', u.apellido, 
                                ', PK_Reserva: ', r.PK_Reserva, 
                                ', Fecha Creación: ', DATE_FORMAT(r.fecha_creacion, '%d-%m-%Y'), 
                                ', Estado Reserva: ', esr.nombre
                            )
                            ORDER BY r.PK_Reserva
                            SEPARATOR '; '
                        ) AS reservas
                    FROM
                        Reserva r
                    INNER JOIN 
                        Usuario u ON r.FK_Usuario = u.PK_Usuario
                    INNER JOIN 
                        Estado_reserva esr ON r.FK_Estado_reserva = esr.PK_Estado_reserva
                    GROUP BY
                        r.FK_Viaje
                ) reservas ON reservas.FK_Viaje = v.PK_Viaje
                WHERE 
                    e.PK_Empresa = ? 
                    AND v.fecha >= CURDATE()
                    AND reservas.reservas IS NOT NULL
                ORDER BY  
                    v.fecha ASC,
                    v.PK_Viaje ASC;`;
    connection_1.default.query(query, PK_Empresa, (err, data) => {
        if (err) {
            console.error('Error al listar las reservas futuras:', err);
            return res.status(500).json({ error: 'Error al listar las reservas futuras' });
        }
        else {
            if (data.length === 0) {
                return res.json('No hay reservas futuras realizadas');
            }
            else {
                res.json(data);
            }
        }
    });
};
exports.getReservasFuturasEmpresa = getReservasFuturasEmpresa;
// Agregar una reserva
const addReserva = (req, res) => {
    const { PK_Usuario, PK_Viaje } = req.body;
    // Verificar que todos los campos necesarios estén presentes
    if (!PK_Usuario || !PK_Viaje) {
        return res.status(400).json({ error: 'Faltan datos requeridos para crear la reserva' });
    }
    // Iniciar una transacción para asegurar consistencia en la base de datos
    connection_1.default.beginTransaction((err) => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            return res.status(500).json({ error: 'Error al iniciar la transacción' });
        }
        // Obtener el cupo disponible del viaje
        const getCupoQuery = 'SELECT cupo FROM Viaje WHERE PK_Viaje = ?';
        connection_1.default.query(getCupoQuery, [PK_Viaje], (err, results) => {
            if (err) {
                console.error('Error al verificar el cupo disponible:', err);
                return connection_1.default.rollback(() => {
                    res.status(500).json({ error: 'Error al verificar el cupo disponible' });
                });
            }
            if (results.length === 0) {
                return connection_1.default.rollback(() => {
                    res.status(404).json({ error: 'Viaje no encontrado' });
                });
            }
            const cupoDisponible = results[0].cupo;
            if (cupoDisponible <= 0) {
                return connection_1.default.rollback(() => {
                    res.status(400).json({ error: 'No hay cupos disponibles para este viaje' });
                });
            }
            // Reducir el cupo disponible del viaje en 1
            const updateCupoQuery = 'UPDATE Viaje SET cupo = cupo - 1 WHERE PK_Viaje = ?';
            connection_1.default.query(updateCupoQuery, [PK_Viaje], (err, result) => {
                if (err) {
                    console.error('Error al actualizar el cupo disponible:', err);
                    return connection_1.default.rollback(() => {
                        res.status(500).json({ error: 'Error al actualizar el cupo disponible' });
                    });
                }
                // Generar la fecha de creación actual
                const fecha_creacion = new Date();
                // Crear la consulta SQL para insertar la nueva reserva
                const insertReservaQuery = `INSERT INTO Reserva 
                                            (FK_Usuario, FK_Viaje, FK_Estado_reserva, fecha_creacion)
                                            VALUES (?, ?, ?, ?);`;
                // Ejecutar la consulta para insertar la nueva reserva
                connection_1.default.query(insertReservaQuery, [PK_Usuario, PK_Viaje, 1, fecha_creacion], (err, result) => {
                    if (err) {
                        console.error('Error al agregar la reserva:', err);
                        return connection_1.default.rollback(() => {
                            res.status(500).json({ error: 'Error al agregar la reserva' });
                        });
                    }
                    // Confirmar la transacción si todo fue exitoso
                    connection_1.default.commit((err) => {
                        if (err) {
                            console.error('Error al confirmar la transacción:', err);
                            return connection_1.default.rollback(() => {
                                res.status(500).json({ error: 'Error al confirmar la transacción' });
                            });
                        }
                        // Responder con éxito y con el ID de la nueva reserva
                        res.status(201).json({ message: 'Reserva creada exitosamente N° ', PK_Reserva: result.insertId });
                    });
                });
            });
        });
    });
};
exports.addReserva = addReserva;
//Cancelar una reserva
const cancelarReserva = (req, res) => {
    const { PK_Reserva } = req.params;
    if (!PK_Reserva) {
        return res.status(400).json({ error: 'PK_Reserva es requerido' });
    }
    // Iniciar una transacción para asegurar consistencia en la base de datos
    connection_1.default.beginTransaction((err) => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            return res.status(500).json({ error: 'Error al iniciar la transacción' });
        }
        // Obtener el viaje asociado a la reserva
        const getViajeQuery = 'SELECT FK_Viaje FROM Reserva WHERE PK_Reserva = ?';
        connection_1.default.query(getViajeQuery, [PK_Reserva], (err, results) => {
            if (err) {
                console.error('Error al obtener el viaje asociado a la reserva:', err);
                return connection_1.default.rollback(() => {
                    res.status(500).json({ error: 'Error al obtener el viaje asociado a la reserva' });
                });
            }
            if (results.length === 0) {
                return connection_1.default.rollback(() => {
                    res.status(404).json({ error: 'Reserva no encontrada' });
                });
            }
            const PK_Viaje = results[0].FK_Viaje;
            // Actualizar el estado de la reserva a "cancelada"
            const updateEstadoQuery = 'UPDATE Reserva SET FK_Estado_reserva = 2 WHERE PK_Reserva = ?';
            connection_1.default.query(updateEstadoQuery, [PK_Reserva], (err, result) => {
                if (err) {
                    console.error('Error al cancelar la reserva:', err);
                    return connection_1.default.rollback(() => {
                        res.status(500).json({ error: 'Error al cancelar la reserva' });
                    });
                }
                if (result.affectedRows === 0) {
                    return connection_1.default.rollback(() => {
                        res.status(404).json({ error: 'Reserva no encontrada' });
                    });
                }
                // Incrementar el cupo del viaje en 1
                const updateCupoQuery = 'UPDATE Viaje SET cupo = cupo + 1 WHERE PK_Viaje = ?';
                connection_1.default.query(updateCupoQuery, [PK_Viaje], (err, result) => {
                    if (err) {
                        console.error('Error al actualizar el cupo disponible:', err);
                        return connection_1.default.rollback(() => {
                            res.status(500).json({ error: 'Error al actualizar el cupo disponible' });
                        });
                    }
                    // Confirmar la transacción si todo fue exitoso
                    connection_1.default.commit((err) => {
                        if (err) {
                            console.error('Error al confirmar la transacción:', err);
                            return connection_1.default.rollback(() => {
                                res.status(500).json({ error: 'Error al confirmar la transacción' });
                            });
                        }
                        // Responder con éxito
                        res.status(200).json({ message: 'Reserva cancelada y cupo actualizado exitosamente' });
                    });
                });
            });
        });
    });
};
exports.cancelarReserva = cancelarReserva;
