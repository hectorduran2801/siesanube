const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const authMiddleware = require("../middleware/authMiddleware");

// Agregar Rol
router.post("/addRole", roleController.addRole);

// Actualizar Rol
router.put("/updateRole/:id", roleController.updateRole);

// Eliminar Rol
router.delete("/deleteRole/:id", roleController.deleteRole);

// Obtener todos los Roles
router.get("/getAllRoles", roleController.getAllRoles);

module.exports = router;
