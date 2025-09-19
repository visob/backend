import express from 'express';
import pacienteController from '../controllers/pacienteController.js';

const router = express.Router();

// Rutas CRUD básicas
router.get('/', pacienteController.getAll);
router.get('/:id', pacienteController.getById);
router.post('/', pacienteController.create);
router.put('/:id', pacienteController.update);
router.delete('/:id', pacienteController.delete);

// Rutas adicionales para búsquedas específicas
router.get('/dni/:dni', pacienteController.getByDNI);
router.get('/obra-social/:obraSocial', pacienteController.getByObraSocial);

export default router;