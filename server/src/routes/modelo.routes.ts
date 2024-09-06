import { Router } from 'express';
import { getModelos, getModelosXMarca } from '../controllers/modelo.controller';

const router = Router();

// Ruta para listar todos los modelos
router.get('/', getModelos);

// Ruta para listar todos los charters de una empresa
router.get('/marca/:FK_Marca', getModelosXMarca);


export default router;