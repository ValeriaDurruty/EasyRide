import { Router } from 'express';
import { geParadas } from '../controllers/parada.controller';

const router = Router();

// Ruta para listar todas las paradas
router.get('/', geParadas);


export default router;