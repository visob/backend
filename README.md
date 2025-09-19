# Backend IFTS-29

Backend con estructura MVC (Modelo-Vista-Controlador) desarrollado con Node.js, Express, ES6 Modules y Pug.

## 🚀 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm run dev
```

3. Ejecutar en modo producción:
```bash
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── app.js              # Archivo principal de la aplicación (ES6 modules)
├── models/             # Modelos de datos
│   ├── index.js        # Exportador de modelos (ES6 modules)
│   └── User.js         # Modelo de usuario (ejemplo)
├── views/              # Vistas Pug
│   └── index.pug       # Página principal en Pug
├── controllers/        # Controladores de lógica de negocio
│   ├── index.js        # Exportador de controladores (ES6 modules)
│   └── userController.js # Controlador de usuarios (ejemplo)
├── routes/             # Definición de rutas
│   ├── index.js        # Rutas principales (ES6 modules)
│   └── userRoutes.js   # Rutas de usuarios (ejemplo)
└── middleware/         # Middleware personalizado
    └── index.js        # Middleware de logging y errores (ES6 modules)
```

## 🔗 Endpoints Disponibles

### Rutas Principales
- `GET /` - Página principal
- `GET /api/status` - Estado de la API

### API de Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

## 📝 Ejemplo de Uso

### Crear un usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan Pérez", "email": "juan@example.com"}'
```

### Obtener todos los usuarios
```bash
curl http://localhost:3000/api/users
```

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Pug** - Motor de plantillas (anteriormente Jade)
- **ES6 Modules** - Sistema de módulos moderno (import/export)
- **Nodemon** - Herramienta de desarrollo para reinicio automático

## 📋 Características

- ✅ Estructura MVC organizada
- ✅ Middleware personalizado para logging y manejo de errores
- ✅ API RESTful con operaciones CRUD
- ✅ Validación de datos
- ✅ Manejo de errores centralizado
- ✅ CORS habilitado
- ✅ Archivos estáticos servidos

## 🔧 Configuración

El servidor se ejecuta por defecto en el puerto 3000. Puedes cambiarlo configurando la variable de entorno `PORT`:

```bash
PORT=8000 npm start
```

## 📚 Próximos Pasos

Para expandir este proyecto, puedes:

1. **Agregar una base de datos** (MongoDB, PostgreSQL, MySQL)
2. **Implementar autenticación** (JWT, sessions)
3. **Agregar más modelos y controladores**
4. **Implementar tests** (Jest, Mocha)
5. **Agregar validación avanzada** (Joi, express-validator)
6. **Configurar variables de entorno** (.env)
7. **Implementar logging avanzado** (Winston)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request