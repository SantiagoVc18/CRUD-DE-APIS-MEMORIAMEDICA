const express = require("express");
const router = express.Router();
const medicamentosController = require("../controllers/medicamentos.js");

router.post("/guardar-medicamento", medicamentosController.createMedicamento);
router.get("/obtener-todos", medicamentosController.getObtenertodoslosMedicamentos);
router.get("/obtener-medicamento/:id", medicamentosController.getMedicamentoById);
router.put("/actualizar-medicamento/:id", medicamentosController.updateMedicamento);
router.delete("/eliminar-medicamento/:id", medicamentosController.deleteMedicamento);

module.exports = router;