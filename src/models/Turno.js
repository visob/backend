import DatabaseService from './DatabaseService.js';
import Paciente from './Paciente.js';
import Medico from './Medico.js';

class Turno {
    constructor(data) {
        this.IdTurno = data.IdTurno || null;
        this.Fecha = data.Fecha;
        this.HoraInicio = data.HoraInicio;
        this.HoraFin = data.HoraFin;
        this.IdPaciente = data.IdPaciente;
        this.IdMedico = data.IdMedico;
    }

    // Validar los datos del turno
    async validate() {
        const errors = [];

        // Validar fecha
        if (!this.Fecha || !this.isValidDate(this.Fecha)) {
            errors.push('La fecha debe tener formato YYYY-MM-DD válido');
        } else {
            const fechaTurno = new Date(this.Fecha);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            if (fechaTurno < hoy) {
                errors.push('La fecha del turno no puede ser anterior a hoy');
            }
        }

        // Validar horarios
        if (!this.HoraInicio || !this.isValidTime(this.HoraInicio)) {
            errors.push('La hora de inicio debe tener formato HH:MM válido');
        }

        if (!this.HoraFin || !this.isValidTime(this.HoraFin)) {
            errors.push('La hora de fin debe tener formato HH:MM válido');
        }

        if (this.HoraInicio && this.HoraFin && this.HoraInicio >= this.HoraFin) {
            errors.push('La hora de inicio debe ser anterior a la hora de fin');
        }

        // Validar que la fecha y hora sean posteriores al momento actual
        if (this.Fecha && this.HoraInicio && this.isValidDate(this.Fecha) && this.isValidTime(this.HoraInicio)) {
            const fechaHoraTurno = new Date(`${this.Fecha}T${this.HoraInicio}:00`);
            const ahora = new Date();
            
            if (fechaHoraTurno <= ahora) {
                errors.push('La fecha y hora del turno deben ser posteriores al momento actual');
            }
        }

        // Validar que el paciente existe
        if (!this.IdPaciente) {
            errors.push('El ID del paciente es requerido');
        } else {
            const paciente = await Paciente.getById(this.IdPaciente);
            if (!paciente) {
                errors.push('El paciente especificado no existe');
            }
        }

        // Validar que el médico existe
        if (!this.IdMedico) {
            errors.push('El ID del médico es requerido');
        } else {
            const medico = await Medico.getById(this.IdMedico);
            if (!medico) {
                errors.push('El médico especificado no existe');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Validar formato de fecha
    isValidDate(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;
        
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    // Validar formato de hora
    isValidTime(timeString) {
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(timeString);
    }

    // Convertir a JSON
    toJSON() {
        return {
            IdTurno: this.IdTurno,
            Fecha: this.Fecha,
            HoraInicio: this.HoraInicio,
            HoraFin: this.HoraFin,
            IdPaciente: parseInt(this.IdPaciente),
            IdMedico: parseInt(this.IdMedico)
        };
    }

    // Métodos estáticos para operaciones CRUD
    static async getAll() {
        return await DatabaseService.getAll('turnos');
    }

    static async getById(id) {
        return await DatabaseService.getById('turnos', id);
    }

    static async create(turnoData) {
        const turno = new Turno(turnoData);
        const validation = await turno.validate();
        
        if (!validation.isValid) {
            throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
        }

        // Verificar conflictos de horario
        const conflicto = await this.checkConflicto(turno.Fecha, turno.HoraInicio, turno.HoraFin, turno.IdMedico);
        if (conflicto) {
            throw new Error('El médico ya tiene un turno asignado en ese horario');
        }

        return await DatabaseService.create('turnos', turno.toJSON());
    }

    static async update(id, turnoData) {
        const existingTurno = await this.getById(id);
        if (!existingTurno) {
            throw new Error('Turno no encontrado');
        }

        const updatedData = { ...existingTurno, ...turnoData };
        const turno = new Turno(updatedData);
        const validation = await turno.validate();
        
        if (!validation.isValid) {
            throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
        }

        // Verificar conflictos de horario (excluyendo el turno actual)
        const conflicto = await this.checkConflicto(turno.Fecha, turno.HoraInicio, turno.HoraFin, turno.IdMedico, id);
        if (conflicto) {
            throw new Error('El médico ya tiene un turno asignado en ese horario');
        }

        return await DatabaseService.update('turnos', id, turno.toJSON());
    }

    static async delete(id) {
        const existingTurno = await this.getById(id);
        if (!existingTurno) {
            throw new Error('Turno no encontrado');
        }

        return await DatabaseService.delete('turnos', id);
    }

    // Verificar conflictos de horario
    static async checkConflicto(fecha, horaInicio, horaFin, idMedico, excludeId = null) {
        const turnos = await this.getAll();
        
        return turnos.some(turno => {
            // Excluir el turno actual si se está editando
            if (excludeId && turno.IdTurno == excludeId) return false;
            
            // Solo verificar turnos del mismo médico
            if (turno.IdMedico != idMedico) return false;
            
            // Solo verificar turnos de la misma fecha
            if (turno.Fecha !== fecha) return false;
            
            // Verificar solapamiento de horarios usando lógica de intervalos
            // Dos intervalos se solapan si: inicio1 < fin2 && inicio2 < fin1
            // En nuestro caso: horaInicio < turno.HoraFin && turno.HoraInicio < horaFin
            const hayConflicto = (horaInicio < turno.HoraFin && turno.HoraInicio < horaFin);
            
            return hayConflicto;
        });
    }

    // Obtener turnos por paciente
    static async getByPaciente(idPaciente) {
        const turnos = await this.getAll();
        return turnos.filter(t => t.IdPaciente == idPaciente);
    }

    // Obtener turnos por médico
    static async getByMedico(idMedico) {
        const turnos = await this.getAll();
        return turnos.filter(t => t.IdMedico == idMedico);
    }

    // Obtener turnos por fecha
    static async getByFecha(fecha) {
        const turnos = await this.getAll();
        return turnos.filter(t => t.Fecha === fecha);
    }

    // Obtener turnos con información completa (JOIN)
    static async getTurnosCompletos() {
        const turnos = await this.getAll();
        const pacientes = await Paciente.getAll();
        const medicos = await Medico.getAll();
        
        return turnos.map(turno => {
            const paciente = pacientes.find(p => p.IdPaciente === turno.IdPaciente);
            const medico = medicos.find(m => m.IdMedico === turno.IdMedico);
            
            return {
                ...turno,
                Paciente: paciente ? `${paciente.Nombre} ${paciente.Apellido}` : 'Paciente no encontrado',
                Medico: medico ? `${medico.Nombre} ${medico.Apellido}` : 'Médico no encontrado',
                Especialidad: medico ? medico.Especialidad : 'N/A'
            };
        });
    }
}

export default Turno;