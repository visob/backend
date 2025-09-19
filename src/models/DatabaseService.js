import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseService {
    constructor() {
        this.dbPath = path.join(__dirname, '../db/db.json');
    }

    // Leer toda la base de datos
    async readDatabase() {
        try {
            const data = await fs.readFile(this.dbPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error leyendo la base de datos:', error);
            return { pacientes: [], medicos: [], turnos: [] };
        }
    }

    // Escribir toda la base de datos
    async writeDatabase(data) {
        try {
            await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error('Error escribiendo la base de datos:', error);
            return false;
        }
    }

    // Obtener todos los registros de una tabla
    async getAll(tableName) {
        const db = await this.readDatabase();
        return db[tableName] || [];
    }

    // Obtener un registro por ID
    async getById(tableName, id) {
        const records = await this.getAll(tableName);
        return records.find(record => record[`Id${tableName.slice(0, -1).charAt(0).toUpperCase() + tableName.slice(1, -1)}`] == id);
    }

    // Crear un nuevo registro
    async create(tableName, newRecord) {
        const db = await this.readDatabase();
        if (!db[tableName]) {
            db[tableName] = [];
        }
        //Validar que no exista el mismo DNI
        if (tableName === 'pacientes') {
            const existingPatient = db[tableName].find(p => p.DNI === newRecord.DNI);
            if (existingPatient) {
                throw new Error('DNI ya existe');
            }
        }
        //Validar que no exista el mismo DNI en médicos
        if (tableName === 'medicos') {
            const existingDoctor = db[tableName].find(m => m.DNI === newRecord.DNI);
            if (existingDoctor) {
                throw new Error('DNI ya existe');
            }
        }
        
        // Generar nuevo ID
        const idField = `Id${tableName.slice(0, -1).charAt(0).toUpperCase() + tableName.slice(1, -1)}`;
        const maxId = db[tableName].length > 0 ? Math.max(...db[tableName].map(r => r[idField])) : 0;
        newRecord[idField] = maxId + 1;
        
        db[tableName].push(newRecord);
        const success = await this.writeDatabase(db);
        return success ? newRecord : null;
    }

    // Actualizar un registro
    async update(tableName, id, updatedData) {
        const db = await this.readDatabase();
        const idField = `Id${tableName.slice(0, -1).charAt(0).toUpperCase() + tableName.slice(1, -1)}`;
        const index = db[tableName].findIndex(record => record[idField] == id);
        
        if (index === -1) {
            return null;
        }
        
        db[tableName][index] = { ...db[tableName][index], ...updatedData, [idField]: parseInt(id) };
        const success = await this.writeDatabase(db);
        return success ? db[tableName][index] : null;
    }

    // Eliminar un registro
    async delete(tableName, id) {
        const db = await this.readDatabase();
        const idField = `Id${tableName.slice(0, -1).charAt(0).toUpperCase() + tableName.slice(1, -1)}`;
        const index = db[tableName].findIndex(record => record[idField] == id);
        
        if (index === -1) {
            return false;
        }
        
        db[tableName].splice(index, 1);
        return await this.writeDatabase(db);
    }
}

export default new DatabaseService();