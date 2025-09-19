// Archivo principal para las rutas
import express from 'express';
import pacienteRoutes from './pacienteRoutes.js';
import medicoRoutes from './medicoRoutes.js';
import turnoRoutes from './turnoRoutes.js';

const router = express.Router();

// Ruta principal - renderizar vista Pug
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Backend IFTS-29 API',
        message: 'Servidor funcionando correctamente',
        description: 'API REST para gestión médica con base de datos JSON simulada'
    });
});

// Rutas para las vistas de gestión
router.get('/pacientes', (req, res) => {
  res.render('pacientes');
});

router.get('/medicos', (req, res) => {
  res.render('medicos');
});

router.get('/turnos', (req, res) => {
  res.render('turnos');
});

// Ruta de ejemplo para API
router.get('/api/status', (req, res) => {
    res.json({
        status: 'success',
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
        viewEngine: 'Pug',
        moduleSystem: 'ES6 Modules',
        database: 'JSON File Database',
        endpoints: {
            pacientes: '/api/pacientes',
            medicos: '/api/medicos',
            turnos: '/api/turnos',
            status: '/api/status'
        }
    });
});

// Rutas de la API
router.use('/api/pacientes', pacienteRoutes);
router.use('/api/medicos', medicoRoutes);
router.use('/api/turnos', turnoRoutes);

export default router;