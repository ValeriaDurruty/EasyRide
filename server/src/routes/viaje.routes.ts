import { Router } from 'express';
import { deleteViajes, getViajesXid, getViajesXEmpresa, getBusquedaViajes, addViaje, putViajes, getViajes } from '../controllers/viaje.controller';

const router = Router();

// Ruta para listar todos los viajes de una empresa
router.get('/empresa/:FK_Empresa', getViajesXEmpresa);

// Ruta para listar todos los viajes
router.get('/', getViajes);

// Ruta para lista de búsqueda de viajes
router.post('/buscar', getBusquedaViajes);

// Ruta para obtener un charter en particular mediante una id
router.get('/:id', getViajesXid);

// Ruta para eliminar un charter en particular mediante una id
router.delete('/:id', deleteViajes);

// Ruta para agregar un viaje
router.post('/', addViaje);

// Ruta para modificar un viaje en particular mediante una id
router.put('/:id', putViajes);


export default router;