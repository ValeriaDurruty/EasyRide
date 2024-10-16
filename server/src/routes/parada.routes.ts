import { Router } from 'express';
import { addParada, getParadas, getParadasxLocalidad, getParadasxEmpresa, getParadasxId, deleteParadas, putParadas } from '../controllers/parada.controller';

const router = Router();

// Ruta para listar todas las paradas de una empresa
router.get('/empresa/:FK_Empresa', getParadasxEmpresa);

// Ruta para obtener una parada en particular mediante una id
router.get('/:PK_Parada', getParadasxId);

// Ruta para eliminar una parada en particular mediante una id
router.delete('/:PK_Parada', deleteParadas);

// Ruta para listar todas las paradas
router.get('/', getParadas);

// Ruta para filtrar paradas por localidad
router.get('/localidad/:PK_Localidad', getParadasxLocalidad);

// Ruta para agregar una nueva parada
router.post('/', addParada);

// Ruta para modificar una parada en particular mediante una id
router.put('/:PK_Parada', putParadas);


export default router;