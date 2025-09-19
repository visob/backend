import DatabaseService from './DatabaseService.js';

class Paciente {
    constructor(data) {
        this.IdPaciente = data.IdPaciente || null;
        this.Nombre = data.Nombre;
        this.Apellido = data.Apellido;
        this.DNI = data.DNI;
        this.Edad = data.Edad;
        this.Sexo = data.Sexo;
        this.ObraSocial = data.ObraSocial;
        this.NroAfiliado = data.NroAfiliado;
    }

    // Validar los datos del paciente
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

        if (!this.Edad || this.Edad < 0 || this.Edad > 120) {
            errors.push('La edad debe estar entre 0 y 120 años');
        }

        if (!this.Sexo || !['M', 'F'].includes(this.Sexo.toUpperCase())) {
            errors.push('El sexo debe ser M (Masculino) o F (Femenino)');
        }

        if (!this.ObraSocial || this.ObraSocial.trim().length < 2) {
            errors.push('La obra social es requerida');
        }

        if (!this.NroAfiliado || this.NroAfiliado.trim().length < 3) {
            errors.push('El número de afiliado debe tener al menos 3 caracteres');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Convertir a JSON
    toJSON() {
        return {
            IdPaciente: this.IdPaciente,
            Nombre: this.Nombre,
            Apellido: this.Apellido,
            DNI: this.DNI,
            Edad: this.Edad,
            Sexo: this.Sexo.toUpperCase(),
            ObraSocial: this.ObraSocial,
            NroAfiliado: this.NroAfiliado
        };
    }

    // Métodos estáticos para operaciones CRUD
    static async getAll() {
        return await DatabaseService.getAll('pacientes');
    }

    static async getById(id) {
        return await DatabaseService.getById('pacientes', id);
    }

    static async create(pacienteData) {
        const paciente = new Paciente(pacienteData);
        const validation = paciente.validate();
        
        if (!validation.isValid) {
            throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
        }

        return await DatabaseService.create('pacientes', paciente.toJSON());
    }

    static async update(id, pacienteData) {
        const existingPaciente = await this.getById(id);
        if (!existingPaciente) {
            throw new Error('Paciente no encontrado');
        }

        const updatedData = { ...existingPaciente, ...pacienteData };
        const paciente = new Paciente(updatedData);
        const validation = paciente.validate();
        
        if (!validation.isValid) {
            throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
        }

        return await DatabaseService.update('pacientes', id, paciente.toJSON());
    }

    static async delete(id) {
        const existingPaciente = await this.getById(id);
        if (!existingPaciente) {
            throw new Error('Paciente no encontrado');
        }

        return await DatabaseService.delete('pacientes', id);
    }

    // Buscar pacientes por DNI
    static async getByDNI(dni) {
        const pacientes = await this.getAll();
        return pacientes.find(p => p.DNI === dni);
    }

    // Buscar pacientes por obra social
    static async getByObraSocial(obraSocial) {
        const pacientes = await this.getAll();
        return pacientes.filter(p => p.ObraSocial.toLowerCase().includes(obraSocial.toLowerCase()));
    }
}

export default Paciente;