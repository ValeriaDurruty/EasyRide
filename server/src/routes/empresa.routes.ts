import { Router } from 'express';
import { getEmpresas, getEmpresasXid, deleteEmpresas, postEmpresas, putEmpresas, checkCuitEmpresa } from '../controllers/empresa.controller';

const router = Router();

// Ruta para listar todas las empresas
router.get('/', getEmpresas);

// Ruta para obtener una empresa en particular mediante una id
router.get('/:id', getEmpresasXid);

// Ruta para eliminar una empresa en particular mediante una id
router.delete('/:id', deleteEmpresas);

// Ruta para agregar una empresa
router.post('/', postEmpresas);

// Ruta para modificar una empresa en particular mediante una id
router.put('/:id', putEmpresas);

// Ruta para verificar el CUIT de una empresa
router.get('/checkcuit/:cuit', checkCuitEmpresa);


export default router;