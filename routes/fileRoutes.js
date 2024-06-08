const express = require("express");
const router = express.Router();
const FileController = require("../controllers/fileController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Agregar File
router.post("/addFile", upload, FileController.addFile);

// Editar File
router.put("/updateFiles/:id", upload, FileController.updateFile);

// Eliminar File
router.delete("/deleteFile/:id", FileController.deleteFile);

// Obtener todos los files
router.get("/getAllFiles", FileController.getAllFiles);

// Obtener datos del file
router.get("/file-details/:id", FileController.getFileDetailsById);

//Obtener url del archivo
router.get("/getURLFile/:id", FileController.getURLFileDetailsById);

module.exports = router;
