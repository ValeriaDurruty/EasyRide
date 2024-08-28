import { Router } from 'express';
import { addReserva, cancelarReserva, getReservasEmpresa, getReservasFuturasEmpresa, getReservasFuturasPasajero, getReservasPasadasEmpresa, getReservasPasadasPasajero, getReservasPasajero } from '../controllers/reserva.controller';

const router = Router();

// Ruta para listar todas las reservas de un pasajero
router.get('/usuario/:PK_Usuario', getReservasPasajero);

// Ruta para listar todas las reservas futuras de un pasajero
router.get('/usuario-fut/:PK_Usuario', getReservasFuturasPasajero);


// Ruta para listar todas las reservas pasadas de un pasajero
router.get('/usuario-pas/:PK_Usuario', getReservasPasadasPasajero);


// Ruta para listar todas las reservas de una empresa
router.get('/empresa/:PK_Empresa', getReservasEmpresa);


// Ruta para listar todas las reservas futuras de una empresa
router.get('/empresa-fut/:PK_Empresa', getReservasFuturasEmpresa);


// Ruta para listar todas las reservas pasadas de una empresa
router.get('/empresa-pas/:PK_Empresa', getReservasPasadasEmpresa);

// Ruta para agregar una reseva
router.post('/', addReserva);

// Ruta para cancelar una reserva
router.put('/:PK_Reserva', cancelarReserva);

export default router;