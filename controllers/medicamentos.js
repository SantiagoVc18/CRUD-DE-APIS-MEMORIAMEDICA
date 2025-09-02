const db = require('../backend/persistencia/db.js');
const pool = require('../backend/persistencia/db.js');

// Obtener todos los medicamentos
exports.getObtenertodoslosMedicamentos = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nombre, cantidad_disponible, cantidad_minima, unidad_medida FROM medicamentos ");
        res.json(rows);
    } catch (error) {
        console.error("Error al cargar medicamentos:", error);
        res.status(500).send("Error al cargar medicamentos.");
    }
};

// Crear un nuevo medicamento
exports.createMedicamento = async (req, res) => {
    const { nombre, cantidad_disponible, cantidad_minima, unidad_medida } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || cantidad_disponible === undefined || cantidad_minima === undefined || !unidad_medida) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    try {
        const connection = await db.getConnection();
        const sql = `
            INSERT INTO medicamentos (nombre, cantidad_disponible, cantidad_minima, unidad_medida)
            VALUES (?, ?, ?, ?)
        `;
        await connection.execute(sql, [nombre, cantidad_disponible, cantidad_minima, unidad_medida]);
        connection.release();
        res.json({ message: "Medicamento guardado con éxito" });
    } catch (error) {
        console.error("Error al guardar medicamento:", error.message);
        res.status(500).json({ error: "Error al guardar medicamento" });
    }
};

// Obtener un medicamento por ID
exports.getMedicamentoById = async (req, res) => {
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
};

// Actualizar un medicamento
exports.updateMedicamento = async (req, res) => {
    const id = req.params.id;
        const {
        nombre,
        cantidad_disponible,
        cantidad_minima,
        unidad_medida,
        } = req.body;

    try {
        const [medicamento] = await db.query("SELECT * FROM medicamentos WHERE id = ?", [id]);

        if (medicamento.length === 0) {
            return res.status(404).json({ error: "Medicamento no encontrado" });
        }

        await db.query(
            "UPDATE medicamentos SET nombre = ?, cantidad_disponible = ?, cantidad_minima = ?, unidad_medida = ? WHERE id = ?",
            [nombre, cantidad_disponible, cantidad_minima, unidad_medida, id]
        );

        res.json({ message: "Medicamento actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar medicamento:", error);
        res.status(500).json({ error: "Error al actualizar el medicamento" });
    }
};

// Eliminar un medicamento
exports.deleteMedicamento = async (req, res) => {
    const id = req.params.id;

    try {
        const [medicamento] = await db.query("SELECT * FROM medicamentos WHERE id = ?", [id]);

        if (medicamento.length === 0) {
            return res.status(404).json({ error: "Medicamento no encontrado" });
        }

        await db.query("DELETE FROM medicamentos WHERE id = ?", [id]);

        res.json({ message: "Medicamento eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar medicamento:", error);
        res.status(500).json({ error: "Error al eliminar el medicamento" });
    }
};