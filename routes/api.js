const express = require("express");
const router = express.Router();
const medicamentosRoutes = require("./medicamentos");
const empleadosRoutes = require("./empleado");


// Montaje de rutas principales
router.use("/medicamentos", medicamentosRoutes);
router.use("/empleado", empleadosRoutes);


module.exports = router;