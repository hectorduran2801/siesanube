const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userfileController = require("../controllers/userfileController");

// Obtener todos los usuarios y archivso asignados
router.get("/getAll", userfileController.getUsersAndFiles);

// Obtener archivos por ID de usuario
router.get(
  "/getUserFiles/:id/:reason",
  userfileController.getUserFilesByUserId
);

// Ruta para enviar email con archivos adjuntados
router.post(
  "/getUserFiles/send-email/:email",
  userfileController.sendUserFilesByEmail
);

// Ruta para enviar email con enlace
router.post(
  "/getUserFiles/send-email-link",
  userfileController.sendUserFilesByEmailLink
);

// Eliminar un usuario
router.delete("/delete/:id/:reason", userfileController.deleteUser);

// Agregar userFile
router.post("/addUserFiles", userfileController.addUserFiles);

module.exports = router;
