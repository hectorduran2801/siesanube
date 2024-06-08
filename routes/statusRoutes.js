const express = require("express");
const router = express.Router();
const statusController = require("../controllers/statusController");
const authMiddleware = require("../middleware/authMiddleware");

// Agregar Status
router.post("/addStatus", statusController.addStatus);

// Actualizar Status
router.put("/updateStatus/:id", statusController.updateStatus);

// Eliminar Status
router.delete("/deleteStatus/:id", statusController.deleteStatus);

// Obtener todos los Status
router.get("/getAllStatuses", statusController.getAllStatuses);

module.exports = router;
