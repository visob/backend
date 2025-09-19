import { Turno } from '../models/index.js';

const turnoController = {
    // GET /api/turnos - Obtener todos los turnos
    async getAll(req, res) {
        try {
            const turnos = await Turno.getAll();
            res.status(200).json({
                success: true,
                data: turnos,
                count: turnos.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los turnos',
                error: error.message
            });
        }
    },

    // GET /api/turnos/:id - Obtener un turno por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const turno = await Turno.getById(id);
            
            if (!turno) {
                return res.status(404).json({
                    success: false,
                    message: 'Turno no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: turno
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener el turno',
                error: error.message
            });
        }
    },

    // POST /api/turnos - Crear un nuevo turno
    async create(req, res) {
        try {
            const turnoData = req.body;
            const nuevoTurno = await Turno.create(turnoData);
            
            res.status(201).json({
                success: true,
                message: 'Turno creado exitosamente',
                data: nuevoTurno
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al crear el turno',
                error: error.message
            });
        }
    },

    // PUT /api/turnos/:id - Actualizar un turno
    async update(req, res) {
        try {
            const { id } = req.params;
            const turnoData = req.body;
            
            const turnoActualizado = await Turno.update(id, turnoData);
            
            res.status(200).json({
                success: true,
                message: 'Turno actualizado exitosamente',
                data: turnoActualizado
            });
        } catch (error) {
            if (error.message === 'Turno no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            
            res.status(400).json({
                success: false,
                message: 'Error al actualizar el turno',
                error: error.message
            });
        }
    },

    // DELETE /api/turnos/:id - Eliminar un turno
    async delete(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await Turno.delete(id);
            
            if (!eliminado) {
                return res.status(404).json({
                    success: false,
                    message: 'Turno no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Turno eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el turno',
                error: error.message
            });
        }
    },

    // GET /api/turnos/paciente/:idPaciente - Obtener turnos por paciente
    async getByPaciente(req, res) {
        try {
            const { idPaciente } = req.params;
            const turnos = await Turno.getByPaciente(idPaciente);
            
            res.status(200).json({
                success: true,
                data: turnos,
                count: turnos.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener turnos del paciente',
                error: error.message
            });
        }
    },

    // GET /api/turnos/medico/:idMedico - Obtener turnos por médico
    async getByMedico(req, res) {
        try {
            const { idMedico } = req.params;
            const turnos = await Turno.getByMedico(idMedico);
            
            res.status(200).json({
                success: true,
                data: turnos,
                count: turnos.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener turnos del médico',
                error: error.message
            });
        }
    },

    // GET /api/turnos/fecha/:fecha - Obtener turnos por fecha
    async getByFecha(req, res) {
        try {
            const { fecha } = req.params;
            const turnos = await Turno.getByFecha(fecha);
            
            res.status(200).json({
                success: true,
                data: turnos,
                count: turnos.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener turnos por fecha',
                error: error.message
            });
        }
    },

    // GET /api/turnos/completos - Obtener turnos con información completa de paciente y médico
    async getTurnosCompletos(req, res) {
        try {
            const turnos = await Turno.getTurnosCompletos();
            
            res.status(200).json({
                success: true,
                data: turnos,
                count: turnos.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener turnos completos',
                error: error.message
            });
        }
    },

    // POST /api/turnos/verificar-conflicto - Verificar si hay conflicto de horarios
    async verificarConflicto(req, res) {
        try {
            const { fecha, horaInicio, horaFin, idMedico, idTurno } = req.body;
            const hayConflicto = await Turno.checkConflicto(fecha, horaInicio, horaFin, idMedico, idTurno);
            
            res.status(200).json({
                success: true,
                hayConflicto: hayConflicto,
                message: hayConflicto ? 'Hay conflicto de horarios' : 'No hay conflicto de horarios'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al verificar conflicto de horarios',
                error: error.message
            });
        }
    }
};

export default turnoController;