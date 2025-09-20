# Usar la colección Postman para Backend IFTS-29

Este archivo explica cómo importar y ejecutar la colección Postman incluida en el repositorio (`tools/postman_collection.json`). Contiene pasos para ejecutar pruebas básicas y usar Postman Runner.

Requisitos
- Node.js instalado
- Servidor del proyecto levantado (ver "Arrancar servidor")
- Postman instalado (desktop o web con importación de archivo)

1) Arrancar el servidor
En la raíz del proyecto (donde está `package.json`):

```bash
npm start
```

o para desarrollo con autoreload:

```bash
npm run dev
```

El servidor por defecto corre en `http://localhost:3000`.

2) Importar la colección
- Abre Postman → File → Import → selecciona `tools/postman_collection.json` del repo.
- La colección se importará con el nombre "Backend IFTS-29 - Postman Collection" y tendrá una variable `baseUrl` definida en `http://localhost:3000`.

3) Verificar variable `baseUrl`
- En la colección, revisá Variables → `baseUrl` y confirmá que esté `http://localhost:3000`.

4) Flujo de prueba recomendado
1. GET /api/status — comprueba que la API está viva.
2. POST /api/pacientes — crear un paciente de prueba (guarda el `id` devuelto).
3. GET /api/pacientes — comprobar que aparece el paciente.
4. PUT /api/pacientes/:id — actualizar el paciente creado.
5. POST /api/turnos/verificar-conflicto — probar verificación de conflictos.
6. DELETE /api/pacientes/:id — borrar el paciente de prueba.

5) Ejecutar la colección (Runner)
- En Postman: Collection Runner → seleccioná "Backend IFTS-29 - Postman Collection" → Run.
- Opciones útiles: iterations=1, delay=0.

6) Tests incluidos
La colección incluye tests básicos en varias requests:
- GET /api/status: verifica status 200 y propiedad `status` == "success".
- GET /api/pacientes: verifica que la respuesta sea un array.
- POST /api/pacientes: verifica código 200/201 y que la respuesta contenga `id` o `dni`.
- PUT /api/pacientes/:id: verifica status 200.
- DELETE /api/pacientes/:id: verifica status 200.
- POST /api/turnos/verificar-conflicto: verifica status 200.

7) Solución de problemas
- Si alguna request falla con 404: revisá la URL y parámetros (`:id`, `:dni`, `:fecha`).
- Si falla con 500: abrí la terminal donde corre `npm start` y revisá los errores impresos por el middleware `errorHandler`.

8) Próximos pasos
- Puedo añadir más tests (para médicos y todos los endpoints de turnos) o convertir la colección a OpenAPI.

---
Generado automáticamente por el asistente. Si querés que agregue tests adicionales o un archivo `postman_environment.json` con variables locales, decímelo y lo creo.