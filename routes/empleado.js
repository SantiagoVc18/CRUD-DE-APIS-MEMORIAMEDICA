const express = require("express");
const router = express.Router();
const empleadosController = require("../controllers/empleado.js");


/**
 * Rutas para el manejo de pacientes y citas
 */

// Registro de pacientes
router.post("/registrar-paciente", empleadosController.postRegistrarPaciente);

// Gestión de citas
router.post("/registrar-cita", empleadosController.postRegistrarCita);
router.get("/historial-citas", empleadosController.getObtenerHistorialCitas);

// Gestión de historial médico
router.get("/historial-medico", empleadosController.getObtenerHistorialMedico);
router.post("/guardar-reporte", empleadosController.postGuardarReporte);
router.post("/actualizar-reporte", empleadosController.postActulizarReporte);

// Autenticación
router.post("/login", empleadosController.postLogin);

module.exports = router;