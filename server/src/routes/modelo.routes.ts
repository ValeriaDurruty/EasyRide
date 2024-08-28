import { Router } from 'express';
import { getModelos } from '../controllers/modelo.controller';

const router = Router();

// Ruta para listar todos los modelos
router.get('/', getModelos);


export default router;