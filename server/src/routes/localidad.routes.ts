import { Router } from 'express';
import { getLocalidades, getLocalidadesXProvincia } from '../controllers/localidad.controller';

const router = Router();

// Ruta para listar todas las localidades
router.get('/', getLocalidades);

// Ruta para listar todas las localidades de una provincia
router.get('/prov/:FK_Provincia', getLocalidadesXProvincia);


export default router;