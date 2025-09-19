import { Medico } from '../models/index.js';

const medicoController = {
    // GET /api/medicos - Obtener todos los médicos
    async getAll(req, res) {
        try {
            const medicos = await Medico.getAll();
            res.status(200).json({
                success: true,
                data: medicos,
                count: medicos.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los médicos',
                error: error.message
            });
        }
    },

    // GET /api/medicos/:id - Obtener un médico por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const medico = await Medico.getById(id);
            
            if (!medico) {
                return res.status(404).json({
                    success: false,
                    message: 'Médico no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: medico
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener el médico',
                error: error.message
            });
        }
    },

    // POST /api/medicos - Crear un nuevo médico
    async create(req, res) {
        try {
            const medicoData = req.body;
            const nuevoMedico = await Medico.create(medicoData);
            
            res.status(201).json({
                success: true,
                message: 'Médico creado exitosamente',
                data: nuevoMedico
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al crear el médico',
                error: error.message
            });
        }
    },

    // PUT /api/medicos/:id - Actualizar un médico
    async update(req, res) {
        try {
            const { id } = req.params;
            const medicoData = req.body;
            
            const medicoActualizado = await Medico.update(id, medicoData);
            
            res.status(200).json({
                success: true,
                message: 'Médico actualizado exitosamente',
                data: medicoActualizado
            });
        } catch (error) {
            if (error.message === 'Médico no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            
            res.status(400).json({
                success: false,
                message: 'Error al actualizar el médico',
                error: error.message
            });
        }
    },

    // DELETE /api/medicos/:id - Eliminar un médico
    async delete(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await Medico.delete(id);
            
            if (!eliminado) {
                return res.status(404).json({
                    success: false,
                    message: 'Médico no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Médico eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el médico',
                error: error.message
            });
        }
    },

    // GET /api/medicos/dni/:dni - Buscar médico por DNI
    async getByDNI(req, res) {
        try {
            const { dni } = req.params;
            const medico = await Medico.getByDNI(dni);
            
            if (!medico) {
                return res.status(404).json({
                    success: false,
                    message: 'Médico no encontrado con ese DNI'
                });
            }

            res.status(200).json({
                success: true,
                data: medico
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al buscar el médico',
                error: error.message
            });
        }
    },

    // GET /api/medicos/especialidad/:especialidad - Buscar médicos por especialidad
    async getByEspecialidad(req, res) {
        try {
            const { especialidad } = req.params;
            const medicos = await Medico.getByEspecialidad(especialidad);
            
            res.status(200).json({
                success: true,
                data: medicos,
                count: medicos.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al buscar médicos por especialidad',
                error: error.message
            });
        }
    },

    // GET /api/medicos/especialidades - Obtener todas las especialidades disponibles
    async getEspecialidades(req, res) {
        try {
            const especialidades = await Medico.getEspecialidades();
            
            res.status(200).json({
                success: true,
                data: especialidades,
                count: especialidades.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener las especialidades',
                error: error.message
            });
        }
    }
};

export default medicoController;