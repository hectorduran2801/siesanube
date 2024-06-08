const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// Iniciar sesión
router.post("/login", userController.login);

// Registrar un nuevo usuario
router.post("/register", userController.registerUser);

// Ruta para obtener detalles de usuarios
router.get("/user-details", userController.getUserDetails);

// Actualizar un usuario
router.put("/update/:id", userController.updateUser);

// Eliminar un usuario
router.delete("/delete/:id", userController.deleteUser);

// Ruta para obtener emails
router.get("/user-emails-details", userController.getUserEmailsDetails);

// Ruta para obtener detalles de un usuario por ID
router.get("/user-details/:id", userController.getUserDetailsById);

module.exports = router;
