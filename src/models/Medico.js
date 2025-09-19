import DatabaseService from './DatabaseService.js';

class Medico {
    constructor(data) {
        this.IdMedico = data.IdMedico || null;
        this.Nombre = data.Nombre;
        this.Apellido = data.Apellido;
        this.DNI = data.DNI;
        this.Especialidad = data.Especialidad;
    }

    // Validar los datos del médico
    validate() {
        const errors = [];

        if (!this.Nombre || this.Nombre.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        if (!this.Apellido || this.Apellido.trim().length < 2) {
            errors.push('El apellido debe tener al menos 2 caracteres');
        }

        if (!this.DNI || !/^\d{7,8}$/.test(this.DNI)) {
            errors.push('El DNI debe tener 7 u 8 dígitos');
        }

        if (!this.Especialidad || this.Especialidad.trim().length < 3) {
            errors.push('La especialidad debe tener al menos 3 caracteres');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Convertir a JSON
    toJSON() {
        return {
            IdMedico: this.IdMedico,
            Nombre: this.Nombre,
            Apellido: this.Apellido,
            DNI: this.DNI,
            Especialidad: this.Especialidad
        };
    }

    // Métodos estáticos para operaciones CRUD
    static async getAll() {
        return await DatabaseService.getAll('medicos');
    }

    static async getById(id) {
        return await DatabaseService.getById('medicos', id);
    }

    static async create(medicoData) {
        const medico = new Medico(medicoData);
        const validation = medico.validate();
        
        if (!validation.isValid) {
            throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
        }

        return await DatabaseService.create('medicos', medico.toJSON());
    }

    static async update(id, medicoData) {
        const existingMedico = await this.getById(id);
        if (!existingMedico) {
            throw new Error('Médico no encontrado');
        }

        const updatedData = { ...existingMedico, ...medicoData };
        const medico = new Medico(updatedData);
        const validation = medico.validate();
        
        if (!validation.isValid) {
            throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
        }

        return await DatabaseService.update('medicos', id, medico.toJSON());
    }

    static async delete(id) {
        const existingMedico = await this.getById(id);
        if (!existingMedico) {
            throw new Error('Médico no encontrado');
        }

        return await DatabaseService.delete('medicos', id);
    }

    // Buscar médicos por DNI
    static async getByDNI(dni) {
        const medicos = await this.getAll();
        return medicos.find(m => m.DNI === dni);
    }

    // Buscar médicos por especialidad
    static async getByEspecialidad(especialidad) {
        const medicos = await this.getAll();
        return medicos.filter(m => m.Especialidad.toLowerCase().includes(especialidad.toLowerCase()));
    }

    // Obtener todas las especialidades disponibles
    static async getEspecialidades() {
        const medicos = await this.getAll();
        const especialidades = [...new Set(medicos.map(m => m.Especialidad))];
        return especialidades.sort();
    }
}

export default Medico;