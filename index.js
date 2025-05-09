
// Descripción: Este archivo contiene la configuración del servidor Express y las rutas para manejar las solicitudes HTTP.
const express = require('express')
const path = require('path');
const cors = require('cors');
const app = express();

const db = require('./backend/persistencia/db.js');
const pool = require('./backend/persistencia/db.js');


// Configuración de CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuración de archivos estáticos
app.use('/website', express.static(path.join(__dirname, '/views')));
app.use(express.static("views"));


/**
 * Redirige la solicitud raíz al archivo index.html dentro de la carpeta /website.
 * @name GET /
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.get('/', (req, res) => {
    res.redirect('/website/index.html');
});

app.use(express.static(path.join(__dirname, "views")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * Registra una nueva persona en la base de datos.
 * @name POST /registrar
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.body - Datos de la persona a registrar.
 * @param {string} req.body.nombre - Nombre de la persona.
 * @param {string} req.body.apellido - Apellido de la persona.
 * @param {number} req.body.edad - Edad de la persona.
 * @param {string} req.body.telefono - Teléfono de la persona.
 * @param {string} req.body.identificacion - Identificación de la persona.
 * @param {string} req.body.genero - Género de la persona.
 * @param {string} req.body.fecha_nacimiento - Fecha de nacimiento de la persona.
 * @param {string} req.body.estado_civil - Estado civil de la persona.
 * @param {string} req.body.direccion - Dirección de la persona.
 * @param {string} req.body.tipo_usuario - Tipo de usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.post('/registrar', async (req, res) => {
    const {
        nombre,
        apellido,
        edad,
        telefono,
        identificacion,
        genero,
        fecha_nacimiento,
        estado_civil,
        direccion,
        tipo_usuario
    } = req.body;

    try {
        const connection = await db.getConnection();
        const sql = `
            INSERT INTO PERSONA
            (NOMBRE, APELLIDO, EDAD, TELEFONO, IDENTIFICACION, GENERO, FECHA_NACIMIENTO, ESTADO_CIVIL, DIRECCION, TIPO_USUARIO)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(sql, [
            nombre,
            apellido,
            edad,
            telefono,
            identificacion,
            genero,
            fecha_nacimiento,
            estado_civil,
            direccion,
            tipo_usuario
        ]);
        connection.release();
        res.send('<script>alert("Te has registrado con éxito"); window.location.href = "/index.html";</script>');
    } catch (error) {
        console.error("Error al registrar:", error.message);
        res.status(500).send("Error al registrar");
    }
});

/**
 * Registra una nueva cita médica en la base de datos.
 * @name POST /registrar-cita
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.body - Datos de la cita médica.
 * @param {string} req.body.nombre_paciente - Nombre del paciente.
 * @param {string} req.body.nombre_medico - Nombre del médico.
 * @param {string} req.body.fecha - Fecha de la cita.
 * @param {string} req.body.hora - Hora de la cita.
 * @param {string} req.body.motivo - Motivo de la cita.
 * @param {string} req.body.tipo_consulta - Tipo de consulta.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.post('/registrar-cita', async (req, res) => {
    const {
        nombre_paciente,
        nombre_medico,
        fecha,
        hora,
        motivo,
        tipo_consulta
    } = req.body;

    try {
        const connection = await db.getConnection();
        const sql = `
            INSERT INTO REGISTRO_CITA 
            (NOMBRE_PACIENTE, NOMBRE_MEDICO, FECHA, HORA, MOTIVO, TIPO_CONSULTA) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(sql, [
            nombre_paciente,
            nombre_medico,
            fecha,
            hora,
            motivo,
            tipo_consulta
        ]);
        connection.release();
        res.send('<script>alert("Cita registrada con éxito"); window.location.href = "/index.html";</script>');
    } catch (error) {
        console.error("Error al registrar cita:", error.message);
        res.status(500).send("Error al registrar cita");
    }
});

/**
 * Obtiene el historial de citas médicas.
 * @name GET /historial
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.get("/historial", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM REGISTRO_CITA");
        res.send(rows);
    } catch (error) {
        console.error("Error al cargar historial:", error);
        res.status(500).send("Error al cargar historial médico.");
    }
});

/**
 * Obtiene el historial médico.
 * @name GET /historialMedico
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.get("/historialMedico", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM REPORTE_MEDICO");
        res.send(rows);
    } catch (error) {
        console.error("Error al cargar historial:", error);
        res.status(500).send("Error al cargar historial médico.");
    }
});

/**
 * Guarda un nuevo reporte médico en la base de datos.
 * @name POST /guardar-reporte
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.body - Datos del reporte médico.
 * @param {string} req.body.nombre_paciente - Nombre del paciente.
 * @param {string} req.body.nombre_medico - Nombre del médico.
 * @param {number} req.body.edad - Edad del paciente.
 * @param {string} req.body.problemas - Problemas del paciente.
 * @param {string} req.body.identificacion - Identificación del paciente.
 * @param {string} req.body.tratamiento - Tratamiento del paciente.
 * @param {string} req.body.detalles - Detalles adicionales.
 * @param {string} req.body.medicamentos - Medicamentos recetados.
 * @param {string} req.body.graveda_paciente - Gravedad del paciente.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.post('/guardar-reporte', async (req, res) => {
    const {
        nombre_paciente,
        nombre_medico,
        edad,
        problemas,
        identificacion,
        tratamiento,
        detalles,
        medicamentos,
        graveda_paciente
    } = req.body;

    try {
        const connection = await db.getConnection();
        const sql = `
            INSERT INTO REPORTE_MEDICO 
            (NOMBRE_PACIENTE, NOMBRE_MEDICO, EDAD, PROBLEMAS, IDENTIFICACION, TRATAMIENTO, DETALLES, MEDICAMENTOS, GRAVEDA_PACIENTE) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(sql, [
            nombre_paciente,
            nombre_medico,
            edad,
            problemas,
            identificacion,
            tratamiento,
            detalles,
            medicamentos,
            graveda_paciente
        ]);
        connection.release();
        res.send('<script>alert("Reporte registrado con éxito"); window.location.href = "/index.html";</script>');
    } catch (error) {
        console.error("Error al registrar reporte:", error.message);
        res.status(500).send("Error al registrar cita");
    }
});

/**
 * Actualiza un reporte médico existente en la base de datos.
 * @name POST /actualizar-reporte
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.body - Datos del reporte médico a actualizar.
 * @param {string} req.body.identificacion - Identificación del paciente.
 * @param {string} req.body.tratamiento - Tratamiento actualizado.
 * @param {string} req.body.problemas - Problemas actualizados.
 * @param {string} req.body.detalles - Detalles actualizados.
 * @param {string} req.body.medicamentos - Medicamentos actualizados.
 * @param {string} req.body.gravedad - Gravedad actualizada.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.post('/actualizar-reporte', async (req, res) => {
    const {
        identificacion,
        tratamiento,
        problemas,
        detalles,
        medicamentos,
        gravedad
    } = req.body;

    try {
        const connection = await db.getConnection();
        const sql = `
        UPDATE REPORTE_MEDICO
        SET TRATAMIENTO = ?, PROBLEMAS = ?, DETALLES = ?, MEDICAMENTOS = ?, GRAVEDA_PACIENTE = ?
        WHERE IDENTIFICACION = ?
      `;
        await connection.execute(sql, [
            tratamiento,
            problemas,
            detalles,
            medicamentos,
            gravedad,
            identificacion
        ]);
        connection.release();
        res.send("Actualización exitosa");
    } catch (error) {
        console.error("Error actualizando reporte:", error.message);
        res.status(500).send("Error actualizando reporte");
    }
});

/**
 * Maneja el inicio de sesión de un usuario.
 * @name POST /login
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.body - Credenciales del usuario.
 * @param {string} req.body.usuario - Nombre de usuario.
 * @param {string} req.body.contrasena - Contraseña del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.post("/login", async (req, res) => {
    const { usuario, contrasena } = req.body;

    console.log("📥 Solicitud POST /login recibida");
    console.log("🔐 Credenciales recibidas:", usuario, contrasena);

    try {
        const [rows] = await pool.query(
            'SELECT ID, NOMBRE, APELLIDO FROM USUARIO WHERE usuario = ? AND contrasena = ?',
            [usuario, contrasena]
        );

        if (rows.length > 0) {
            const nombreCompleto = `${rows[0].NOMBRE} ${rows[0].APELLIDO}`;
            return res.json({ success: true, nombre: nombreCompleto });
        } else {
            return res.status(401).json({
                success: false,
                message: "Usuario o contraseña incorrectos",
            });
        }
    } catch (err) {
        console.error("❌ Error en la consulta:", err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});


/**
 * Guarda un nuevo medicamento en la base de datos.
 * @name POST /guardar-medicamento
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.body - Datos del medicamento.
 * @param {string} req.body.nombre - Nombre del medicamento.
 * @param {number} req.body.cantidadDisponible - Cantidad disponible del medicamento.
 * @param {number} req.body.cantidadMinima - Cantidad mínima del medicamento.
 * @param {string} req.body.unidadMedida - Unidad de medida del medicamento.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.post("/guardar-medicamento", async (req, res) => {
    const { nombre, cantidadDisponible, cantidadMinima, unidadMedida } = req.body;

    try {
        const connection = await db.getConnection();
        const sql = `
        INSERT INTO MEDICAMENTOS (NOMBRE, CANTIDAD_DISPONIBLE, CANTIDAD_MINIMA, UNIDAD_MEDIDA)
        VALUES (?, ?, ?, ?)
      `;
        await connection.execute(sql, [
            nombre,
            cantidadDisponible,
            cantidadMinima,
            unidadMedida]);

        connection.release();
        res.send("Medicamento guardado con éxito");
    } catch (error) {
        console.error("Error al guardar medicamento:", error.message);
        res.status(500).send("Error al guardar medicamento");
    }
});

/**
* Obtiene la lista de medicamentos.
* @name GET /medicamentos
* @function
* @param {Object} req - Objeto de solicitud HTTP.
* @param {Object} res - Objeto de respuesta HTTP.
*/
app.get("/medicamentos", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nombre, cantidad_disponible, cantidad_minima, unidad_medida FROM medicamentos ");
        res.json(rows);
    } catch (error) {
        console.error("Error al cargar medicamentos:", error);
        res.status(500).send("Error al cargar medicamentos.");
    }
});


/**
 * Obtiene un medicamento específico por su ID.
 * @name GET /medicamentos/:id
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.id - ID del medicamento.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.get("/medicamentos/:id", async (req, res) => {
    try {
        const [medicamento] = await db.query("SELECT * FROM medicamentos WHERE id = ?", [req.params.id]);

        if (medicamento.length === 0) {
            return res.status(404).json({ error: "Medicamento no encontrado" });
        }

        res.json(medicamento[0]);
    } catch (error) {
        console.error("Error al obtener medicamento:", error);
        res.status(500).json({ error: "Error al obtener el medicamento" });
    }
});


/**
 * Actualiza un medicamento existente en la base de datos.
 * @name PUT /actualizar-medicamento/:id
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.id - ID del medicamento.
 * @param {Object} req.body - Datos del medicamento a actualizar.
 * @param {string} req.body.nombre - Nombre del medicamento.
 * @param {number} req.body.cantidad_disponible - Cantidad disponible actualizada.
 * @param {number} req.body.cantidad_minima - Cantidad mínima actualizada.
 * @param {string} req.body.unidad_medida - Unidad de medida actualizada.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.put("/actualizar-medicamento/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, cantidad_disponible, cantidad_minima, unidad_medida } = req.body;


        const [medicamento] = await db.query("SELECT * FROM medicamentos WHERE id = ?", [id]);

        if (medicamento.length === 0) {
            return res.status(404).json({ error: "Medicamento no encontrado" });
        }

        // Actualizar el medicamento
        await db.query(
            "UPDATE medicamentos SET nombre = ?, cantidad_disponible = ?, cantidad_minima = ?, unidad_medida = ? WHERE id = ?",
            [nombre, cantidad_disponible, cantidad_minima, unidad_medida, id]
        );

        res.json({ message: "Medicamento actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar medicamento:", error);
        res.status(500).json({ error: "Error al actualizar el medicamento" });
    }
});


/**
 * Elimina un medicamento de la base de datos.
 * @name DELETE /eliminar-medicamento/:id
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.id - ID del medicamento.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.delete("/eliminar-medicamento/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Verificar si el medicamento existe
        const [medicamento] = await db.query("SELECT * FROM medicamentos WHERE id = ?", [id]);

        if (medicamento.length === 0) {
            return res.status(404).json({ error: "Medicamento no encontrado" });
        }

        // Eliminar el medicamento
        await db.query("DELETE FROM medicamentos WHERE id = ?", [id]);

        res.json({ message: "Medicamento eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar medicamento:", error);
        res.status(500).json({ error: "Error al eliminar el medicamento" });
    }
});

/** 
* Middleware para manejar rutas no encontradas.
* @name Middleware 404
* @function
* @param {Object} request - Objeto de solicitud HTTP.
* @param {Object} response - Objeto de respuesta HTTP.
*/
app.use((request, response) => {
    response.status(404);
    response.send(`<h1>Error 404: Resource not found</h1>`)
})


/**
 * Middleware para manejar errores internos del servidor.
 * @name Middleware Error
 * @function
 * @param {Object} err - Objeto de error.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});