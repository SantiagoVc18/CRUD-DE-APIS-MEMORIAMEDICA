const db = require('../backend/persistencia/db.js');
const pool = require('../backend/persistencia/db.js');

exports.postRegistrarPaciente = async (req, res) => {
    console.log("📥 Datos recibidos:", req.body);

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

    // Validar que todos los campos requeridos estén presentes
    const camposRequeridos = {
        nombre, apellido, edad, telefono, identificacion,
        genero, fecha_nacimiento, estado_civil, direccion, tipo_usuario
    };

    for (const [campo, valor] of Object.entries(camposRequeridos)) {
        if (valor === undefined || valor === null || valor === '') {
            console.error(`❌ Campo ${campo} está vacío o es undefined`);
            return res.status(400).json({
                error: `El campo ${campo} es requerido`
            });
        }
    }

    try {
        const connection = await db.getConnection();
        const sql = `
            INSERT INTO PERSONA
            (NOMBRE, APELLIDO, EDAD, TELEFONO, IDENTIFICACION, GENERO, FECHA_NACIMIENTO, ESTADO_CIVIL, DIRECCION, TIPO_USUARIO)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            nombre,
            apellido,
            parseInt(edad),
            telefono,
            identificacion,
            genero,
            fecha_nacimiento,
            estado_civil,
            direccion,
            tipo_usuario
        ];

        console.log("📝 Valores a insertar:", valores);

        await connection.execute(sql, valores);
        connection.release();
        
        res.json({
            success: true,
            message: "Registro exitoso"
        });
    } catch (error) {
        console.error("❌ Error al registrar:", error.message);
        res.status(500).json({
            error: "Error al registrar",
            detalles: error.message
        });
    }
};

exports.postRegistrarCita = async (req, res) => {
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
};

exports.getObtenerHistorialCitas = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM REGISTRO_CITA");
        res.json(rows);
    } catch (error) {
        console.error("Error al cargar citas:", error);
        res.status(500).send("Error al cargar citas.");
    }
};

exports.getObtenerHistorialMedico = async (req,res) => {
     try {
        const [rows] = await db.query("SELECT * FROM REPORTE_MEDICO");
        res.send(rows);
    } catch (error) {
        console.error("Error al cargar historial:", error);
        res.status(500).send("Error al cargar historial médico.");
    }
}

exports.postGuardarReporte = async (req,res) => {
    const {
        nombre_paciente,
        nombre_medico,
        edad,
        problemas,
        identificacion,
        tratamiento,
        detalles,
        medicamentos,
        graveda_paciente,
        cantidad_medicamento
    } = req.body;

    try {
        // Convertir valores numéricos
        const edadNum = parseInt(edad) || 0;
        const cantidadNum = parseInt(cantidad_medicamento) || 0;

        const connection = await db.getConnection();
        const sql = `
            INSERT INTO REPORTE_MEDICO 
            (NOMBRE_PACIENTE, NOMBRE_MEDICO, EDAD, PROBLEMAS, IDENTIFICACION, TRATAMIENTO, DETALLES, MEDICAMENTOS, GRAVEDA_PACIENTE, CANTIDAD) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(sql, [
            nombre_paciente,
            nombre_medico,
            edadNum,
            problemas,
            identificacion,
            tratamiento,
            detalles,
            medicamentos,
            graveda_paciente,
            cantidadNum
        ]);
        connection.release();
        res.json({ success: true, message: "Reporte registrado con éxito" });
    } 
    catch (error) {
        console.error("Error al registrar reporte:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Error al registrar reporte",
            error: error.message 
        });
    }
}

exports.postActulizarReporte = async (req,res) => {
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
        res.json({ mensaje: "Actualización exitosa" });
    } catch (error) {
        console.error("Error actualizando reporte:", error.message);
        res.status(500).send("Error actualizando reporte");
    }
}

exports.postLogin = async (req,res) => {
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
}