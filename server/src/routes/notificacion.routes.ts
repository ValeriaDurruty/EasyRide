import { Router } from 'express';
import { postNotificacion } from '../controllers/notificacion.controller';

const router = Router();

// Ruta para agregar una notificación de disponibilidad de un viaje
router.post('/', postNotificacion);

export default router;