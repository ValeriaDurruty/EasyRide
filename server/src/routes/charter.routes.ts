import { Router } from 'express';
import { checkCharterPatente, deleteCharters, getCharters, getChartersXEmpresa, postCharters, putCharters } from '../controllers/charter.controller';

const router = Router();

// Ruta para listar todos los charters de una empresa
router.get('/empresa/:FK_Empresa', getChartersXEmpresa);

// Ruta para obtener un charter en particular mediante una id
router.get('/:id', getCharters);

// Ruta para eliminar un charter en particular mediante una id
router.delete('/:id', deleteCharters);

// Ruta para agregar un charter
router.post('/', postCharters);

// Ruta para modificar un charter en particular mediante una id
router.put('/:id', putCharters);

// Ruta para verificar la patente. EL Q SALTA 404
router.get('/checkpatente/:patente', checkCharterPatente);


export default router;