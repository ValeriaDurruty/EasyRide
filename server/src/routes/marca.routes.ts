import { Router } from 'express';
import { getMarcas } from '../controllers/marca.controller';

const router = Router();

// Ruta para listar todos los modelos
router.get('/', getMarcas);


export default router;