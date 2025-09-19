import express from 'express';
import turnoController from '../controllers/turnoController.js';

const router = express.Router();

// Rutas CRUD básicas
router.get('/', turnoController.getAll);
router.get('/:id', turnoController.getById);
router.post('/', turnoController.create);
router.put('/:id', turnoController.update);
router.delete('/:id', turnoController.delete);

// Rutas adicionales para búsquedas específicas
router.get('/paciente/:idPaciente', turnoController.getByPaciente);
router.get('/medico/:idMedico', turnoController.getByMedico);
router.get('/fecha/:fecha', turnoController.getByFecha);
router.get('/completos', turnoController.getTurnosCompletos);

// Ruta para verificar conflictos de horarios
router.post('/verificar-conflicto', turnoController.verificarConflicto);

export default router;