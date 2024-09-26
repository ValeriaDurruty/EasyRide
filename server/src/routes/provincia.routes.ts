import { Router } from 'express';
import { getProvincias } from '../controllers/provincia.controller';

const router = Router();

// Ruta para listar todas las provincias
router.get('/', getProvincias);


export default router;